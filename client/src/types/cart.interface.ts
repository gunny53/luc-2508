import { BaseResponse, BaseEntity, PaginationMetadata } from './base.interface'

export interface ShopInfo {
  id: string
  name: string
  avatar?: string
}

export interface ProductInfo {
  id: string
  publishedAt: string
  name: string
  description: string
  basePrice: number
  virtualPrice: number
  brandId: string
  images: string[]
  sku: SkuInfo
  variants: Array<{
    value: string
    options: string[]
  }>
  productTranslations: any[]
}

export interface SkuInfo {
  id: string
  value: string
  price: number
  stock: number
  image: string
  productId: string
  product: ProductInfo
}

export interface CartItem extends Partial<BaseEntity> {
  id: string
  quantity: number
  skuId: string
  userId: string
  createdAt: string
  updatedAt: string
  sku: SkuInfo
  isSelected?: boolean
}

export interface ShopCart {
  shop: ShopInfo
  cartItems: CartItem[]
  isSelected?: boolean
}

export interface CartListResponse extends BaseResponse {
  data: ShopCart[]
  metadata?: PaginationMetadata
}

export interface Cart {
  shops: ShopCart[]
  totalItems: number
  totalPrice: number
  totalSelectedItems: number
  totalSelectedPrice: number
}

export interface CartResponse extends BaseResponse {
  data:
    | CartItem
    | {
        cartItem?: CartItem
      }
}

export interface CartItemRequest {
  skuId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  skuId: string
  quantity: number
  isSelected?: boolean
}

export interface DeleteCartRequest {
  cartItemIds: string[]
}

export interface SelectCartItemsRequest {
  cartItemIds: string[]
  isSelected: boolean
}

export interface CartSummary {
  totalItems: number
  totalSelectedItems: number
  totalPrice: number
  totalSelectedPrice: number
  totalShops: number
}
