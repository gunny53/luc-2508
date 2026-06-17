export const OrderStatus = {
  // English content normalized from the original source text.
  PENDING_PAYMENT: 'PENDING_PAYMENT', // English content normalized from the original source text.

  // English content normalized from the original source text.
  PENDING_PACKAGING: 'PENDING_PACKAGING', // English content normalized from the original source text.

  // English content normalized from the original source text.
  PICKUPED: 'PICKUPED', // English content normalized from the original source text.
  PENDING_DELIVERY: 'PENDING_DELIVERY', // English content normalized from the original source text.

  // English content normalized from the original source text.
  DELIVERED: 'DELIVERED', // English content normalized from the original source text.

  // English content normalized from the original source text.
  CANCELLED: 'CANCELLED', // English content normalized from the original source text.
  RETURNED: 'RETURNED' // English content normalized from the original source text.
} as const

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus]

// English content normalized from the original source text.
export const ORDER_STATUS_FLOW = {
  // COD Flow: PENDING_PAYMENT → PENDING_PACKAGING → PICKUPED → PENDING_DELIVERY → DELIVERED
  // Online Flow: PENDING_PACKAGING → PICKUPED → PENDING_DELIVERY → DELIVERED

  // English content normalized from the original source text.
  ADMIN_ONLY: [
    OrderStatus.PENDING_PAYMENT,
    OrderStatus.PENDING_PACKAGING,
    OrderStatus.PICKUPED,
    OrderStatus.PENDING_DELIVERY,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
    OrderStatus.RETURNED
  ],

  // English content normalized from the original source text.
  VALID_TRANSITIONS: {
    [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PENDING_PACKAGING, OrderStatus.CANCELLED],
    [OrderStatus.PENDING_PACKAGING]: [OrderStatus.PICKUPED, OrderStatus.CANCELLED],
    [OrderStatus.PICKUPED]: [OrderStatus.PENDING_DELIVERY, OrderStatus.CANCELLED],
    [OrderStatus.PENDING_DELIVERY]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
    [OrderStatus.DELIVERED]: [OrderStatus.RETURNED],
    [OrderStatus.CANCELLED]: [], // English content normalized from the original source text.
    [OrderStatus.RETURNED]: [] // English content normalized from the original source text.
  }
} as const
