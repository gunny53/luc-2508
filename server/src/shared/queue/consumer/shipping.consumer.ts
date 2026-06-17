import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { Inject } from '@nestjs/common'
import { GHN_CLIENT } from 'src/shared/constants/shipping.constants'
import { OrderShippingStatus, OrderShippingStatusType } from 'src/shared/constants/order-shipping.constants'
import { PrismaService } from 'src/shared/services/prisma.service'
import {
  CREATE_SHIPPING_ORDER_JOB,
  PROCESS_GHN_WEBHOOK_JOB,
  CANCEL_GHN_ORDER_JOB,
  CREATE_GHN_ORDER_JOB,
  SHIPPING_QUEUE_NAME
} from 'src/shared/constants/queue.constant'
import { CreateOrderType, GHNWebhookPayloadType } from 'src/routes/shipping/ghn/shipping-ghn.model'

type GHNOrderResponse = {
  order_code: string
  expected_delivery_time: string | Date
  [key: string]: any
}
import { Ghn } from 'giaohangnhanh'
import { OrderStatus } from 'src/shared/constants/order.constant'

@Injectable()
@Processor(SHIPPING_QUEUE_NAME, {
  concurrency: 3,
  maxStalledCount: 2,
  stalledInterval: 30000,
  removeOnComplete: {
    age: 1000 * 60 * 60,
    count: 50
  },
  removeOnFail: {
    age: 1000 * 60 * 60,
    count: 20
  }
})
export class ShippingConsumer extends WorkerHost {
  private readonly logger = new Logger(ShippingConsumer.name)

  constructor(
    @Inject(GHN_CLIENT) private readonly ghnClient: Ghn,
    private readonly prismaService: PrismaService
  ) {
    super()
  }

  async process(job: Job<CreateOrderType | GHNWebhookPayloadType, any, string>): Promise<any> {
    this.logger.log(`English content normalized from the original source text.${job.id} - ${job.name}`)

    try {
      switch (job.name) {
        case CREATE_SHIPPING_ORDER_JOB:
          return await this.processCreateShippingOrder(job.data as CreateOrderType)
        case PROCESS_GHN_WEBHOOK_JOB:
          return await this.processWebhook(job as Job<GHNWebhookPayloadType>)
        case CANCEL_GHN_ORDER_JOB:
          return await this.processCancelGHNOrder(job.data as { orderCode: string; orderId: string })
        case CREATE_GHN_ORDER_JOB:
          return await this.processCreateGHNOrder(job.data as { orderId: string })
        default:
          throw new Error(`Unknown job type: ${job.name}`)
      }
    } catch (error) {
      this.logger.error(`English content normalized from the original source text.${job.id}: ${error.message}`)
      await this.handleJobError(job, error)
      throw error
    }
  }

  /* English content normalized from the original source text. */
  private async processCreateShippingOrder(data: CreateOrderType) {
    const orderId = this.extractOrderIdFromClientOrderCode(data.client_order_code)
    if (!orderId) {
      throw new Error(`Invalid client_order_code: ${data.client_order_code}`)
    }

    const existingShipping = await this.findExistingShipping(orderId)
    if (!existingShipping) {
      throw new Error(`OrderShipping not found for order: ${orderId}`)
    }

    if (this.isOrderAlreadyProcessed(existingShipping)) {
      return { message: 'Order already processed', orderCode: existingShipping.orderCode }
    }

    await this.updateOrderShippingStatus(orderId, OrderShippingStatus.ENQUEUED)

    const ghnResult = await this.createGHNOrder(data)
    await this.updateOrderShippingWithGHNResponse(orderId, ghnResult)

    return {
      message: 'Shipping order created successfully',
      orderCode: ghnResult.order_code,
      expectedDeliveryTime: ghnResult.expected_delivery_time
    }
  }

  /* English content normalized from the original source text. */
  private async processWebhook(job: Job<GHNWebhookPayloadType>) {
    const { orderCode, status } = job.data
    if (!orderCode || !status) {
      throw new Error('Missing required fields: orderCode or status')
    }

    const shipping = await this.findShippingWithOrder(orderCode)
    if (!shipping) {
      return { message: 'No shipping record found', orderCode }
    }

    const newOrderStatus = this.mapGHNStatusToOrderStatus(status)
    if (!newOrderStatus) {
      return { message: 'Unknown status, keeping current', orderCode, status }
    }

    // English content normalized from the original source text.
    const allowedStatuses = [
      OrderStatus.PICKUPED,
      OrderStatus.PENDING_DELIVERY,
      OrderStatus.DELIVERED,
      OrderStatus.RETURNED,
      OrderStatus.CANCELLED
    ]

    if (!allowedStatuses.includes(shipping.order.status as any)) {
      return {
        message: 'Order not ready for GHN status update',
        orderCode,
        currentStatus: shipping.order.status,
        ghnStatus: status
      }
    }

    if (shipping.order.status !== newOrderStatus) {
      await this.updateOrderStatus(shipping.orderId, newOrderStatus)
    }

    return {
      message: 'Webhook processed successfully',
      orderCode,
      oldStatus: shipping.order.status,
      newStatus: newOrderStatus,
      ghnStatus: status
    }
  }

