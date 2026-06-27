'use client'

import { useContext, useState } from 'react'
import { CheckoutContext } from '@/providers/checkout-context'
import { orderService } from '@/services/order-service'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectShopOrders,
  selectShopProducts,
  selectAppliedVouchers,
  selectAppliedPlatformVoucher,
  selectCommonOrderInfo,
  clearCheckoutState
} from '@/store/features/checkout/orders-silde'
import { SHIPPING_CONFIG } from '@/constants/shipping'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { OrderCreateRequest, OrderHandlerResult } from '@/types/order.interface'
import { CheckoutStep } from '@/providers/checkout-context'

export const useCheckout = () => {
  const context = useContext(CheckoutContext)
  const router = useRouter()
  const dispatch = useDispatch()

  
  const shopOrders = useSelector(selectShopOrders)
  const shopProducts = useSelector(selectShopProducts)
  const appliedVouchers = useSelector(selectAppliedVouchers)
  const appliedPlatformVoucher = useSelector(selectAppliedPlatformVoucher)
  const commonInfo = useSelector(selectCommonOrderInfo)

  const [isSubmitting, setIsSubmitting] = useState(false)

  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider')
  }

  
  const goToStep = (step: CheckoutStep) => {
    context.goToStep(step)
  }

  const updateReceiverInfo = (info: any) => {
    context.updateReceiverInfo(info)
  }

  const updatePaymentMethod = (method: any) => {
    context.updatePaymentMethod(method)
  }

  const updateShippingAddress = (address: any) => {
    context.updateShippingAddress(address)
  }

  const updateShippingMethod = (method: any) => {
    context.updateShippingMethod(method)
  }

  const handleCreateOrder = async (totalAmount?: number): Promise<OrderHandlerResult | undefined> => {
    if (isSubmitting) return

    
    if (!commonInfo.receiver?.name || !commonInfo.receiver?.phone || !commonInfo.receiver?.address) {
      toast.error('Thanh to?n')
      return
    }

    
    if (!context.state.paymentMethod) {
      toast.error('Thanh to?n')
      return
    }

    
    if (!shopOrders || shopOrders.length === 0) {
      toast.error('Thanh to?n')
      return
    } 
    const getPaymentGatewayId = (paymentMethod: string): string => {
      
      const paymentGatewayMap: { [key: string]: string } = {
        cod: 'COD',
        sepay: 'sepay',
        vnpay: 'vnpay'
      }
      return paymentGatewayMap[paymentMethod] || paymentMethod.toUpperCase()
    }

    const selectedPaymentGateway = getPaymentGatewayId(context.state.paymentMethod)
    const isCodPayment = context.state.paymentMethod === 'cod'

    setIsSubmitting(true)
    try {
      
      const platformDiscountCodes: string[] = []

      
      if (appliedPlatformVoucher && appliedPlatformVoucher.code) {
        platformDiscountCodes.push(appliedPlatformVoucher.code)
      }

      const orderPayload = {
        shops: shopOrders.map((order) => {
          
          const shopDiscountCodes: string[] = []
          const shopVoucher = appliedVouchers[order.shopId]
          if (shopVoucher && shopVoucher.code) {
            shopDiscountCodes.push(shopVoucher.code)
          }

          return {
            shopId: order.shopId,
            receiver: {
              name: commonInfo.receiver!.name,
              phone: commonInfo.receiver!.phone,
              address: commonInfo.receiver!.address,
              provinceId: commonInfo.receiver!.provinceId,
              districtId: commonInfo.receiver!.districtId,
              wardCode: commonInfo.receiver!.wardCode
            },
            cartItemIds: order.cartItemIds,
            discountCodes: shopDiscountCodes,
            shippingInfo: {
              length: SHIPPING_CONFIG.DEFAULT_PACKAGE.length,
              weight: SHIPPING_CONFIG.DEFAULT_PACKAGE.weight,
              width: SHIPPING_CONFIG.DEFAULT_PACKAGE.width,
              height: SHIPPING_CONFIG.DEFAULT_PACKAGE.height,
              service_id: order.selectedShippingMethod?.service_id || 53321,
              service_type_id: order.selectedShippingMethod?.service_type_id || 2,
              shippingFee: order.shippingFee || 0
            },
            isCod: isCodPayment
          }
        }),
        platformDiscountCodes: platformDiscountCodes
      }
      console.log('📦 Order Payload Data:', {
        paymentMethod: context.state.paymentMethod,
        paymentGateway: selectedPaymentGateway,
        isCod: isCodPayment,
        receiverInfo: commonInfo.receiver,
        shopOrders: shopOrders,
        finalPayload: orderPayload
      })

      
      const response = await orderService.create(orderPayload)
      const orderData = response.data

      
      if (selectedPaymentGateway === 'sepay') {
        toast.success('Thanh to?n')

        const orderId = orderData.orders && orderData.orders.length > 0 ? orderData.orders[0].id : undefined
        const result = {
          success: true,
          paymentMethod: 'sepay',
          orderData: orderData,
          orderId: orderId,
          paymentId: orderData.paymentId
        }
        return result
      } else if (selectedPaymentGateway === 'vnpay') {
        try {
          const vnPayResponse = await orderService.createPaymentVnPayUrl({
            amount: commonInfo.amount,
            orderInfo: `DH${orderData.paymentId}`,
            orderId: orderData.paymentId.toString(),
            locale: 'vn'
          })

          toast.success('Thanh to?n')
          const orderId = orderData.orders && orderData.orders.length > 0 ? orderData.orders[0].id : undefined

          const result = {
            success: true,
            paymentMethod: 'vnpay',
            orderData: {
              ...orderData,
              finalTotal: commonInfo.amount
            },
            orderId: orderId,
            paymentId: orderData.paymentId,
            paymentUrl: vnPayResponse.data.paymentUrl
          }
          return result
        } catch (vnPayError: any) {
          console.error('Failed to generate VNPay URL:', vnPayError)
          toast.error('Thanh to?n')
          const orderId = orderData.orders && orderData.orders.length > 0 ? orderData.orders[0].id : undefined

          return {
            success: false,
            paymentMethod: 'vnpay',
            orderData: orderData,
            orderId: orderId,
            error: vnPayError.message
          }
        }
      } else if (selectedPaymentGateway === 'COD' || isCodPayment) {
        toast.success('Thanh to?n')
        dispatch(clearCheckoutState())

        const orderId = orderData.orders && orderData.orders.length > 0 ? orderData.orders[0].id : undefined

        const result = {
          success: true,
          paymentMethod: 'COD',
          orderData: orderData,
          orderId: orderId,
          paymentId: orderData.paymentId
        }

        console.log('✅ COD Payment Result:', result)
        return result
      } else {
        toast.success('Thanh to?n')
        router.push(`/checkout/success?orderId=${orderData.orders[0].id}`) 
        const orderId = orderData.orders && orderData.orders.length > 0 ? orderData.orders[0].id : undefined

        const result = {
          success: true,
          paymentMethod: selectedPaymentGateway,
          orderData: orderData,
          orderId: orderId,
          paymentId: orderData.paymentId
        }

        console.log('✅ Other Payment Result:', result)
        return result
      }
    } catch (error: any) {
      console.error('Failed to create order:', error)
      toast.error(error.response?.data?.message || 'Thanh to?n')
      return {
        success: false,
        error: error.response?.data?.message || 'Thanh to?n'
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    state: context.state,
    goToStep,
    updateReceiverInfo,
    updatePaymentMethod,
    updateShippingAddress,
    updateShippingMethod,
    isSubmitting,
    handleCreateOrder
  }
}
