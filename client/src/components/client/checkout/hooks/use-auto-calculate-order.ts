import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  selectCalculateOrderRequest,
  selectCalculationResult,
  selectShopOrders,
  selectAppliedPlatformVoucher,
  selectAppliedVouchers
} from '@/store/features/checkout/orders-silde'
import { useCalculateOrder } from './use-calculate-order'

export const useAutoCalculateOrder = () => {
  const calculateOrderRequest = useSelector(selectCalculateOrderRequest)
  const calculationResult = useSelector(selectCalculationResult)
  const shopOrders = useSelector(selectShopOrders)
  const appliedPlatformVoucher = useSelector(selectAppliedPlatformVoucher)
  const appliedVouchers = useSelector(selectAppliedVouchers)

  const { calculateOrder, loading, error, canCalculate } = useCalculateOrder()
  const lastCalculationHashRef = useRef<string>('')
  const isCalculatingRef = useRef(false)

  useEffect(() => {
    if (!canCalculate || isCalculatingRef.current) {
      return
    }
    const calculationHash = JSON.stringify({
      shopOrders: shopOrders.map((order) => ({
        shopId: order.shopId,
        cartItemIds: order.cartItemIds,
        shippingFee: order.shippingFee,
        discountCodes: order.discountCodes
      })),
      platformVoucherCode: appliedPlatformVoucher?.code || null,
      appliedVouchers: Object.keys(appliedVouchers).reduce(
        (acc, shopId) => {
          acc[shopId] = appliedVouchers[shopId]?.code || null
          return acc
        },
        {} as Record<string, string | null>
      )
    })
    if (calculationHash !== lastCalculationHashRef.current) {
      lastCalculationHashRef.current = calculationHash
      isCalculatingRef.current = true

      calculateOrder().finally(() => {
        isCalculatingRef.current = false
      })
    }
  }, [canCalculate, calculateOrder, shopOrders, appliedPlatformVoucher?.code, appliedVouchers])

  return {
    calculationResult,
    loading,
    error,
    canCalculate
  }
}
