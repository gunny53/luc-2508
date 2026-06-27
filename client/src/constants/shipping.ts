
export const SHIPPING_CONFIG = {
  
  DEFAULT_PACKAGE: {
    height: 10,
    weight: 500,
    length: 15,
    width: 10
  },

  
  DEFAULT_FROM: {
    districtId: process.env.NEXT_PUBLIC_FROM_DISTRICT_ID ? parseInt(process.env.NEXT_PUBLIC_FROM_DISTRICT_ID) : 1536,
    wardCode: process.env.NEXT_PUBLIC_FROM_WARD_CODE || '480105'
  },

  
  API_CONFIG: {
    timeout: 10000, 
    retryCount: 3
  }
} as const

export type ShippingPackage = typeof SHIPPING_CONFIG.DEFAULT_PACKAGE
export type ShippingFromAddress = typeof SHIPPING_CONFIG.DEFAULT_FROM
