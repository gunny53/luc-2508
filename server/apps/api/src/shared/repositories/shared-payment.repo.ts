import { Injectable, BadRequestException, Logger } from '@nestjs/common'
import { OrderStatus, OrderStatusType } from '@shared/constants/order.constant'
import { PaymentStatus } from '@shared/constants/payment.constant'
import { PrismaService } from '@shared/services/prisma.service'
import { PaymentProducer } from '../queue/producer/payment.producer'
import { SharedShippingRepository } from './shared-shipping.repo'

@Injectable()
export class SharedPaymentRepository {
  private readonly logger = new Logger(SharedPaymentRepository.name)

  constructor(
    private readonly prismaService: PrismaService,
    private readonly paymentProducer: PaymentProducer,
    private readonly sharedShippingRepository: SharedShippingRepository
  ) {}

  async validateAndFindPayment(paymentId: number) {
    const payment = await this.prismaService.payment.findUnique({
      where: { id: paymentId },
      include: {
        orders: {
          include: {
            items: true,
            discounts: true,
            shipping: true
          }
        }
      }
    })
    if (!payment) throw new BadRequestException(`Cannot find payment with id ${paymentId}`)
    return payment
  }

  validatePaymentAmount(expectedAmount: string, actualAmount: string | number) {
    const expected = parseFloat(expectedAmount)
    const actual = parseFloat(actualAmount.toString())

    if (Math.abs(expected - actual) > 0.01) {
      throw new BadRequestException(`Price not match, expected ${expected} but got ${actual}`)
    }
  }

  async updatePaymentAndOrdersOnSuccess(paymentId: number, orders: Array<{ id: string }>) {
    this.logger.log(`Updating related orders for payment ${paymentId}`)

    
    await this.updatePaymentStatus(paymentId, PaymentStatus.SUCCESS)

    
    await this.updateOrdersStatus(
      orders.map((o) => o.id),
      OrderStatus.PENDING_PACKAGING
    )

    this.logger.log(`Processing related orders after payment update.`)
    try {
      for (const order of orders) {
        this.logger.log(`Processing order ${order.id} after payment update`)

        const result = await this.sharedShippingRepository.createGHNOrderForOrder(order.id)

        if (result.success) {
          this.logger.log(`Processing order ${order.id} after payment update`)
        } else {
          this.logger.warn(`Failed to process order ${order.id}: ${result.message}`)
        }
      }
    } catch (error) {
      this.logger.error(`Payment follow-up failed: ${error.message}`)
    }
  }

  private async updatePaymentStatus(paymentId: number, status: PaymentStatus) {
    await this.prismaService.payment.update({
      where: { id: paymentId },
      data: { status }
    })
  }

  private async updateOrdersStatus(orderIds: string[], status: OrderStatusType) {
    await this.prismaService.order.updateMany({
      where: { id: { in: orderIds } },
      data: { status }
    })
  }

  async updatePaymentAndOrdersOnFailed(paymentId: number, orders: Array<{ id: string }>) {
    await this.updatePaymentStatus(paymentId, PaymentStatus.FAILED)
    await this.prismaService.order.updateMany({
      where: {
        id: { in: orders.map((o) => o.id) },
        status: OrderStatus.PENDING_PAYMENT,
        deletedAt: null
      },
      data: { status: OrderStatus.CANCELLED }
    })
    await this.paymentProducer.removeJob(paymentId)
  }

  async cancelPaymentAndOrder(paymentId: number) {
    const payment = await this.validateAndFindPayment(paymentId)
    const { orders } = payment
    const productSKUSnapshots = orders.map((order) => order.items).flat()

    await this.prismaService.$transaction(async (tx) => {
      await this.cancelPendingOrders(tx, orders)
      await this.restoreSKUStock(tx, productSKUSnapshots)
      await this.updatePaymentStatusInTransaction(tx, paymentId, PaymentStatus.FAILED)
    })
    try {
      for (const order of orders) {
        await this.sharedShippingRepository.cancelGHNOrderForOrder(order.id)
      }
    } catch (error) {
      this.logger.warn(`Failed to parse payment metadata: ${error?.message}`)
    }

    await this.paymentProducer.removeJob(paymentId)
  }

  private async cancelPendingOrders(tx: any, orders: any[]) {
    await tx.order.updateMany({
      where: {
        id: { in: orders.map((order) => order.id) },
        status: OrderStatus.PENDING_PAYMENT,
        deletedAt: null
      },
      data: { status: OrderStatus.CANCELLED }
    })
  }

  private async restoreSKUStock(tx: any, productSKUSnapshots: any[]) {
    await Promise.all(
      productSKUSnapshots
        .filter((item) => item.skuId)
        .map((item) =>
          tx.sKU.update({
            where: { id: item.skuId as string },
            data: { stock: { increment: item.quantity } }
          })
        )
    )
  }

  private async updatePaymentStatusInTransaction(tx: any, paymentId: number, status: PaymentStatus) {
    await tx.payment.update({
      where: { id: paymentId },
      data: { status }
    })
  }

  getTotalPrice(
    orders: Array<{
      items: Array<{ skuPrice: number; quantity: number }>
      discounts?: Array<{ discountAmount: number }> | null
      shipping?: { shippingFee: number | null } | null
    }>
  ): string {
    const basePrice = this.calculateBasePrice(orders)
    const shippingFee = this.calculateTotalShippingFee(orders)
    return (basePrice + shippingFee).toString()
  }

  private calculateBasePrice(orders: any[]): number {
    return orders.reduce((totalOrder, order) => {
      const productTotal = (order.items || []).reduce(
        (sum: number, sku: any) => sum + (sku.skuPrice || 0) * (sku.quantity || 0),
        0
      )
      const discountTotal = (order.discounts || [])?.reduce((sum: number, d: any) => sum + d.discountAmount, 0) || 0
      return totalOrder + (productTotal - discountTotal)
    }, 0)
  }

  private calculateTotalShippingFee(orders: any[]): number {
    return orders.reduce((total, order) => total + (order.shipping?.shippingFee || 0), 0)
  }

  extractPaymentId(prefix: string, ...sources: string[]): number | null {
    for (const source of sources) {
      if (typeof source === 'string' && source.includes(prefix)) {
        const parts = source.split(prefix)
        if (parts.length > 1) {
          const id = Number(parts[1].replace(/\D/g, ''))
          if (!isNaN(id)) return id
        }
      }
    }
    return null
  }
}
