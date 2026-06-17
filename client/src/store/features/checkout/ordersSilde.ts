import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { OrderCreateRequest, ProductInfo, AppliedVoucherInfo, CalculateOrderRequest } from '@/types/order.interface';
import { ShippingMethod } from '@/types/shipping.interface';

// --- Interfaces cho State ---

// English content normalized from the original source text.
interface CommonOrderInfo {
  receiver: {
    name: string;
    phone: string;
    address: string;
    provinceId: number;
    districtId: number;
    wardCode: string;
  } | null;
  paymentGateway: string | null;
  amount: number;
  shipping: {
    provinceId: string;
    districtId: string;
    wardCode: string;
    provinceName?: string;
    districtName?: string;
    wardName?: string;
  } | null;
}

// English content normalized from the original source text.
// English content normalized from the original source text.

interface ShopOrderInfo {
  shopId: string;
  cartItemIds: string[];
  discountCodes: string[];
  shippingFee: number; // English content normalized from the original source text.
  shopAddress?: {
    provinceId: number;
    districtId: number;
    wardCode: string;
    province: string;
    district: string;
    ward: string;
    street: string;
    name: string;
  } | null;
  selectedShippingMethod: ShippingMethod | null;
}

// English content normalized from the original source text.
interface CheckoutState {
  commonInfo: CommonOrderInfo;
  shopOrders: ShopOrderInfo[];
  shopProducts: Record<string, ProductInfo[]>; // English content normalized from the original source text.
  appliedVouchers: Record<string, AppliedVoucherInfo>; // English content normalized from the original source text.
  appliedPlatformVoucher: AppliedVoucherInfo | null; // For platform-wide voucher
  platformDiscountCodes: string[]; // English content normalized from the original source text.
  calculationResult: any | null; // English content normalized from the original source text.
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// --- Initial State ---

const initialState: CheckoutState = {
  commonInfo: {
    receiver: null,
    paymentGateway: null,
    amount: 0,
    shipping: null,
  },
  shopOrders: [],
  shopProducts: {},
  appliedVouchers: {},
  appliedPlatformVoucher: null,
  platformDiscountCodes: [],
  calculationResult: null,
  status: 'idle',
  error: null,
};

// --- Slice Definition ---

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    // English content normalized from the original source text.
    setCommonInfo(state, action: PayloadAction<Partial<CommonOrderInfo>>) {
      state.commonInfo = { ...state.commonInfo, ...action.payload };
    },
    // English content normalized from the original source text.
    setShippingInfo(state, action: PayloadAction<{
      provinceId: string;
      districtId: string;
      wardCode: string;
      provinceName?: string;
      districtName?: string;
      wardName?: string;
    }>) {
      state.commonInfo.shipping = action.payload;
    },
    // English content normalized from the original source text.
    // English content normalized from the original source text.
    setShopProducts(state, action: PayloadAction<Record<string, ProductInfo[]>>) {
      state.shopProducts = action.payload;
    },
    // English content normalized from the original source text.
    setShopOrders(state, action: PayloadAction<ShopOrderInfo[]>) {
      state.shopOrders = action.payload;
    },
    // English content normalized from the original source text.
    updateDiscountForShop(state, action: PayloadAction<{ shopId: string; discountCodes: string[] }>) {
      const { shopId, discountCodes } = action.payload;
      const shopIndex = state.shopOrders.findIndex(order => order.shopId === shopId);
      if (shopIndex !== -1) {
        state.shopOrders[shopIndex].discountCodes = discountCodes;
      }
    },

    // English content normalized from the original source text.
    updateShopAddress(state, action: PayloadAction<{
      shopId: string;
      address: {
        provinceId: number;
        districtId: number;
        wardCode: string;
        province: string;
        district: string;
        ward: string;
        street: string;
        name: string;
      }
    }>) {
      const { shopId, address } = action.payload;
      const shopIndex = state.shopOrders.findIndex(order => order.shopId === shopId);
      if (shopIndex !== -1) {
        // English content normalized from the original source text.
        state.shopOrders[shopIndex].shopAddress = address;
      } else {
        // English content normalized from the original source text.
        state.shopOrders.push({
          shopId,
          cartItemIds: [], // English content normalized from the original source text.
          discountCodes: [], // English content normalized from the original source text.
          shippingFee: 0, // English content normalized from the original source text.
          shopAddress: address,
          selectedShippingMethod: null, // English content normalized from the original source text.
        });
      }
    },

    // English content normalized from the original source text.
    clearCheckoutState: () => initialState,

    // English content normalized from the original source text.
    applyVoucher(state, action: PayloadAction<{ shopId: string; voucherInfo: AppliedVoucherInfo }>) {
      const { shopId, voucherInfo } = action.payload;
      state.appliedVouchers[shopId] = voucherInfo;
      // English content normalized from the original source text.
      const shopIndex = state.shopOrders.findIndex(order => order.shopId === shopId);
      if (shopIndex !== -1) {
        state.shopOrders[shopIndex].discountCodes = [voucherInfo.code];
      }
    },

    // English content normalized from the original source text.
    removeVoucher(state, action: PayloadAction<{ shopId: string }>) {
      delete state.appliedVouchers[action.payload.shopId];
      // English content normalized from the original source text.
      const shopIndex = state.shopOrders.findIndex(order => order.shopId === action.payload.shopId);
      if (shopIndex !== -1) {
        state.shopOrders[shopIndex].discountCodes = [];
      }
    },