  /**
   * Helper methods
   */
  private extractOrderIdFromClientOrderCode(clientOrderCode: string | null): string | null {
    if (!clientOrderCode) return null
    const match = clientOrderCode.match(/SSPX(.+)/)
    return match ? match[1] : null
  }

  private isOrderAlreadyProcessed(shipping: {
    orderCode?: string | null
    status?: OrderShippingStatusType | null
  }): boolean {
    return !!(shipping.orderCode && shipping.status && ['CREATED', 'PROCESSING'].includes(shipping.status))
  }

  private async updateOrderShippingStatus(
    orderId: string,
    status: OrderShippingStatusType,
    errorMessage?: string
  ): Promise<void> {
    const updateData = {
      status,
      lastUpdatedAt: new Date(),
      attempts: { increment: 1 },
      ...(errorMessage && { lastError: errorMessage })
    }

    await this.prismaService.orderShipping.updateMany({
      where: { orderId },
      data: updateData
    })
  }

  private async updateOrderShippingWithGHNResponse(orderId: string, ghnResponse: GHNOrderResponse): Promise<void> {
    const updateData = {
      orderCode: ghnResponse.order_code,
      expectedDeliveryTime: new Date(ghnResponse.expected_delivery_time),
      status: OrderShippingStatus.CREATED,
      attempts: { increment: 1 },
      lastUpdatedAt: new Date(),
      lastError: null
    }

    await this.prismaService.orderShipping.updateMany({
      where: { orderId },
      data: updateData
    })
  }

  private async createGHNOrder(data: CreateOrderType): Promise<GHNOrderResponse> {
    this.validateGHNOrderData(data)
    const ghnResponse = await this.ghnClient.order.createOrder(data)

    if (!ghnResponse.order_code) {
      throw new Error(`GHN API response missing order_code: ${JSON.stringify(ghnResponse)}`)
    }

    return ghnResponse
  }

  private validateGHNOrderData(data: CreateOrderType): void {
    const requiredFields = [
      'from_address',
      'from_name',
      'from_phone',
      'to_address',
      'to_name',
      'to_phone',
      'service_id',
      'weight',
      'length',
      'width',
      'height'
    ] as const

    const missingFields = requiredFields.filter((field) => !data[field])
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }

