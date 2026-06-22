export const OrderStatus = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PENDING_PACKAGING: 'PENDING_PACKAGING',
  PICKUPED: 'PICKUPED',
  PENDING_DELIVERY: 'PENDING_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED'
} as const

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus]
export const ORDER_STATUS_FLOW = {
  // COD Flow: PENDING_PAYMENT → PENDING_PACKAGING → PICKUPED → PENDING_DELIVERY → DELIVERED
  // Online Flow: PENDING_PACKAGING → PICKUPED → PENDING_DELIVERY → DELIVERED
  ADMIN_ONLY: [
    OrderStatus.PENDING_PAYMENT,
    OrderStatus.PENDING_PACKAGING,
    OrderStatus.PICKUPED,
    OrderStatus.PENDING_DELIVERY,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
    OrderStatus.RETURNED
  ],
  VALID_TRANSITIONS: {
    [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PENDING_PACKAGING, OrderStatus.CANCELLED],
    [OrderStatus.PENDING_PACKAGING]: [OrderStatus.PICKUPED, OrderStatus.CANCELLED],
    [OrderStatus.PICKUPED]: [OrderStatus.PENDING_DELIVERY, OrderStatus.CANCELLED],
    [OrderStatus.PENDING_DELIVERY]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
    [OrderStatus.DELIVERED]: [OrderStatus.RETURNED],
    [OrderStatus.CANCELLED]: [],
    [OrderStatus.RETURNED]: []
  }
} as const
