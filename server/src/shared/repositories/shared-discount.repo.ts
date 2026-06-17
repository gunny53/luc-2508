import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { DiscountStatus } from 'src/shared/constants/discount.constant'

type DiscountWithIncludes = {
  id: string
  code: string
  name: string
  description: string | null
  value: number
  discountType: string
  discountApplyType: string
  discountStatus: string
  startDate: Date
  endDate: Date
  maxUses: number
  maxUsesPerUser: number | null
  usesCount: number
  usersUsed: string[]
  maxDiscountValue: number | null
  minOrderValue: number | null
  isPlatform: boolean
  voucherType: string
  displayType: string
  products: { id: string }[]
  categories: { id: string }[]
  brands: { id: string }[]
}

@Injectable()
export class SharedDiscountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // ============================================================
  // DATA ACCESS METHODS - Repository Pattern
  // ============================================================

  /* English content normalized from the original source text. */
  async findDiscountsByCodes(discountCodes: string[]): Promise<DiscountWithIncludes[]> {
    if (discountCodes.length === 0) {
      return []
    }

    return this.prismaService.discount.findMany({
      where: { code: { in: discountCodes } },
      include: {
        products: { select: { id: true } },
        categories: { select: { id: true } },
        brands: { select: { id: true } }
      }
    })
  }

  /* English content normalized from the original source text. */
  async findPlatformDiscountsByCodes(discountCodes: string[]): Promise<DiscountWithIncludes[]> {
    if (discountCodes.length === 0) {
      return []
    }

    return this.prismaService.discount.findMany({
      where: {
        code: { in: discountCodes },
        discountStatus: DiscountStatus.ACTIVE,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
        deletedAt: null,
        isPlatform: true
      },
      include: {
        products: { select: { id: true } },
        categories: { select: { id: true } },
        brands: { select: { id: true } }
      }
    })
  }

  /* English content normalized from the original source text. */
  async findActiveDiscountsByCodes(tx: any, discountCodes: string[]): Promise<DiscountWithIncludes[]> {
    return tx.discount.findMany({
      where: {
        code: { in: discountCodes },
        discountStatus: DiscountStatus.ACTIVE,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
        deletedAt: null
      },
      include: {
        products: { select: { id: true } },
        categories: { select: { id: true } },
        brands: { select: { id: true } }
      }
    })
  }

  /* English content normalized from the original source text. */
  async getUserDiscountUsage(userId: string, discountIds: string[]): Promise<Map<string, number>> {
    const userDiscountUsage = await this.prismaService.discountSnapshot.groupBy({
      by: ['discountId'],
      where: {
        discountId: { in: discountIds },
        order: { userId }
      },
      _count: { discountId: true }
    })

    return new Map(
      userDiscountUsage
        .filter((item) => item.discountId !== null)
        .map((item) => [item.discountId!, item._count.discountId])
    )
  }

  /* English content normalized from the original source text. */
  async updateDiscountUsage(tx: any, discountId: string, userId: string): Promise<void> {
    await tx.discount.update({
      where: { id: discountId },
      data: {
        usesCount: { increment: 1 },
        usersUsed: { push: userId }
      }
    })
  }

  /* English content normalized from the original source text. */
  async createDiscountSnapshot(tx: any, discountSnapshotData: any, orderId: string): Promise<void> {
    await tx.discountSnapshot.create({
      data: {
        ...discountSnapshotData,
        orderId
      }
    })
  }

  /* English content normalized from the original source text. */
  async findDiscountSnapshotsByOrderId(orderId: string): Promise<any[]> {
    return this.prismaService.discountSnapshot.findMany({
      where: { orderId }
    })
  }
}
