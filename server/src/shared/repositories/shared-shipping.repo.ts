import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { OrderShippingStatusType } from 'src/shared/constants/order-shipping.constants'
import { ShippingProducer } from 'src/shared/queue/producer/shipping.producer'

type CreateOrderShippingData = {
  orderId: string
  serviceId?: number
  serviceTypeId?: number
  configFeeId?: string
  extraCostId?: string
  weight?: number
  length?: number
  width?: number
  height?: number
  shippingFee: number
  codAmount: number
  note?: string
  requiredNote?: string
  pickShift?: any
  status?: OrderShippingStatusType
  fromAddress: string
  fromName: string
  fromPhone: string
  fromProvinceName: string
  fromDistrictName: string
  fromWardName: string
  fromDistrictId: number
  fromWardCode: string
  toAddress: string
  toName: string
  toPhone: string
  toDistrictId: number
  toWardCode: string
}

@Injectable()
export class SharedShippingRepository {
  private readonly logger = new Logger(SharedShippingRepository.name)

  constructor(
    private readonly prismaService: PrismaService,
    private readonly shippingProducer: ShippingProducer
  ) {}

  /* English content normalized from the original source text. */
  async createOrderShipping(data: CreateOrderShippingData) {
    this.logger.log(`English content normalized from the original source text.${data.orderId}`)

    try {
      const orderShipping = await this.prismaService.orderShipping.create({
        data: {
          orderId: data.orderId,
          serviceId: data.serviceId,
          serviceTypeId: data.serviceTypeId,
          configFeeId: data.configFeeId,
          extraCostId: data.extraCostId,
          weight: data.weight,
          length: data.length,
          width: data.width,
          height: data.height,
          shippingFee: data.shippingFee,
          codAmount: data.codAmount,
          expectedDeliveryTime: null,
          trackingUrl: null,
          status: data.status,
          note: data.note,
          requiredNote: data.requiredNote,
          pickShift: data.pickShift,
          attempts: 0,
          lastError: null,
          fromAddress: data.fromAddress,
          fromName: data.fromName,
          fromPhone: data.fromPhone,
          fromProvinceName: data.fromProvinceName,
          fromDistrictName: data.fromDistrictName,
          fromWardName: data.fromWardName,
          fromDistrictId: data.fromDistrictId,
          fromWardCode: data.fromWardCode,
          toAddress: data.toAddress,
          toName: data.toName,
          toPhone: data.toPhone,
          toDistrictId: data.toDistrictId,
          toWardCode: data.toWardCode
        }
      })

      this.logger.log(`[SHARED_SHIPPING] OrderShipping created successfully: ${JSON.stringify(orderShipping, null, 2)}`)
      return orderShipping
    } catch (error) {
      this.logger.error(`English content normalized from the original source text.${error.message}`, error.stack)
      throw error
    }
  }

  /* English content normalized from the original source text. */
  async updateOrderShippingStatus(orderId: string, status: OrderShippingStatusType) {
    this.logger.log(`English content normalized from the original source text.${orderId}English content normalized from the original source text.${status}`)

    try {
      const result = await this.prismaService.orderShipping.update({
        where: { orderId },
        data: { status }
      })

      this.logger.log(`[SHARED_SHIPPING] OrderShipping status updated successfully: ${JSON.stringify(result, null, 2)}`)
      return result
    } catch (error) {
      this.logger.error(`English content normalized from the original source text.${error.message}`, error.stack)
      throw error
    }
  }

  /* English content normalized from the original source text. */
  async getOrderShippingInfo(orderId: string) {
    return this.prismaService.orderShipping.findUnique({
      where: { orderId }
    })
  }

  /* English content normalized from the original source text. */
  async getGHNOrderCode(orderId: string): Promise<string | null> {
    const orderShipping = await this.prismaService.orderShipping.findUnique({
      where: { orderId },
      select: { orderCode: true, status: true }
    })

    // English content normalized from the original source text.
    if (orderShipping?.status === 'CREATED' && orderShipping.orderCode) {
      return orderShipping.orderCode
    }

    return null
  }

  /* English content normalized from the original source text. */
  async updateOrderShippingStatusForCancellation(
    orderId: string,
    status: OrderShippingStatusType,
    errorMessage?: string
  ) {
    return this.prismaService.orderShipping.update({
      where: { orderId },
      data: {
        status,
        lastError: errorMessage,
        lastUpdatedAt: new Date()
      }
    })
  }

  /* English content normalized from the original source text. */
  async cancelGHNOrderForOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log(`English content normalized from the original source text.${orderId}`)

