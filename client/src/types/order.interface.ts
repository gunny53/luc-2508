import { PaginationRequest, PaginationMetadata } from '@/types/base.interface'
import { Discount } from './discount.interface'

export interface OrderGetAllParams extends PaginationRequest {
  sortOrder?: OrderStatus
  sortBy?: 'asc' | 'desc'
  search?: string
}

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PENDING_PACKAGING = 'PENDING_PACKAGING',
  PICKUPED = 'PICKUPED',
  PENDING_DELIVERY = 'PENDING_DELIVERY',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
  VERIFY_PAYMENT = 'VERIFY_PAYMENT'
}
interface ReceiverInfo {
  name: string
  phone: string
  address: string
  provinceId: number
  districtId: number
  wardCode: string
}
interface ShippingInfo {
  length: number
  weight: number
  width: number
  height: number
  service_id: number
  service_type_id: number
  shippingFee: number
}

interface ShopOrderCreationInfo {
  shopId: string
  receiver: ReceiverInfo
  cartItemIds: string[]
  discountCodes: string[]
  shippingInfo: ShippingInfo
  isCod: boolean
}

export interface OrderCreateRequest {
  shops: ShopOrderCreationInfo[]
  platformDiscountCodes: string[]
}

export interface OrderCreateResponse {
  statusCode: number
  message: string
  timestamp: string
  data: {
    orders: {
      id: string
      userId: string
      status: OrderStatus
      receiver: {
        name: string
        phone: string
        address: string
      }
      shopId: string
      paymentId: number
      createdById: string
      updatedById: string | null
      deletedById: string | null
      deletedAt: string | null
      createdAt: string
      updatedAt: string
    }[]
    paymentId: number
  }
}
interface OrderReceiver {
  name: string
  phone: string
  address: string
}

interface ProductTranslation {
  id: string
  name: string
  description: string
  languageId: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productTranslations: ProductTranslation[]
  skuPrice: number
  image: string
  skuValue: string
  skuId: string
  orderId: string
  quantity: number
  createdAt: string
}

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  receiver: OrderReceiver
  shopId: string
  paymentId: string
  orderCode: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  totalItemCost: number
  totalShippingFee: number
  totalVoucherDiscount: number
  totalPayment: number
  totalPrice: number
}

export interface ProductInfo {
  id: string
  shopName: string
  name: string
  image: string
  quantity: number
  subtotal: number
  price: number
  variation?: string
}

export interface OrderGetAllResponse {
  data: Order[]
  metadata: PaginationMetadata
}

export interface OrderGetByIdResponse {
  data: Order
  metadata: PaginationMetadata
}

export interface OrderCancelResponse {
  message: string
}

export interface CreatePaymentVnPayUrl {
  amount: number
  orderInfo: string
  orderId: string | number
  locale: string | 'vn'
}
export interface CreatePaymentVnPayUrlResponse {
  statusCode: number
  message: string
  timestamp: string
  data: {
    paymentUrl: string
  }
}
export interface OrderHandlerResult {
  success: boolean
  paymentMethod?: string
  orderData?: {
    orders?: any[]
    paymentId?: number
    [key: string]: any
  }
  orderId?: string 
  paymentId?: number
  paymentUrl?: string
  error?: string
}





export interface ManageOrderUser {
  id: string
  name: string
  email: string
  phoneNumber: string
}

export interface ManageOrderProductTranslation {
  id: string
  name: string
  languageId: string
}

export interface ManageOrderItem {
  id: string
  productId: string
  productName: string
  productTranslations: ManageOrderProductTranslation[]
  skuPrice: number
  image: string
  skuValue: string
  skuId: string
  orderId: string
  quantity: number
  createdAt: string
}

export interface ManageOrder {
  id: string
  userId: string
  status: OrderStatus
  receiver: {
    name: string
    phone: string
    address: string
  }
  shopId: string
  paymentId: number
  createdById: string
  updatedById: string | null
  deletedById: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  items: ManageOrderItem[]
  totalItemCost: number
  totalShippingFee: number
  totalVoucherDiscount: number
  totalPayment: number
  user?: ManageOrderUser
  orderCode: string
}


export interface ManageOrderGetAllParams extends PaginationRequest {
  status?: OrderStatus
  shopId?: string
  userId?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}


export interface ManageOrderGetAllResponse {
  statusCode: number
  message: string
  timestamp: string
  data: ManageOrder[]
  metadata: PaginationMetadata
}


export interface ManageOrderGetByIdResponse {
  statusCode: number
  message: string
  timestamp: string
  data: ManageOrder
}

export interface UpdateStatusRequest {
  status: OrderStatus
  note: string
}
interface ShopCalculationInfo {
  shopId: string
  cartItemIds: string[]
  shippingFee: number
  discountCodes: string[]
}

export interface CalculateOrderRequest {
  shops: ShopCalculationInfo[]
  platformDiscountCodes: string[]
}
export interface CalculateOrderResponse {
  statusCode: number
  message: string
  timestamp: string
  data: {
    totalItemCost: number
    totalShippingFee: number
    totalVoucherDiscount: number
    totalPayment: number
    shops: {
      shopId: string
      itemCost: number
      shippingFee: number
      voucherDiscount: number
      platformVoucherDiscount: number
      itemCount: number
      payment: number
    }[]
  }
}

export interface AppliedVoucherInfo {
  code: string
  discount: Discount
  discountAmount: number
}