    const { weight, length, width, height } = data
    if (weight <= 0 || length <= 0 || width <= 0 || height <= 0) {
      throw new Error(`Invalid dimensions: weight=${weight}, length=${length}, width=${width}, height=${height}`)
    }
  }

  private async handleJobError(job: Job, error: Error): Promise<void> {
    try {
      if (job.name === CREATE_SHIPPING_ORDER_JOB) {
        const orderId = this.extractOrderIdFromClientOrderCode((job.data as CreateOrderType).client_order_code)
        if (orderId) {
          await this.updateOrderShippingStatus(orderId, OrderShippingStatus.FAILED, error.message)
        }
      }
    } catch (updateError) {
      this.logger.error(`[SHIPPING_CONSUMER] Failed to update order status after error: ${updateError.message}`)
    }
  }

  private async findExistingShipping(orderId: string) {
    return this.prismaService.orderShipping.findUnique({
      where: { orderId }
    })
  }

  private async findShippingWithOrder(orderCode: string) {
    return this.prismaService.orderShipping.findFirst({
      where: { orderCode },
      include: { order: true }
    })
  }

  private async updateOrderStatus(orderId: string, newStatus: (typeof OrderStatus)[keyof typeof OrderStatus]) {
    return this.prismaService.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    })
  }

  /**
   * Map GHN status sang OrderStatus
   */
  private mapGHNStatusToOrderStatus(ghnStatus: string): (typeof OrderStatus)[keyof typeof OrderStatus] | null {
    const statusMap = {
      // English content normalized from the original source text.
      ready_to_pick: OrderStatus.PICKUPED,

      // English content normalized from the original source text.
      picking: OrderStatus.PICKUPED,
      picked: OrderStatus.PICKUPED,

      // English content normalized from the original source text.
      storing: OrderStatus.PENDING_DELIVERY,
      transporting: OrderStatus.PENDING_DELIVERY,
      sorting: OrderStatus.PENDING_DELIVERY,
      delivering: OrderStatus.PENDING_DELIVERY,

      // English content normalized from the original source text.
      delivered: OrderStatus.DELIVERED,
      delivery_fail: OrderStatus.PENDING_DELIVERY,

      // English content normalized from the original source text.
      waiting_to_return: OrderStatus.RETURNED,
      return: OrderStatus.RETURNED,
      return_transporting: OrderStatus.RETURNED,
      return_sorting: OrderStatus.RETURNED,
      returning: OrderStatus.RETURNED,
      returned: OrderStatus.RETURNED,

      // English content normalized from the original source text.
      exception: OrderStatus.CANCELLED,
      damage: OrderStatus.CANCELLED,
      lost: OrderStatus.CANCELLED,
      cancel: OrderStatus.CANCELLED
    } as const

    return statusMap[ghnStatus as keyof typeof statusMap] || null
  }

  /* English content normalized from the original source text. */
  private async processCancelGHNOrder(data: { orderCode: string; orderId: string }) {
    const { orderCode, orderId } = data
    this.logger.log(`English content normalized from the original source text.${orderCode} cho order: ${orderId}`)

    try {
      // English content normalized from the original source text.
      const result = await this.ghnClient.order.cancelOrder({
        orderCodes: [orderCode]
      })

      this.logger.log(`English content normalized from the original source text.${JSON.stringify(result, null, 2)}`)

      // English content normalized from the original source text.
      if (result && Array.isArray(result)) {
        const orderResult = result.find((item: any) => item.order_code === orderCode)
        if (orderResult && orderResult.result === true) {
          this.logger.log(`English content normalized from the original source text.${orderCode}`)

          // English content normalized from the original source text.
          await this.prismaService.orderShipping.update({
            where: { orderId },
            data: {
              status: OrderShippingStatus.CANCELLED,
              lastUpdatedAt: new Date()
            }
          })

          return {
            success: true,
            message: `English content normalized from the original source text.${orderCode}`,
            orderCode
          }
        }
      }

      throw new Error(`English content normalized from the original source text.${orderCode}`)
    } catch (error) {
      this.logger.error(`English content normalized from the original source text.${error.message}`)
      // English content normalized from the original source text.
      await this.prismaService.orderShipping.update({
        where: { orderId },
        data: {
          status: OrderShippingStatus.FAILED,
          lastError: error.message,
          lastUpdatedAt: new Date()
        }
      })

      throw error
    }
  }

  /* English content normalized from the original source text. */
  private async processCreateGHNOrder(data: { orderId: string }) {
    const { orderId } = data
    this.logger.log(`English content normalized from the original source text.${orderId}`)

    try {
      // English content normalized from the original source text.
      const orderShipping = await this.prismaService.orderShipping.findUnique({
        where: { orderId }
      })

      if (!orderShipping) {
        throw new Error(`English content normalized from the original source text.${orderId}`)
      }

      if (orderShipping.status !== 'DRAFT') {
        throw new Error(`English content normalized from the original source text.${orderShipping.status}`)
      }

      const isCodOrder = (orderShipping.codAmount || 0) > 0
      const paymentTypeId = isCodOrder ? 2 : 1
      const codAmount = isCodOrder ? orderShipping.codAmount || 0 : 0

      // English content normalized from the original source text.
      const ghnOrderData = {
        from_address: orderShipping.fromAddress || '',
        from_name: orderShipping.fromName || '',
        from_phone: orderShipping.fromPhone || '',
        from_province_name: orderShipping.fromProvinceName || '',
        from_district_name: orderShipping.fromDistrictName || '',
        from_ward_name: orderShipping.fromWardName || '',
        to_address: orderShipping.toAddress || '',
        to_name: orderShipping.toName || '',
        to_phone: orderShipping.toPhone || '',
        to_district_id: orderShipping.toDistrictId || 0,
        to_ward_code: orderShipping.toWardCode || '',
        service_id: orderShipping.serviceId || 0,
        service_type_id: orderShipping.serviceTypeId || 0,
        weight: orderShipping.weight || 0,
        length: orderShipping.length || 0,
        width: orderShipping.width || 0,
        height: orderShipping.height || 0,
        cod_amount: codAmount,
        required_note: orderShipping.requiredNote || 'CHOTHUHANG',
        client_order_code: orderId,
        payment_type_id: paymentTypeId, // 1 = PREPAID, 2 = COD
        items: [
          {
            name: 'English content normalized from the original source text.',
            quantity: 1,
            weight: orderShipping.weight || 0
          }
        ]
      }

      this.logger.log(`[SHIPPING_CONSUMER] GHN order data: ${JSON.stringify(ghnOrderData, null, 2)}`)

      // English content normalized from the original source text.
      const result = await this.ghnClient.order.createOrder(ghnOrderData)

      this.logger.log(`English content normalized from the original source text.${JSON.stringify(result, null, 2)}`)

      // English content normalized from the original source text.
      if (result && result.order_code) {
        this.logger.log(`English content normalized from the original source text.${result.order_code}`)

        // English content normalized from the original source text.
        await this.prismaService.orderShipping.update({
          where: { orderId },
          data: {
            orderCode: result.order_code,
            status: OrderShippingStatus.CREATED,
            expectedDeliveryTime: result.expected_delivery_time ? new Date(result.expected_delivery_time) : null,
            lastUpdatedAt: new Date()
          }
        })

        return {
          success: true,
          message: `English content normalized from the original source text.${result.order_code}`,
          orderCode: result.order_code
        }
      }

      throw new Error('English content normalized from the original source text.')
    } catch (error) {
      this.logger.error(`English content normalized from the original source text.${error.message}`)

      // English content normalized from the original source text.
      await this.prismaService.orderShipping.update({
        where: { orderId },
        data: {
          status: OrderShippingStatus.FAILED,
          lastError: error.message,
          lastUpdatedAt: new Date()
        }
      })

      throw error
    }
  }
}
