export const GHN_CLIENT = 'GHN_CLIENT' as const

// English content normalized from the original source text.
export const GHN_PAYMENT_TYPE = {
  PREPAID: 1, // English content normalized from the original source text.
  COD: 2 // English content normalized from the original source text.
} as const

// GHN Order status Mapping
export const GHN_ORDER_STATUS = {
  CREATED: 'CREATED',
  PICKUPED: 'PICKUPED',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED'
} as const

// GHN Service Types
export const GHN_SERVICE_TYPE = {
  STANDARD: 1, // English content normalized from the original source text.
  EXPRESS: 2, // English content normalized from the original source text.
  ECONOMY: 3 // English content normalized from the original source text.
} as const
