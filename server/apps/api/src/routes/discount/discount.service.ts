import { Injectable } from '@nestjs/common'
import { DiscountRepo } from './discount.repo'
import {
  GetAvailableDiscountsQueryType,
  ValidateVoucherCodeBodyType,
  ValidateVoucherCodeResType
} from './discount.model'

@Injectable()
export class DiscountService {
  constructor(private readonly discountRepo: DiscountRepo) {}

  async getAvailableDiscounts(body: GetAvailableDiscountsQueryType) {
    const data = await this.discountRepo.getAvailableDiscounts(body)

    return {
      message: 'discount.voucher.success.GET_AVAILABLE_VOUCHERS_SUCCESS',
      data
    }
  }

  async validateVoucherCode(body: ValidateVoucherCodeBodyType): Promise<ValidateVoucherCodeResType> {
    const { code, cartItemIds } = body

    const discount = await this.discountRepo.findByCode(code)

    if (!discount) {
      return {
        message: 'discount.voucher.success.VALIDATE_VOUCHER_SUCCESS',
        data: {
          isValid: false,
          error: 'English content normalized from the original source text.'
        }
      }
    }
    if (discount.discountStatus !== 'ACTIVE') {
      return {
        message: 'discount.voucher.success.VALIDATE_VOUCHER_SUCCESS',
        data: {
          isValid: false,
          error: 'English content normalized from the original source text.'
        }
      }
    }
    const now = new Date()
    if (now < discount.startDate || now > discount.endDate) {
      return {
        message: 'discount.voucher.success.VALIDATE_VOUCHER_SUCCESS',
        data: {
          isValid: false,
          error: 'English content normalized from the original source text.'
        }
      }
    }
    if (discount.maxUses > 0 && discount.usesCount >= discount.maxUses) {
      return {
        message: 'discount.voucher.success.VALIDATE_VOUCHER_SUCCESS',
        data: {
          isValid: false,
          error: 'English content normalized from the original source text.'
        }
      }
    }
    const orderTotal = await this.calculateOrderTotalFromCartItems(cartItemIds)
    if (discount.minOrderValue > 0 && orderTotal < discount.minOrderValue) {
      return {
        message: 'discount.voucher.success.VALIDATE_VOUCHER_SUCCESS',
        data: {
          isValid: false,
          error: `English content normalized from the original source text.${discount.minOrderValue.toLocaleString('vi-VN')}English content normalized from the original source text.`
        }
      }
    }
    if (discount.discountApplyType === 'SPECIFIC') {
      const discountWithRelations = discount as any
      const { productIds, categoryIds, brandIds } = await this.getCartItemInfo(cartItemIds)

      const hasValidProduct = productIds.some((productId) =>
        discountWithRelations.products?.some((p: any) => p.id === productId)
      )
      const hasValidCategory = categoryIds.some((categoryId) =>
        discountWithRelations.categories?.some((c: any) => c.id === categoryId)
      )
      const hasValidBrand = brandIds.some((brandId) => discountWithRelations.brands?.some((b: any) => b.id === brandId))

      if (!hasValidProduct && !hasValidCategory && !hasValidBrand) {
        return {
          message: 'discount.voucher.success.VALIDATE_VOUCHER_SUCCESS',
          data: {
            isValid: false,
            error: 'English content normalized from the original source text.'
          }
        }
      }
    }
    const discountAmount = this.calculateDiscountAmount(discount, orderTotal)
    const finalOrderTotal = orderTotal - discountAmount

    return {
      message: 'discount.voucher.success.VALIDATE_VOUCHER_SUCCESS',
      data: {
        isValid: true,
        discount,
        discountAmount,
        finalOrderTotal
      }
    }
  }

  private async calculateOrderTotalFromCartItems(cartItemIds?: string[]): Promise<number> {
    if (!cartItemIds || cartItemIds.length === 0) {
      return 0
    }

    const cartItems = await this.discountRepo['prismaService'].cartItem.findMany({
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

    if (cartItems.length === 0) {
      return 0
    }

    return cartItems.reduce((total, item) => {
      return total + item.quantity * item.sku.price
    }, 0)
  }

  private async getCartItemInfo(
    cartItemIds?: string[]
  ): Promise<{ productIds: string[]; categoryIds: string[]; brandIds: string[] }> {
    if (!cartItemIds || cartItemIds.length === 0) {
      return { productIds: [], categoryIds: [], brandIds: [] }
    }

    const cartItems = await this.discountRepo['prismaService'].cartItem.findMany({
      where: { id: { in: cartItemIds } },
      include: {
        sku: {
          include: {
            product: {
              include: {
                categories: true,
                brand: true
              }
            }
          }
        }
      }
    })

    if (cartItems.length === 0) {
      return { productIds: [], categoryIds: [], brandIds: [] }
    }

    const productIds = [...new Set(cartItems.map((item) => item.sku.product.id))]
    const categoryIds = [...new Set(cartItems.flatMap((item) => item.sku.product.categories.map((cat) => cat.id)))]
    const brandIds = [...new Set(cartItems.map((item) => item.sku.product.brand?.id).filter(Boolean))]

    return { productIds, categoryIds, brandIds }
  }

  private calculateDiscountAmount(discount: any, orderTotal: number): number {
    if (discount.discountType === 'PERCENTAGE') {
      const percentageAmount = (orderTotal * discount.value) / 100
      if (discount.maxDiscountValue && percentageAmount > discount.maxDiscountValue) {
        return discount.maxDiscountValue
      }

      return percentageAmount
    } else {
      // FIX_AMOUNT
      return Math.min(discount.value, orderTotal)
    }
  }

  // Legacy methods for backward compatibility
  async list(query: any) {
    return this.getAvailableDiscounts(query)
  }

  async validateCode(code: string) {
    return this.validateVoucherCode({ code })
  }
}
