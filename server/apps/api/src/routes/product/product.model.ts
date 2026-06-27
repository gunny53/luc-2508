import { UpsertSKUBodySchema } from '@routes/product/sku.model'
import { OrderBy, SortBy } from '@shared/constants/other.constant'
import { BrandIncludeTranslationSchema } from '@shared/models/shared-brand.model'
import { CategoryIncludeTranslationSchema } from '@shared/models/shared-category.model'
import { ProductTranslationSchema } from '@shared/models/shared-product-translation.model'
import { ProductSchema, VariantsType } from '@shared/models/shared-product.model'
import { SKUSchema } from '@shared/models/shared-sku.model'
import { z } from 'zod'

function generateSKUs(variants: VariantsType) {
  function getCombinations(arrays: string[][]): string[] {
    return arrays.reduce((acc, curr) => acc.flatMap((x) => curr.map((y) => `${x}${x ? '-' : ''}${y}`)), [''])
  }
  const options = variants.map((variant) => variant.options)
  const combinations = getCombinations(options)
  return combinations.map((value) => ({
    value,
    price: 0,
    stock: 100,
    image: ''
  }))
}

export const GetProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  name: z.string().optional(),
  brandIds: z
    .preprocess((value) => {
      if (typeof value === 'string') {
        return [value]
      }
      return value
    }, z.array(z.string()))
    .optional(),
  categories: z
    .preprocess((value) => {
      if (typeof value === 'string') {
        return [value]
      }
      return value
    }, z.array(z.string()))
    .optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  createdById: z.string().optional(),
  orderBy: z.nativeEnum(OrderBy).default(OrderBy.Desc),
  sortBy: z.nativeEnum(SortBy).default(SortBy.CreatedAt)
})

export const GetManageProductsQuerySchema = GetProductsQuerySchema.extend({
  isPublic: z.preprocess((value) => value === 'true', z.boolean()).optional(),
  createdById: z.string()
})

export const ProductListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  basePrice: z.number(),
  virtualPrice: z.number(),
  images: z.array(z.string()),
  publishedAt: z.union([z.string(), z.date()]).nullable(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
  productTranslations: z.array(
    z.object({
      name: z.string()
    })
  )
})

export const GetProductsResSchema = z.object({
  message: z.string().optional(),
  data: z.array(ProductListItemSchema),
  metadata: z.object({
    totalItems: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean()
  })
})

export const GetProductParamsSchema = z
  .object({
    productId: z.string()
  })
  .strict()

export const GetProductDetailResSchema = z.object({
  message: z.string().optional(),
  data: ProductSchema.extend({
    productTranslations: z.array(ProductTranslationSchema),
    skus: z.array(SKUSchema),
    categories: z.array(CategoryIncludeTranslationSchema),
    brand: BrandIncludeTranslationSchema
  })
})

export const CreateProductBodySchema = ProductSchema.pick({
  publishedAt: true,
  name: true,
  description: true,
  basePrice: true,
  virtualPrice: true,
  brandId: true,
  images: true,
  variants: true,
  specifications: true
})
  .extend({
    categories: z.array(z.string()),
    skus: z.array(UpsertSKUBodySchema)
  })
  .strict()
  .superRefine(({ variants, skus }, ctx) => {
    const skuValueArray = generateSKUs(variants)
    if (skus.length !== skuValueArray.length) {
      return ctx.addIssue({
        code: 'custom',
        path: ['skus'],
        message: `SKU list must contain exactly ${skuValueArray.length} combinations.`
      })
    }
    let wrongSKUIndex = -1
    const isValidSKUs = skus.every((sku, index) => {
      const isValid = sku.value === skuValueArray[index].value
      if (!isValid) {
        wrongSKUIndex = index
      }
      return isValid
    })
    if (!isValidSKUs) {
      ctx.addIssue({
        code: 'custom',
        path: ['skus'],
        message: `SKU at index ${wrongSKUIndex} does not match the generated variant combination.`
      })
    }
  })

export const UpdateProductBodySchema = CreateProductBodySchema
export const UpdateProductResSchema = z.object({
  message: z.string().optional(),
  data: ProductSchema
})

export type ProductListItemType = z.infer<typeof ProductListItemSchema>
export type GetProductsResType = z.infer<typeof GetProductsResSchema>
export type GetProductsQueryType = z.infer<typeof GetProductsQuerySchema>
export type GetManageProductsQueryType = z.infer<typeof GetManageProductsQuerySchema>
export type GetProductDetailResType = z.infer<typeof GetProductDetailResSchema>
export type CreateProductBodyType = z.infer<typeof CreateProductBodySchema>
export type GetProductParamsType = z.infer<typeof GetProductParamsSchema>
export type UpdateProductBodyType = z.infer<typeof UpdateProductBodySchema>
export type UpdateProductResType = z.infer<typeof UpdateProductResSchema>