      // English content normalized from the original source text.
      const orderShipping = await this.prismaService.orderShipping.findUnique({
        where: { orderId },
        select: { orderCode: true, status: true }
      })

      if (!orderShipping?.orderCode) {
        this.logger.warn(`English content normalized from the original source text.${orderId}`)
        return {
          success: false,
          message: 'English content normalized from the original source text.'
        }
      }

      if (orderShipping.status !== 'CREATED') {
        this.logger.warn(`English content normalized from the original source text.${orderShipping.status}`)
        return {
          success: false,
          message: `English content normalized from the original source text.${orderShipping.status}`
        }
      }

      // English content normalized from the original source text.
      await this.shippingProducer.enqueueCancelGHNOrder(orderShipping.orderCode, orderId)

      this.logger.log(`English content normalized from the original source text.${orderShipping.orderCode}`)

      return {
        success: true,
        message: `English content normalized from the original source text.${orderShipping.orderCode}`
      }
    } catch (error) {
      this.logger.error(`English content normalized from the original source text.${error.message}`)
      return {
        success: false,
        message: `English content normalized from the original source text.${error.message}`
      }
    }
  }

  /* English content normalized from the original source text. */
  async getShopAddressForShipping(shopId: string): Promise<{ shop: any; address: any }> {
    this.logger.log(`English content normalized from the original source text.${shopId}`)

    try {
      // English content normalized from the original source text.
      const shopData = await this.prismaService.user.findUnique({
        where: { id: shopId }
      })

      if (!shopData) {
        this.logger.error(`English content normalized from the original source text.${shopId}`)
        throw new Error('Shop not found')
      }

      this.logger.log(`[SHARED_SHIPPING] Shop data: ${JSON.stringify(shopData, null, 2)}`)

      // English content normalized from the original source text.
      this.logger.log(`English content normalized from the original source text.`)
      let shopUserAddress = await this.prismaService.userAddress.findFirst({
        where: { userId: shopId, isDefault: true },
        include: { address: true }
      })

      // English content normalized from the original source text.
      if (!shopUserAddress) {
        this.logger.warn(
          `English content normalized from the original source text.${shopId}`
        )
        shopUserAddress = await this.prismaService.userAddress.findFirst({
          where: { userId: shopId },
          include: { address: true }
        })
      }

      if (!shopUserAddress) {
        this.logger.error(`English content normalized from the original source text.${shopId}`)
        throw new Error('Shop has no addresses')
      }

      if (!shopUserAddress.address) {
        this.logger.error(`English content normalized from the original source text.${shopId}`)
        throw new Error('Shop address data not found')
      }

      this.logger.log(`[SHARED_SHIPPING] Shop UserAddress: ${JSON.stringify(shopUserAddress, null, 2)}`)
      this.logger.log(`[SHARED_SHIPPING] Shop address: ${JSON.stringify(shopUserAddress.address, null, 2)}`)

      // English content normalized from the original source text.
      if (!shopUserAddress.address.province || !shopUserAddress.address.district || !shopUserAddress.address.ward) {
        this.logger.error(`English content normalized from the original source text.${shopId}`)
        throw new Error('Shop address missing required location information')
      }

      const result = {
        shop: shopData,
        address: shopUserAddress.address
      }

      this.logger.log(`[SHARED_SHIPPING] Shop address info: ${JSON.stringify(result, null, 2)}`)
      return result
    } catch (error) {
      this.logger.error(`English content normalized from the original source text.${error.message}`, error.stack)
      throw error
    }
  }

  /* English content normalized from the original source text. */
  async createGHNOrderForOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log(`English content normalized from the original source text.${orderId}`)

      // English content normalized from the original source text.
      const orderShipping = await this.prismaService.orderShipping.findUnique({
        where: { orderId },
        select: { status: true }
      })

      if (!orderShipping) {
        this.logger.warn(`English content normalized from the original source text.${orderId}`)
        return {
          success: false,
          message: 'English content normalized from the original source text.'
        }
      }

      if (orderShipping.status !== 'DRAFT') {
        this.logger.warn(
          `English content normalized from the original source text.${orderShipping.status}`
        )
        return {
          success: false,
          message: `English content normalized from the original source text.${orderShipping.status}`
        }
      }

      // English content normalized from the original source text.
      await this.shippingProducer.enqueueCreateGHNOrder(orderId)

      this.logger.log(`English content normalized from the original source text.${orderId}`)

      return {
        success: true,
        message: `English content normalized from the original source text.${orderId}`
      }
    } catch (error) {
      this.logger.error(`English content normalized from the original source text.${error.message}`)
      return {
        success: false,
        message: `English content normalized from the original source text.${error.message}`
      }
    }
  }
}
