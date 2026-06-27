import { BaseEntity, PaginationMetadata, BaseResponse } from './base.interface'


export interface Variant {
  value: string
  options: string[]
}


export interface Sku {
  value: string
  price: number
  stock: number
  image: string
}


export interface ProductTranslation extends BaseEntity {
  productId: number
  languageCode: string
  name: string
  description: string
}


export interface Product extends BaseEntity {
  publishedAt: string | null
  name: string
  basePrice: number
  virtualPrice: number
  brandId: number
  images: string[]
  variants: Variant[]
  skus?: Sku[] 
  categories?: string[] 
  productTranslations: ProductTranslation[]
  message: string
}


export interface ProductsResponse {
  data: Product[]
  metadata: PaginationMetadata
  message: string
}


export interface ProductCreateRequest {
  name: string
  description: string
  publishedAt?: string | null
  basePrice: number
  virtualPrice: number
  brandId: string
  images: string[]
  categories: string[]
  specifications: Array<{
    name: string
    value: string
  }>
  variants: Variant[]
  skus: Sku[]
}


export type ProductUpdateRequest = Partial<ProductCreateRequest>




export interface SkuDetail extends BaseEntity {
  value: string
  price: number
  stock: number
  image: string | null
  productId: number
}


export interface CategoryDetail extends BaseEntity {
  name: string
  parentCategoryId: number | null
  logo: string | null
}


export interface BrandDetail extends BaseEntity {
  name: string
  logo: string | null
}


export interface ProductDetail extends BaseEntity {
  publishedAt: string | null
  name: string
  description?: string | null
  basePrice: number
  virtualPrice: number
  brandId: number
  images: string[]
  variants: Variant[]
  skus: SkuDetail[]
  categories: CategoryDetail[]
  specifications: Array<{
    name: string
    value: string
  }>
  brand: BrandDetail
  productTranslations: ProductTranslation[]
}


export interface ProductDetailResponse extends BaseResponse {
  data: ProductDetail
}
