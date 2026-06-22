import { z } from 'zod'
import { OrderBy, SortBy } from '@shared/constants/other.constant'
import { DiscountSchema } from '@shared/models/shared-discount.model'
import {
  DisplayType,
  DiscountStatus,
  DiscountType,
  DiscountApplyType,
  VoucherType
} from '@shared/constants/discount.constant'
export const GetAvailableDiscountsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().default(20),
  cartItemIds: z
    .preprocess((value) => {
      if (typeof value === 'string') {
        return [value]
      }
      return value
    }, z.array(z.string()))
    .optional(),
  onlyShopDiscounts: z.preprocess((value) => value === 'true', z.boolean()).default(false),
  onlyPlatformDiscounts: z.preprocess((value) => value === 'true', z.boolean()).default(false)
})

// Schema cho validate voucher code
export const ValidateVoucherCodeBodySchema = z.object({
  code: z.string().trim().min(1, 'English content normalized from the original source text.'),
  cartItemIds: z.array(z.string()).optional()
})
export const GetAvailableDiscountsResSchema = z.object({
  message: z.string().optional(),
  data: z.array(DiscountSchema)
})

// Schema response cho validate voucher
export const ValidateVoucherCodeResSchema = z.object({
  message: z.string().optional(),
  data: z.object({
    isValid: z.boolean(),
    discount: DiscountSchema.optional(),
    error: z.string().optional(),
    discountAmount: z.number().optional(),
    finalOrderTotal: z.number().optional()
  })
})
export const GetManageDiscountsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  name: z.string().optional(),
  code: z.string().optional(),
  discountStatus: z.nativeEnum(DiscountStatus).optional(),
  discountType: z.nativeEnum(DiscountType).optional(),
  discountApplyType: z.nativeEnum(DiscountApplyType).optional(),
  voucherType: z.nativeEnum(VoucherType).optional(),
  displayType: z.nativeEnum(DisplayType).optional(),
  isPlatform: z.preprocess((value) => value === 'true', z.boolean()).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  minValue: z.coerce.number().positive().optional(),
  maxValue: z.coerce.number().positive().optional(),
  shopId: z.string().optional(),
  createdById: z.string(),
  orderBy: z.nativeEnum(OrderBy).default(OrderBy.Desc),
  sortBy: z.nativeEnum(SortBy).default(SortBy.CreatedAt)
})

export const GetManageDiscountsResSchema = z.object({
  message: z.string().optional(),
  data: z.array(DiscountSchema),
  metadata: z.object({
    totalItems: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean()
  })
})

export const GetDiscountParamsSchema = z.object({
  discountId: z.string()
})

export const GetDiscountDetailResSchema = z.object({
  message: z.string().optional(),
  data: DiscountSchema
})

export const CreateDiscountBodySchema = DiscountSchema.pick({
  name: true,
  description: true,
  value: true,
  code: true,
  startDate: true,
  endDate: true,
  maxUsesPerUser: true,
  minOrderValue: true,
  maxUses: true,
  maxDiscountValue: true,
  displayType: true,
  voucherType: true,
  isPlatform: true,
  shopId: true,
  discountApplyType: true,
  discountStatus: true,
  discountType: true
})
  .extend({
    brands: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    products: z.array(z.string()).optional()
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.startDate >= data.endDate) {
      return ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'English content normalized from the original source text.'
      })
    }

    const codeRegex = /^[A-Z0-9]{1,5}$/
    if (!codeRegex.test(data.code)) {
      return ctx.addIssue({
        code: 'custom',
        path: ['code'],
        message: 'English content normalized from the original source text.'
      })
    }

    if (data.discountType === 'PERCENTAGE') {
      if (data.value < 1 || data.value > 100) {
        return ctx.addIssue({
          code: 'custom',
          path: ['value'],
          message: 'English content normalized from the original source text.'
        })
      }
    }

    if (data.maxUses > 0 && data.maxUsesPerUser > data.maxUses) {
      return ctx.addIssue({
        code: 'custom',
        path: ['maxUsesPerUser'],
        message: 'English content normalized from the original source text.'
      })
    }

    if (
      data.discountApplyType === 'SPECIFIC' &&
      (!data.brands || data.brands.length === 0) &&
      (!data.categories || data.categories.length === 0) &&
      (!data.products || data.products.length === 0)
    ) {
      return ctx.addIssue({
        code: 'custom',
        path: ['discountApplyType'],
        message: 'English content normalized from the original source text.'
      })
    }
  })

export const UpdateDiscountBodySchema = CreateDiscountBodySchema

export const CreateDiscountResSchema = z.object({
  message: z.string().optional(),
  data: DiscountSchema
})

export const UpdateDiscountResSchema = CreateDiscountResSchema

// Type exports
export type GetAvailableDiscountsQueryType = z.infer<typeof GetAvailableDiscountsQuerySchema>
export type GetAvailableDiscountsResType = z.infer<typeof GetAvailableDiscountsResSchema>
export type ValidateVoucherCodeBodyType = z.infer<typeof ValidateVoucherCodeBodySchema>
export type ValidateVoucherCodeResType = z.infer<typeof ValidateVoucherCodeResSchema>
export type GetManageDiscountsQueryType = z.infer<typeof GetManageDiscountsQuerySchema>
export type GetManageDiscountsResType = z.infer<typeof GetManageDiscountsResSchema>
export type GetDiscountParamsType = z.infer<typeof GetDiscountParamsSchema>
export type GetDiscountDetailResType = z.infer<typeof GetDiscountDetailResSchema>
export type CreateDiscountBodyType = z.infer<typeof CreateDiscountBodySchema>
export type UpdateDiscountBodyType = z.infer<typeof UpdateDiscountBodySchema>
export type CreateDiscountResType = z.infer<typeof CreateDiscountResSchema>
export type UpdateDiscountResType = z.infer<typeof UpdateDiscountResSchema>
