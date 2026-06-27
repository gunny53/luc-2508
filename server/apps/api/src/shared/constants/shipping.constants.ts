export const GHN_CLIENT = 'GHN_CLIENT' as const
export const GHN_PAYMENT_TYPE = {
  PREPAID: 1,
  COD: 2
} as const


export const GHN_ORDER_STATUS = {
  CREATED: 'CREATED',
  PICKUPED: 'PICKUPED',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED'
} as const


export const GHN_SERVICE_TYPE = {
  STANDARD: 1,
  EXPRESS: 2,
  ECONOMY: 3
} as const
