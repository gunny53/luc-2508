// Base URL cho API
const API_BASE = '';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: `${API_BASE}/auth/login`,
    REFRESH_TOKEN: `${API_BASE}/auth/refresh-token`,
    LOGOUT: `${API_BASE}/auth/logout`,
    SEND_OTP: `${API_BASE}/auth/send-otp`,
    GOOGLE_LOGIN: `${API_BASE}/auth/google-link`,
    GET_CSRF_TOKEN: `${API_BASE}/cookies/csrf-token`,
    //PROFILE
    PROFILE: `${API_BASE}/profile`,
    UPDATE_PROFILE: `${API_BASE}/profile`,
    ADD_ADDRESS: `${API_BASE}/profile/addresses`,
    GET_ALL_ADDRESS: `${API_BASE}/profile/addresses`,
    GET_ADDRESS_DETAIL: `${API_BASE}/profile/addresses/:addressId`,
    UPDATE_ADDRESS: `${API_BASE}/profile/addresses/:addressId`,
    DELETE_ADDRESS: `${API_BASE}/profile/addresses/:addressId`,
    CHANGE_PASSWORD_PROFILE: `${API_BASE}/profile/change-password`,
    // SIGN-UP
    SIGNUP: `${API_BASE}/auth/complete-registration`,
    SIGNUP_SEND: `${API_BASE}/auth/initiate-registration`,
    // CHANGE PASSWORD
    CHANGE_PASSWORD: `${API_BASE}/auth/password/change`,
    // RESET PASSWORD
    RESET_PASSWORD: `${API_BASE}/auth/password/set-new`,
    RESET_PASSWORD_SEND: `${API_BASE}/auth/password/initiate-reset`,
    //VERIFY & RESEND
    VERIFY_OTP: `${API_BASE}/auth/otp/verify`,
    VERIFY_2FA: `${API_BASE}/auth/2fa/verify`, // English content normalized from the original source text.
    RESEND_OTP: `${API_BASE}/auth/otp/resend`,
    //SETUP 2FA
    SETUP_2FA: `${API_BASE}/auth/2fa/setup`,
    CONFIRM_2FA: `${API_BASE}/auth/2fa/confirm-setup`,
    DISABLE_2FA: `${API_BASE}/auth/2fa/disable`,
    //RECOVERY CODE
    REGENERATE_RECOVERY_CODES: `${API_BASE}/auth/2fa/regenerate-recovery-codes`,
    // DEVICE
    TRUST_DEVICE: `${API_BASE}/sessions/devices/trust-current`,
    UNTRUST_DEVICE: `${API_BASE}/auth/devices/:deviceId/untrust`,
    //GET ABILITY BY ROLE (PERMISSION)
    GET_ABILITY: `${API_BASE}/auth/ui-capabilities`,
  },
  BASE:{
    UPLOAD_MEDIA: `${API_BASE}/media/images/upload`,
    GET_PRESIGN_URL: `${API_BASE}/media/images/upload/presigned-urls`
  },
  // English content normalized from the original source text.
  USERS:{
    GETALL: `${API_BASE}/users`,
    GETBYID: `${API_BASE}/users/:id`,
    UPDATE: `${API_BASE}/users/:id`,
    POST: `${API_BASE}/users`,
    DELETE_BY_ID: `${API_BASE}/users/:id`,
  },
  // English content normalized from the original source text.
  ROLES:{
    GETALL: `${API_BASE}/roles`,
    GETBYID: `${API_BASE}/roles/:id`,
    UPDATE: `${API_BASE}/roles/:id`,
    POST: `${API_BASE}/roles`,
    POST_ROLE_PERMISSIONS: `${API_BASE}/roles/:id/assign-permissions`,
    DELETE_BY_ID: `${API_BASE}/roles/:id`,
  },
  // English content normalized from the original source text.
  PERMISSION:{
    GETALL: `${API_BASE}/permissions`,
    GETBYID: `${API_BASE}/permissions/:id`,
    UPDATE: `${API_BASE}/permissions/:id`,
    POST: `${API_BASE}/permissions`,
    DELETE_BY_ID: `${API_BASE}/permissions/:id`,
  },
  // English content normalized from the original source text.
  LANGUAGES:{
    GETALL: `${API_BASE}/languages`,
    GETBYID: `${API_BASE}/languages/:id`,
    UPDATE: `${API_BASE}/languages/:id`,
    POST: `${API_BASE}/languages`,
    DELETE_BY_ID: `${API_BASE}/languages/:id`,
  },
  // English content normalized from the original source text.
  MANAGE_PRODUCTS: {
    LIST: `${API_BASE}/manage-product/products`,
    DETAIL: `${API_BASE}/manage-product/products/:id`,
    CREATE: `${API_BASE}/manage-product/products`,
    UPDATE: `${API_BASE}/manage-product/products/:id`,
    DELETE: `${API_BASE}/manage-product/products/:id`
  },
  MANAGE_PRODUCTS_TRANSLATIONS:{
    LIST: `${API_BASE}/manage-product/products/translations`,
    DETAIL: `${API_BASE}/manage-product/products/translations/:id`,
    CREATE: `${API_BASE}/manage-product/products/translations`,
    UPDATE: `${API_BASE}/manage-product/products/translations/:id`,
    DELETE: `${API_BASE}/manage-product/products/translations/:id`
  },
  PRODUCTS:{
    LIST: `${API_BASE}/products`,
    DETAIL: `${API_BASE}/products/:id`,
    SEARCH: `${API_BASE}/search/products`,
  },
  // English content normalized from the original source text.
  CART:{
    GET_CART: `${API_BASE}/cart`,
    ADD_TO_CART: `${API_BASE}/cart`,
    UPDATE_CART_ITEM: `${API_BASE}/cart/:id`,
    DELETE_CART: `${API_BASE}/cart/delete`,
  },
  // English content normalized from the original source text.
  AUDIT_LOGS: {
    GETALL: `${API_BASE}/audit-logs`,
    GET_STATS: `${API_BASE}/audit-logs/stats`,
    GET_BY_ID: `${API_BASE}/audit-logs/:id`,
    GET_ACTIONS: `${API_BASE}/audit-logs/actions`,
    GET_ENTITIES: `${API_BASE}/audit-logs/entities`,
  },
  // English content normalized from the original source text.
  SESSIONS: {
    GETALL: `${API_BASE}/sessions`,
    REVOKE: `${API_BASE}/sessions/revoke`,
    REVOKE_ALL: `${API_BASE}/sessions/revoke-all`
  },
  // English content normalized from the original source text.
  BRANDS:{
    GETALL: `${API_BASE}/brands`,
    GET_BY_ID: `${API_BASE}/brands/:brandsId`,
    CREATE: `${API_BASE}/brands`,
    UPDATE: `${API_BASE}/brands/:brandsId`,
    DELETE: `${API_BASE}/brands/:brandsId`
  },
  BRANDS_TRANSLATIONS:{
    GETALL: `${API_BASE}/brands`,
    GET_BY_ID: `${API_BASE}/brands/:brandsId`,
    CREATE: `${API_BASE}/brands`,
    UPDATE: `${API_BASE}/brands/:brandsId`,
    DELETE: `${API_BASE}/brands/:brandsId`
  },
  // English content normalized from the original source text.
  CATEGORIES:{
    GETALL: `${API_BASE}/categories`,
    GET_BY_ID: `${API_BASE}/categories/:categoriesId`,
    CREATE: `${API_BASE}/categories`,
    UPDATE: `${API_BASE}/categories/:categoriesId`,
    DELETE_BY_ID: `${API_BASE}/categories/:categoriesId`
  },
   CATEGORIES_TRANSLATIONS:{
    GETALL: `${API_BASE}/categories`,
    GET_BY_ID: `${API_BASE}/categories/:categoriesId`,
    CREATE: `${API_BASE}/categories`,
    UPDATE: `${API_BASE}/categories/:categoriesId`,
    DELETE: `${API_BASE}/categories/:categoriesId`
  },
  // English content normalized from the original source text.
  ORDERS: {
    GETALL: `${API_BASE}/orders`,
    GET_BY_ID: `${API_BASE}/orders/:orderId`,
    CREATE: `${API_BASE}/orders`,
    CANCEL: `${API_BASE}/orders/:orderId`,
    CALCULATE_ORDER: `${API_BASE}/orders/calculate`,
    CREATE_PAYMENT_VNPAY_URL: `${API_BASE}/payment/vnpay/create-payment`
  },
  MANAGE_ORDER:{
    GETALL: `${API_BASE}/manage-order/orders`,
    GET_BY_ID: `${API_BASE}/manage-order/orders/:orderId`,
    UPDATE_STATUS: `${API_BASE}/manage-order/orders/:orderId/status`
  },
  // English content normalized from the original source text.
  REVIEW:{
    GET_BY_ID: `${API_BASE}/reviews/products/:productId`,
    CREATE: `${API_BASE}/reviews`,
    UPDATE: `${API_BASE}/reviews/:reviewId`,
    DELETE: `${API_BASE}/reviews/:reviewId`
  },
  // English content normalized from the original source text.
  DISCOUNT:{
    GETALL: `${API_BASE}/manage-discount/discounts`,
    CREATE: `${API_BASE}/manage-discount/discounts`,
    UPDATE: `${API_BASE}/manage-discount/discounts/:discountId`,
    DELETE: `${API_BASE}/manage-discount/discounts/:discountId`,
    GET_BY_ID: `${API_BASE}/manage-discount/discounts/:discountId`,
    GUEST_GET_DISCOUNT_LIST: `${API_BASE}/discounts/available`,
    VALIDATE_DISCOUNT: `${API_BASE}/discounts/validate-code`
  },
  // English content normalized from the original source text.
  ADDRESS:{
    GET_PROVINCES: `${API_BASE}/shipping/ghn/address/provinces`,
    GET_DISTRICTS: `${API_BASE}/shipping/ghn/address/districts`,
    GET_WARDS: `${API_BASE}/shipping/ghn/address/wards`
  },
  SHIPPING:{
    CALCULATE_FEE: `${API_BASE}/shipping/ghn/calculate-fee`,
    SERVICE: `${API_BASE}/shipping/ghn/services`,
    DELIVERY_TIME: `${API_BASE}/shipping/ghn/delivery-time`,
    ORDER_INFO: `${API_BASE}/shipping/ghn/order-info`
  }
}
