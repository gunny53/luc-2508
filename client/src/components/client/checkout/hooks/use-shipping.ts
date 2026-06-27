import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { shippingService } from '@/services/shipping-service'
import { selectShippingInfo, selectShopOrders } from '@/store/features/checkout/orders-silde'
import { SHIPPING_CONFIG } from '@/constants/shipping'
import {
  ShippingServiceResponse,
  CalculateShippingFeeRequest,
  CalculateShippingFeeResponse,
  DeliveryTimeRequest,
  DeliveryTimeResponse,
  ShippingMethod
} from '@/types/shipping.interface'

export const useShipping = (shopId?: string) => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  
  const shippingInfo = useSelector(selectShippingInfo)
  const shopOrders = useSelector(selectShopOrders)

  
  const effectiveShopId = shopId || (shopOrders.length > 0 ? shopOrders[0].shopId : '')

  const fetchShippingServices = async () => {
    if (!shippingInfo?.districtId || !shippingInfo?.wardCode) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      
      const shopOrder = shopOrders.find((o) => o.shopId === effectiveShopId)
      if (!shopOrder || !shopOrder.cartItemIds.length) {
        setShippingMethods([])
        return
      }

      
      const allShippingMethods: ShippingMethod[] = []

      for (const cartItemId of shopOrder.cartItemIds) {
        try {
          const servicesResponse = await shippingService.getServices({
            cartItemId
          })

          if (servicesResponse.data) {
            const services = Array.isArray(servicesResponse.data) ? servicesResponse.data : [servicesResponse.data]

            
            for (const service of services) {
              try {
                let feeResponse, timeResponse
                let fallbackPrice = 30000
                let fallbackTime = 'Thanh to?n'

                try {
                  ;[feeResponse, timeResponse] = await Promise.all([
                    shippingService.calculateShippingFee({
                      height: 10,
                      weight: 500,
                      length: 15,
                      width: 10,
                      service_id: service.service_id,
                      cartItemId: cartItemId
                    }),
                    shippingService.calculateDeliveryTime({
                      service_id: service.service_id,
                      cartItemId: cartItemId
                    })
                  ])

                  const expectedDeliveryDate = new Date(timeResponse.data.expected_delivery_time)
                  fallbackTime = `Thanh to?n${expectedDeliveryDate.toLocaleDateString(
                    'vi-VN',
                    {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                      timeZone: 'Asia/Ho_Chi_Minh'
                    }
                  )}`
                } catch (apiError) {
                  console.warn(`API failed for service ${service.service_id}, using fallback values:`, apiError)
                }

                const finalPrice = feeResponse?.data?.total || fallbackPrice
                const finalTime = fallbackTime

                
                const existingMethodIndex = allShippingMethods.findIndex((m) => m.service_id === service.service_id)

                if (existingMethodIndex >= 0) {
                  
                  allShippingMethods[existingMethodIndex].price += finalPrice
                } else {
                  
                  allShippingMethods.push({
                    ...service,
                    id: String(service.service_id),
                    name: service.short_name,
                    price: finalPrice,
                    estimatedTime: finalTime,
                    description: feeResponse?.data?.total
                      ? 'Thanh to?n'
                      : 'Thanh to?n',
                    features: ['Thanh to?n'],
                    icon: service.service_type_id === 5 ? 'package' : 'truck'
                  } as ShippingMethod)
                }
              } catch (error) {
                console.error(`Failed to process service ${service.service_id} for cartItem ${cartItemId}:`, error)
                const existingMethodIndex = allShippingMethods.findIndex((m) => m.service_id === service.service_id)

                if (existingMethodIndex < 0) {
                  allShippingMethods.push({
                    ...service,
                    id: String(service.service_id),
                    name: service.short_name || 'Thanh to?n',
                    price: 30000,
                    estimatedTime: 'Thanh to?n',
                    description: 'Thanh to?n',
                    features: ['Thanh to?n'],
                    icon: service.service_type_id === 5 ? 'package' : 'truck'
                  } as ShippingMethod)
                }
              }
            }
          }
        } catch (error) {
          console.error(`Failed to fetch services for cartItem ${cartItemId}:`, error)
        }
      }

      setShippingMethods(allShippingMethods)
    } catch (err: any) {
      console.error('Error fetching shipping services:', err)
      setError('Thanh to?n')
    } finally {
      setLoading(false)
    }
  }

  
  useEffect(() => {
    if (shippingInfo?.districtId && shippingInfo?.wardCode) {
      fetchShippingServices()
    }
  }, [shippingInfo?.districtId, shippingInfo?.wardCode, effectiveShopId, shopOrders])

  return {
    shippingMethods,
    loading,
    error,
    refetch: fetchShippingServices
  }
}