    // English content normalized from the original source text.
    applyPlatformVoucher(state, action: PayloadAction<AppliedVoucherInfo | null>) {
      state.appliedPlatformVoucher = action.payload;
      // English content normalized from the original source text.
      state.platformDiscountCodes = action.payload ? [action.payload.code] : [];
    },

    // English content normalized from the original source text.
    removePlatformVoucher(state) {
      state.appliedPlatformVoucher = null;
      // English content normalized from the original source text.
      state.platformDiscountCodes = [];
    },

    // English content normalized from the original source text.
    updateShippingForShop(state, action: PayloadAction<{ shopId: string; shippingMethod: ShippingMethod | null }>) {
      const { shopId, shippingMethod } = action.payload;
      const shopIndex = state.shopOrders.findIndex(order => order.shopId === shopId);
      if (shopIndex !== -1) {
        state.shopOrders[shopIndex].selectedShippingMethod = shippingMethod;
      }
    },

    // English content normalized from the original source text.
    updateShippingFeeForShop(state, action: PayloadAction<{ shopId: string; shippingFee: number }>) {
      const { shopId, shippingFee } = action.payload;
      const shopIndex = state.shopOrders.findIndex(order => order.shopId === shopId);
      if (shopIndex !== -1) {
        state.shopOrders[shopIndex].shippingFee = shippingFee;
      }
    },

    // English content normalized from the original source text.
    setPlatformDiscountCodes(state, action: PayloadAction<string[]>) {
      state.platformDiscountCodes = action.payload;
    },

    // English content normalized from the original source text.
    setCalculationResult(state, action: PayloadAction<any>) {
      state.calculationResult = action.payload;
    },
  },
});

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
  setCalculationResult,
} = checkoutSlice.actions;

// --- Selectors ---

const selectCheckoutState = (state: RootState) => state.orders;

// English content normalized from the original source text.
export const selectAppliedPlatformVoucher = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.appliedPlatformVoucher
);



// English content normalized from the original source text.
export const selectCommonOrderInfo = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.commonInfo
);

// English content normalized from the original source text.
export const selectShippingInfo = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.commonInfo.shipping
);

// English content normalized from the original source text.
// English content normalized from the original source text.
export const selectShopProducts = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.shopProducts
);

// English content normalized from the original source text.
export const selectShopOrders = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.shopOrders
);

// English content normalized from the original source text.
export const selectShopAddress = (shopId: string) => createSelector(
  [selectCheckoutState],
  (checkout) => {
    const shopOrder = checkout.shopOrders.find(order => order.shopId === shopId);
    return shopOrder?.shopAddress || null;
  }
);

// English content normalized from the original source text.
export const selectOrderCreateRequest = createSelector(
  [selectCommonOrderInfo, selectShopOrders, selectCheckoutState],
  (commonInfo, shopOrders, checkout): OrderCreateRequest | null => {
    // English content normalized from the original source text.
    if (!commonInfo.receiver || !commonInfo.paymentGateway || shopOrders.length === 0) {
      return null;
    }

    return {
      shops: shopOrders.map((shopOrder: ShopOrderInfo) => ({
        shopId: shopOrder.shopId,
        receiver: commonInfo.receiver!,
        cartItemIds: shopOrder.cartItemIds,
        discountCodes: shopOrder.discountCodes,
        shippingInfo: {
          length: 30, // English content normalized from the original source text.
          weight: 2000,
          width: 20,
          height: 15,
          service_id: shopOrder.selectedShippingMethod?.service_id || 53321,
          service_type_id: shopOrder.selectedShippingMethod?.service_type_id || 2,
          shippingFee: shopOrder.shippingFee,
        },
        isCod: commonInfo.paymentGateway === 'COD',
      })),
      platformDiscountCodes: checkout.platformDiscountCodes,
    };
  }
);

// English content normalized from the original source text.
export const selectAppliedVouchers = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.appliedVouchers
);

// English content normalized from the original source text.
export const selectTotalDiscountAmount = createSelector(
  [selectAppliedVouchers, selectAppliedPlatformVoucher],
  (appliedVouchers, appliedPlatformVoucher) => {
    let totalDiscount = 0;

    // English content normalized from the original source text.
    totalDiscount += Object.values(appliedVouchers).reduce((total, voucher) => {
      if (voucher && typeof voucher.discountAmount === 'number') {
        return total + voucher.discountAmount;
      }
      return total;
    }, 0);

    // English content normalized from the original source text.
    if (appliedPlatformVoucher && typeof appliedPlatformVoucher.discountAmount === 'number') {
      totalDiscount += appliedPlatformVoucher.discountAmount;
    }

    return totalDiscount;
  }
);

// English content normalized from the original source text.
export const selectCalculateOrderRequest = createSelector(
  [selectShopOrders, selectCheckoutState],
  (shopOrders, checkout): CalculateOrderRequest | null => {
    if (shopOrders.length === 0) {
      return null;
    }

    return {
      shops: shopOrders.map((shopOrder: ShopOrderInfo) => ({
        shopId: shopOrder.shopId,
        cartItemIds: shopOrder.cartItemIds,
        shippingFee: shopOrder.shippingFee,
        discountCodes: shopOrder.discountCodes,
      })),
      platformDiscountCodes: checkout.platformDiscountCodes,
    };
  }
);

// English content normalized from the original source text.
export const selectCalculationResult = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.calculationResult
);

// English content normalized from the original source text.
export const selectPlatformDiscountCodes = createSelector(
  [selectCheckoutState],
  (checkout) => checkout.platformDiscountCodes
);

// --- Reducer ---
export default checkoutSlice.reducer;