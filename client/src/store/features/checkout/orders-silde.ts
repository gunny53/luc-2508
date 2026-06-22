import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { OrderCreateRequest, ProductInfo, AppliedVoucherInfo, CalculateOrderRequest } from '@/types/order.interface'
import { ShippingMethod } from '@/types/shipping.interface'

// --- Interfaces cho State ---
interface CommonOrderInfo {
  receiver: {
    name: string
    phone: string
    address: string
    provinceId: number
    districtId: number
    wardCode: string
  } | null
  paymentGateway: string | null
  amount: number
  shipping: {
    provinceId: string
    districtId: string
    wardCode: string
    provinceName?: string
    districtName?: string
    wardName?: string
  } | null
}
interface ShopOrderInfo {
  shopId: string
  cartItemIds: string[]
  discountCodes: string[]
  shippingFee: number
  shopAddress?: {
    provinceId: number
    districtId: number
    wardCode: string
    province: string
    district: string
    ward: string
    street: string
    name: string
  } | null
  selectedShippingMethod: ShippingMethod | null
}
interface CheckoutState {
  commonInfo: CommonOrderInfo
  shopOrders: ShopOrderInfo[]
  shopProducts: Record<string, ProductInfo[]>
  appliedVouchers: Record<string, AppliedVoucherInfo>
  appliedPlatformVoucher: AppliedVoucherInfo | null // For platform-wide voucher
  platformDiscountCodes: string[]
  calculationResult: any | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

// --- Initial State ---

const initialState: CheckoutState = {
  commonInfo: {
    receiver: null,
    paymentGateway: null,
    amount: 0,
    shipping: null
  },
  shopOrders: [],
  shopProducts: {},
  appliedVouchers: {},
  appliedPlatformVoucher: null,
  platformDiscountCodes: [],
  calculationResult: null,
  status: 'idle',
  error: null
}

// --- Slice Definition ---

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCommonInfo(state, action: PayloadAction<Partial<CommonOrderInfo>>) {
      state.commonInfo = { ...state.commonInfo, ...action.payload }
    },
    setShippingInfo(
      state,
      action: PayloadAction<{
        provinceId: string
        districtId: string
        wardCode: string
        provinceName?: string
        districtName?: string
        wardName?: string
      }>
    ) {
      state.commonInfo.shipping = action.payload
    },
    setShopProducts(state, action: PayloadAction<Record<string, ProductInfo[]>>) {
      state.shopProducts = action.payload
    },
    setShopOrders(state, action: PayloadAction<ShopOrderInfo[]>) {
      state.shopOrders = action.payload
    },
    updateDiscountForShop(state, action: PayloadAction<{ shopId: string; discountCodes: string[] }>) {
      const { shopId, discountCodes } = action.payload
      const shopIndex = state.shopOrders.findIndex((order) => order.shopId === shopId)
      if (shopIndex !== -1) {
        state.shopOrders[shopIndex].discountCodes = discountCodes
      }
    },
    updateShopAddress(
      state,
      action: PayloadAction<{
        shopId: string
        address: {
          provinceId: number
          districtId: number
          wardCode: string
          province: string
          district: string
          ward: string
          street: string
          name: string
        }
      }>
    ) {
      const { shopId, address } = action.payload
      const shopIndex = state.shopOrders.findIndex((order) => order.shopId === shopId)
      if (shopIndex !== -1) {
        state.shopOrders[shopIndex].shopAddress = address
      } else {
        state.shopOrders.push({
          shopId,
          cartItemIds: [],
          discountCodes: [],
          shippingFee: 0,
          shopAddress: address,
          selectedShippingMethod: null
        })
      }
    },
    clearCheckoutState: () => initialState,
    applyVoucher(state, action: PayloadAction<{ shopId: string; voucherInfo: AppliedVoucherInfo }>) {
      const { shopId, voucherInfo } = action.payload
      state.appliedVouchers[shopId] = voucherInfo
      const shopIndex = state.shopOrders.findIndex((order) => order.shopId === shopId)
      if (shopIndex !== -1) {
        state.shopOrders[shopIndex].discountCodes = [voucherInfo.code]
      }
    },
    removeVoucher(state, action: PayloadAction<{ shopId: string }>) {
      delete state.appliedVouchers[action.payload.shopId]
      const shopIndex = state.shopOrders.findIndex((order) => order.shopId === action.payload.shopId)
      if (shopIndex !== -1) {
        state.shopOrders[shopIndex].discountCodes = []
      }
    },
    applyPlatformVoucher(state, action: PayloadAction<AppliedVoucherInfo | null>) {
      state.appliedPlatformVoucher = action.payload
      state.platformDiscountCodes = action.payload ? [action.payload.code] : []
    },
    removePlatformVoucher(state) {
      state.appliedPlatformVoucher = null
      state.platformDiscountCodes = []
    },
    updateShippingForShop(state, action: PayloadAction<{ shopId: string; shippingMethod: ShippingMethod | null }>) {
      const { shopId, shippingMethod } = action.payload
      const shopIndex = state.shopOrders.findIndex((order) => order.shopId === shopId)
      if (shopIndex !== -1) {
        state.shopOrders[shopIndex].selectedShippingMethod = shippingMethod
      }
    },
    updateShippingFeeForShop(state, action: PayloadAction<{ shopId: string; shippingFee: number }>) {
      const { shopId, shippingFee } = action.payload
      const shopIndex = state.shopOrders.findIndex((order) => order.shopId === shopId)
      if (shopIndex !== -1) {
        state.shopOrders[shopIndex].shippingFee = shippingFee
      }
    },
    setPlatformDiscountCodes(state, action: PayloadAction<string[]>) {
      state.platformDiscountCodes = action.payload
    },
    setCalculationResult(state, action: PayloadAction<any>) {
      state.calculationResult = action.payload
    }
  }
})

