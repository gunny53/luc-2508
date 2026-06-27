import { BaseResponse, PaginationRequest, PaginationMetadata } from './base.interface'





export enum DisplayType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}
export enum VoucherType {
  SHOP = 'SHOP',
  PRODUCT = 'PRODUCT',
  PRIVATE = 'PRIVATE',
  PLATFORM = 'PLATFORM',
  CATEGORY = 'CATEGORY',
  BRAND = 'BRAND'
}
export enum DiscountApplyType {
  ALL = 'ALL',
  SPECIFIC = 'SPECIFIC'
}
export enum DiscountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED'
}
export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIX_AMOUNT = 'FIX_AMOUNT'
}



export interface Discount {
  id: string
  name: string
  description: string
  code: string
  value: number
  maxDiscountValue?: number | null
  minOrderValue: number
  startDate: string
  endDate: string
  maxUses: number
  usesCount: number
  maxUsesPerUser: number
  usersUsed: string[]
  shopId: string | null
  isPlatform: boolean
  voucherType: VoucherType
  discountType: DiscountType
  discountApplyType: DiscountApplyType
  discountStatus: DiscountStatus
  displayType?: DisplayType
  productIds?: string[]
  categories?: string[]
  brands?: string[]
  createdAt: string
  updatedAt: string
}






export interface DiscountGetAllParams extends PaginationRequest {
  status?: DiscountStatus
  type?: DiscountType
  search?: string
  createdById?: string
}
export interface DiscountGetAllResponse extends BaseResponse {
  data: Discount[]
  metadata: PaginationMetadata
}


export interface DiscountGetByIdResponse extends BaseResponse {
  data: Discount
}


export type CreateDiscountRequest = Omit<Discount, 'id' | 'usesCount' | 'usersUsed' | 'createdAt' | 'updatedAt'>
export interface CreateDiscountResponse extends BaseResponse {
  data: Discount
}


export type UpdateDiscountRequest = Partial<CreateDiscountRequest>
export interface UpdateDiscountResponse extends BaseResponse {
  data: Discount
}


export interface DeleteDiscountResponse extends BaseResponse {} 


export interface GetGuestDiscountListRequest {
  onlyShopDiscounts?: boolean
  onlyPlatformDiscounts?: boolean
  cartItemIds: string 
}
export interface GuestGetDiscountListResponse extends BaseResponse {
  data: Discount[]
}


export interface ValidateDiscountRequest {
  code: string
  cartItemIds: string[]
}
export interface ValidateDiscountResponseData {
  isValid: boolean
  message?: string 
  discount?: Discount
  discountAmount?: number
  finalOrderTotal?: number
}
export interface ValidateDiscountResponse extends BaseResponse {
  data: ValidateDiscountResponseData
}
