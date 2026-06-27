import { BaseEntity, BaseResponse, PaginationMetadata } from './base.interface'


export interface ClientVariant {
  value: string
  options: string[]
}


export interface ClientSku extends BaseEntity {
  value: string
  price: number
  stock: number
  image: string | null
  productId: string
}


export interface ClientCategory extends BaseEntity {
  name: string
  parentCategoryId: string | null
  logo: string | null
  categoryTranslations: any[]
}


export interface ClientBrand extends BaseEntity {
  name: string
  logo: string | null
  brandTranslations: any[]
}


export interface ClientProductTranslation {
  productId: string
  languageCode: string
  name: string
  description: string
}


export interface ClientProduct extends BaseEntity {
  publishedAt: string | null
  name: string
  description: string
  basePrice: number
  virtualPrice: number
  brandId: string
  images: string[]
  variants: ClientVariant[]
  productTranslations: ClientProductTranslation[]
}


export interface ClientProductDetail extends ClientProduct {
  skus: ClientSku[]
  categories: ClientCategory[]
  brand: ClientBrand
}


export interface ClientProductsResponse extends BaseResponse {
  data: ClientProduct[]
  metadata?: PaginationMetadata
}


export interface ClientProductDetailResponse extends BaseResponse {
  data: ClientProductDetail
}


export interface ClientProductsListParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: string
  categoryId?: string
  brandId?: string
  minPrice?: number
  maxPrice?: number
}


export interface ProductSpecification {
  name: string
  value: string
}


export interface ProductAttribute {
  attrName: string
  attrValue: string
}


export interface ClientSearchResultItem {
  skuId: string
  productId: string
  skuValue: string
  skuPrice: number
  skuStock: number
  skuImage: string
  productName: string
  productDescription: string
  productImages: string[]
  brandId: string
  brandName: string
  categoryIds: string[]
  categoryNames: string[]
  specifications: ProductSpecification[]
  variants: ClientVariant[]
  attrs: ProductAttribute[]
  createdAt: string
  updatedAt: string
}


export interface ClientSearchResponse extends BaseResponse {
  data: ClientSearchResultItem[]
  metadata: PaginationMetadata
}


export interface ClientSearchParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: string
  categories?: string
  brandId?: string
  minPrice?: number
  maxPrice?: number
  [key: string]: any 
}
