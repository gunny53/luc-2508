import { Injectable } from '@nestjs/common'
import { PrismaService } from '@shared/services/prisma.service'

@Injectable()
export class SharedOrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getOrderWithShippingForGHN(orderId: string) {
    return this.prismaService.order.findUnique({
      where: {
        id: orderId,
        deletedAt: null
      },
      include: {
        items: true,
        discounts: true,
        shipping: true,
        shop: {
          include: {
            UserAddress: {
              where: { isDefault: true },
              include: { address: true }
            }
          }
        }
      }
    })
  }

  async getGHNOrderCode(orderId: string): Promise<string | null> {
    const orderShipping = await this.prismaService.orderShipping.findUnique({
      where: { orderId },
      select: { orderCode: true, status: true }
    })
    if (orderShipping?.status === 'CREATED' && orderShipping.orderCode) {
      return orderShipping.orderCode
    }

    return null
  }
}
