import { Injectable } from '@nestjs/common'
import {
  GetManageDiscountsResType,
  GetDiscountDetailResType,
  CreateDiscountBodyType,
  UpdateDiscountBodyType,
  GetAvailableDiscountsQueryType
} from './discount.model'
import { DiscountType } from '@shared/models/shared-discount.model'
import { PrismaService } from '@shared/services/prisma.service'
import { Prisma } from '@prisma/client'


type AdminListQuery = {
  limit: number
  page: number
  name?: string
  code?: string
  discountStatus?: string
  discountType?: string
  discountApplyType?: string
  voucherType?: string
  displayType?: string
  isPlatform?: boolean
  startDate?: Date
  endDate?: Date
  minValue?: number
  maxValue?: number
  shopId?: string
  createdById?: string
  orderBy: string
  sortBy: string
}

@Injectable()
export class DiscountRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async getAvailableDiscounts({
    limit,
    cartItemIds,
    onlyShopDiscounts,
    onlyPlatformDiscounts
  }: GetAvailableDiscountsQueryType): Promise<DiscountType[]> {
    try {
      console.log('Getting available discounts with params:', {
        limit,
        cartItemIds,
        onlyShopDiscounts,
        onlyPlatformDiscounts
      })

      const where = await this.buildAvailableDiscountsWhereClause({
        cartItemIds,
        onlyShopDiscounts,
        onlyPlatformDiscounts
      })

      console.log('Built where clause:', where)

      const data = await this.prismaService.discount.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: this.getDiscountIncludeClause()
      })

      console.log('Found discounts:', data.length)

      const filteredData = await this.filterAvailableDiscounts(data, cartItemIds)
      console.log('Filtered discounts:', filteredData.length)

      return filteredData
    } catch (error) {
      console.error('Error in getAvailableDiscounts:', error)
      throw error
    }
  }

  async list(query: AdminListQuery): Promise<GetManageDiscountsResType> {
    const { limit, page, ...filters } = query
    const skip = (page - 1) * limit

    const where = this.buildAdminListWhereClause(filters)
    const orderBy = this.buildOrderByClause(query.orderBy, query.sortBy)

    const [totalItems, data] = await Promise.all([
      this.prismaService.discount.count({ where }),
      this.prismaService.discount.findMany({
        where,
        orderBy,
        skip,
        take: limit
      })
    ])

    return {
      data,
      metadata: this.buildPaginationMetadata(totalItems, page, limit)
    }
  }

  findById(discountId: string): Promise<DiscountType | null> {
    return this.prismaService.discount.findUnique({
      where: {
        id: discountId,
        deletedAt: null
      }
    })
  }

  async getDetail({
    discountId,
    createdById
  }: {
    discountId: string
    createdById: string
  }): Promise<GetDiscountDetailResType | null> {
    return this.prismaService.discount
      .findUnique({
        where: {
          id: discountId,
          deletedAt: null,
          createdById
        }
      })
      .then((discount) => (discount ? { data: discount } : null))
  }

  async create({
    createdById,
    data
  }: {
    createdById: string
    data: CreateDiscountBodyType
  }): Promise<GetDiscountDetailResType> {
    const { brands, categories, products, ...discountData } = data

    return this.prismaService.discount
      .create({
        data: {
          createdById,
          ...discountData,
          voucherType: discountData.voucherType as any,
          ...this.buildRelationsClause({ brands, categories, products })
        }
      })
      .then((discount) => ({ data: discount }))
  }

  async update({
    id,
    updatedById,
    data
  }: {
    id: string
    updatedById: string
    data: UpdateDiscountBodyType
  }): Promise<DiscountType> {
    const { brands, categories, products, ...discountData } = data

    return this.prismaService.discount.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        ...discountData,
        voucherType: discountData.voucherType as any,
        updatedById,
        ...this.buildRelationsClause({ brands, categories, products }, 'set')
      }
    })
  }

  async delete(
    {
      id,
      deletedById
    }: {
      id: string
      deletedById: string
    },
    isHard?: boolean
  ): Promise<DiscountType> {
    if (isHard) {
      return this.prismaService.discount.delete({
        where: { id }
      })
    }

    return this.prismaService.discount.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        deletedAt: new Date(),
        deletedById
      }
    })
  }

  findByCode(code: string): Promise<DiscountType | null> {
    return this.prismaService.discount.findUnique({
      where: {
        code,
        deletedAt: null
      },
      include: this.getDiscountIncludeClause()
    })
  }

  

  
  private async buildAvailableDiscountsWhereClause({
    cartItemIds,
    onlyShopDiscounts,
    onlyPlatformDiscounts
  }: {
    cartItemIds?: string[]
    onlyShopDiscounts?: boolean
    onlyPlatformDiscounts?: boolean
  }): Promise<Prisma.DiscountWhereInput> {
    const where: Prisma.DiscountWhereInput = {
      deletedAt: null,
      discountStatus: 'ACTIVE'
    }
    const now = new Date()
    where.startDate = { lte: now }
    where.endDate = { gte: now }
    const { orderTotal, shopId } = await this.calculateOrderInfoFromCartItems(cartItemIds)
    if (onlyShopDiscounts) {
      where.isPlatform = false
      if (shopId) {
        where.OR = [{ shopId: shopId }, { shopId: null }]
      }
    } else if (onlyPlatformDiscounts) {
      where.isPlatform = true
    }
    if (orderTotal && orderTotal > 0) {
      where.OR = [{ minOrderValue: 0 }, { minOrderValue: { lte: orderTotal } }]
    }

    return where
  }

  
  private buildAdminListWhereClause(
    filters: Omit<AdminListQuery, 'limit' | 'page' | 'orderBy' | 'sortBy'>
  ): Prisma.DiscountWhereInput {
    const where: Prisma.DiscountWhereInput = {
      deletedAt: null
    }

    if (filters.createdById) {
      where.createdById = filters.createdById
    }

    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' }
    }

    if (filters.code) {
      where.code = { contains: filters.code, mode: 'insensitive' }
    }

    if (filters.discountStatus) {
      where.discountStatus = filters.discountStatus as any
    }

    if (filters.discountType) {
      where.discountType = filters.discountType as any
    }

    if (filters.discountApplyType) {
      where.discountApplyType = filters.discountApplyType as any
    }

    if (filters.voucherType) {
      where.voucherType = filters.voucherType as any
    }

    if (filters.displayType) {
      where.displayType = filters.displayType as any
    }

    if (filters.isPlatform !== undefined) {
      where.isPlatform = filters.isPlatform
    }

    if (filters.startDate) {
      where.startDate = { gte: filters.startDate }
    }

    if (filters.endDate) {
      where.endDate = { lte: filters.endDate }
    }

    if (filters.minValue !== undefined || filters.maxValue !== undefined) {
      where.value = {
        gte: filters.minValue,
        lte: filters.maxValue
      }
    }

    if (filters.shopId) {
      where.shopId = filters.shopId
    }

    return where
  }

  
  private buildOrderByClause(orderBy: string, sortBy: string): Prisma.DiscountOrderByWithRelationInput {
    if (sortBy === 'value') {
      return { value: orderBy as any }
    }

    if (sortBy === 'usesCount') {
      return { usesCount: orderBy as any }
    }

    return { createdAt: orderBy as any }
  }

  
  private buildPaginationMetadata(totalItems: number, page: number, limit: number) {
    const totalPages = Math.ceil(totalItems / limit)
    return {
      totalItems,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }

  
  private buildRelationsClause(
    relations: { brands?: string[]; categories?: string[]; products?: string[] },
    operation: 'connect' | 'set' = 'connect'
  ) {
    const result: any = {}

    if (relations.brands) {
      result.brands = {
        [operation]: relations.brands.map((id) => ({ id }))
      }
    }

    if (relations.categories) {
      result.categories = {
        [operation]: relations.categories.map((id) => ({ id }))
      }
    }

    if (relations.products) {
      result.products = {
        [operation]: relations.products.map((id) => ({ id }))
      }
    }

    return result
  }

  
  private getDiscountIncludeClause() {
    return {
      products: { select: { id: true } },
      categories: { select: { id: true } },
      brands: { select: { id: true } }
    }
  }

  private async filterAvailableDiscounts(discounts: DiscountType[], cartItemIds?: string[]): Promise<DiscountType[]> {
    if (!cartItemIds || cartItemIds.length === 0) {
      return discounts.filter((discount) => {
        if (discount.maxUses > 0 && discount.usesCount >= discount.maxUses) {
          return false
        }
        return true
      })
    }
    const { productIds, categoryIds, brandIds } = await this.calculateOrderInfoFromCartItems(cartItemIds)

    return discounts.filter((discount) => {
      if (discount.maxUses > 0 && discount.usesCount >= discount.maxUses) {
        return false
      }
      if (discount.discountApplyType === 'SPECIFIC') {
        const discountWithRelations = discount as any

        const hasValidProduct = productIds.some((productId) =>
          discountWithRelations.products?.some((p: any) => p.id === productId)
        )
        const hasValidCategory = categoryIds.some((categoryId) =>
          discountWithRelations.categories?.some((c: any) => c.id === categoryId)
        )
        const hasValidBrand = brandIds.some((brandId) =>
          discountWithRelations.brands?.some((b: any) => b.id === brandId)
        )

        if (!hasValidProduct && !hasValidCategory && !hasValidBrand) {
          return false
        }
      }

      return true
    })
  }

  private async calculateOrderInfoFromCartItems(
    cartItemIds?: string[]
  ): Promise<{ orderTotal: number; shopId?: string; productIds: string[]; categoryIds: string[]; brandIds: string[] }> {
    if (!cartItemIds || cartItemIds.length === 0) {
      return { orderTotal: 0, productIds: [], categoryIds: [], brandIds: [] }
    }

    try {
      console.log('Calculating order info for cartItemIds:', cartItemIds)

      const cartItems = await this.prismaService.cartItem.findMany({
        where: { id: { in: cartItemIds } },
        include: {
          sku: {
            include: {
              product: {
                include: {
                  createdBy: true,
                  categories: true,
                  brand: true
                }
              }
            }
          }
        }
      })

      console.log('Found cartItems:', cartItems.length)

      if (cartItems.length === 0) {
        console.log('No cart items found')
        return { orderTotal: 0, productIds: [], categoryIds: [], brandIds: [] }
      }
      const orderTotal = cartItems.reduce((total, item) => {
        return total + item.quantity * item.sku.price
      }, 0)
      const shopId = cartItems[0]?.sku?.product?.createdBy?.id
      const productIds = [...new Set(cartItems.map((item) => item.sku.product.id))]
      const categoryIds = [...new Set(cartItems.flatMap((item) => item.sku.product.categories.map((cat) => cat.id)))]
      const brandIds = [...new Set(cartItems.map((item) => item.sku.product.brand?.id).filter(Boolean))]

      console.log('Calculated order info:', { orderTotal, shopId, productIds, categoryIds, brandIds })

      return { orderTotal, shopId, productIds, categoryIds, brandIds }
    } catch (error) {
      console.error('Error calculating order info from cart items:', error)
      return { orderTotal: 0, productIds: [], categoryIds: [], brandIds: [] }
    }
  }
}
