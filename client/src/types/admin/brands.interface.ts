import { PaginationMetadata, PaginationRequest } from '../base.interface'


export interface BrandTranslation {
  id?: number
  brandId: number
  languageId: number
  name: string
  description?: string
  slug?: string
  createdAt?: string
  updatedAt?: string
}
export interface Brand {
  id: string
  name: string
  logo?: string
  createdById?: number
  updatedById?: number | null
  deletedById?: number | null
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
  brandTranslations: BrandTranslation[]
}
export interface BrandCreateRequest {
  name: string
  logo?: string
  translations?: Array<{
    languageId: number
    name: string
    description?: string
  }>
}

export interface BrandUpdateRequest {
  name?: string
  logo?: string
  translations?: Array<{
    languageId: number
    name?: string
    description?: string
  }>
}


export interface BrandGetAllResponse {
  data: Brand[]
  metadata: PaginationMetadata
}

export interface BrandGetByIdResponse {
  data: Brand
}


export interface BrandParams extends PaginationRequest {}