// --- Actions ---
export const {
  setCommonInfo,
  setShippingInfo,
  setShopProducts,
  setShopOrders,
  updateDiscountForShop,
  updateShopAddress,
  clearCheckoutState,
  applyVoucher,
  removeVoucher,
  applyPlatformVoucher,
  removePlatformVoucher,
  updateShippingForShop,
  updateShippingFeeForShop,
  setPlatformDiscountCodes,
  setCalculationResult
} = checkoutSlice.actions

// --- Selectors ---

const selectCheckoutState = (state: RootState) => state.orders
export const selectAppliedPlatformVoucher = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.appliedPlatformVoucher
)
export const selectCommonOrderInfo = createSelector([selectCheckoutState], (checkout) => checkout.commonInfo)
export const selectShippingInfo = createSelector([selectCheckoutState], (checkout) => checkout.commonInfo.shipping)
export const selectShopProducts = createSelector([selectCheckoutState], (checkout) => checkout.shopProducts)
export const selectShopOrders = createSelector([selectCheckoutState], (checkout) => checkout.shopOrders)
export const selectShopAddress = (shopId: string) =>
  createSelector([selectCheckoutState], (checkout) => {
    const shopOrder = checkout.shopOrders.find((order) => order.shopId === shopId)
    return shopOrder?.shopAddress || null
  })
export const selectOrderCreateRequest = createSelector(
  [selectCommonOrderInfo, selectShopOrders, selectCheckoutState],
  (commonInfo, shopOrders, checkout): OrderCreateRequest | null => {
    if (!commonInfo.receiver || !commonInfo.paymentGateway || shopOrders.length === 0) {
      return null
    }

    return {
      shops: shopOrders.map((shopOrder: ShopOrderInfo) => ({
        shopId: shopOrder.shopId,
        receiver: commonInfo.receiver!,
        cartItemIds: shopOrder.cartItemIds,
        discountCodes: shopOrder.discountCodes,
        shippingInfo: {
          length: 30,
          weight: 2000,
          width: 20,
          height: 15,
          service_id: shopOrder.selectedShippingMethod?.service_id || 53321,
          service_type_id: shopOrder.selectedShippingMethod?.service_type_id || 2,
          shippingFee: shopOrder.shippingFee
        },
        isCod: commonInfo.paymentGateway === 'COD'
      })),
      platformDiscountCodes: checkout.platformDiscountCodes
    }
  }
)
export const selectAppliedVouchers = createSelector([selectCheckoutState], (checkout) => checkout.appliedVouchers)
export const selectTotalDiscountAmount = createSelector(
  [selectAppliedVouchers, selectAppliedPlatformVoucher],
  (appliedVouchers, appliedPlatformVoucher) => {
    let totalDiscount = 0
    totalDiscount += Object.values(appliedVouchers).reduce((total, voucher) => {
      if (voucher && typeof voucher.discountAmount === 'number') {
        return total + voucher.discountAmount
      }
      return total
    }, 0)
    if (appliedPlatformVoucher && typeof appliedPlatformVoucher.discountAmount === 'number') {
      totalDiscount += appliedPlatformVoucher.discountAmount
    }

    return totalDiscount
  }
)
export const selectCalculateOrderRequest = createSelector(
  [selectShopOrders, selectCheckoutState],
  (shopOrders, checkout): CalculateOrderRequest | null => {
    if (shopOrders.length === 0) {
      return null
    }

    return {
      shops: shopOrders.map((shopOrder: ShopOrderInfo) => ({
        shopId: shopOrder.shopId,
        cartItemIds: shopOrder.cartItemIds,
        shippingFee: shopOrder.shippingFee,
        discountCodes: shopOrder.discountCodes
      })),
      platformDiscountCodes: checkout.platformDiscountCodes
    }
  }
)
export const selectCalculationResult = createSelector([selectCheckoutState], (checkout) => checkout.calculationResult)
export const selectPlatformDiscountCodes = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.platformDiscountCodes
)

// --- Reducer ---
export default checkoutSlice.reducer
