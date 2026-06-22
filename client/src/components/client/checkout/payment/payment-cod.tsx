'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/formatter'
import { CheckCircle2, Home, ShoppingBag, Package, AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCheckoutState, selectCommonOrderInfo, selectShopOrders } from '@/store/features/checkout/orders-silde'
import { orderService } from '@/services/order-service'

interface PaymentCodProps {
  orderId: string
  totalAmount: number
  paymentId?: number
  orderData?: any
  isError?: boolean
  errorMessage?: string
}

export function PaymentCod({
  orderId,
  totalAmount,
  paymentId,
  orderData,
  isError = false,
  errorMessage
}: PaymentCodProps) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Get order info from Redux
  const commonInfo = useSelector(selectCommonOrderInfo)
  const shopOrders = useSelector(selectShopOrders)

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true)
        if (orderId && orderId !== 'N/A') {
          const response = await orderService.getById(orderId)
          setOrderDetails(response.data)
        } else if (orderData) {
          setOrderDetails(orderData)
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId, orderData])

  // Clear Redux state on mount
  useEffect(() => {
    console.log('[COD Payment Success] Clearing checkout state from Redux.')
    dispatch(clearCheckoutState())
  }, [dispatch])

  const handleRetry = () => {
    router.push('/checkout')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-lg mx-auto shadow-lg text-center">
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-lg mx-auto shadow-lg">
          <CardHeader className="bg-red-50 rounded-t-lg text-center">
            <div className="mx-auto bg-red-100 rounded-full p-4 w-fit">
              <AlertCircle className="h-16 w-16 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-800 mt-4">
              English content normalized from the original source text.
            </CardTitle>
            <CardDescription className="text-gray-600">
              {errorMessage || 'English content normalized from the original source text.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-lg mb-3 text-red-800">
                English content normalized from the original source text.
              </h3>
              <ul className="space-y-2 text-sm text-red-700">
                <li className="flex items-start">
                  <span className="font-bold mr-2">•</span>English content normalized from the original source text.
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">•</span>English content normalized from the original source text.
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">•</span>English content normalized from the original source text.
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">•</span>English content normalized from the original source text.
                </li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              English content normalized from the original source text.
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                English content normalized from the original source text.
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Success State
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        {/* Header - Success Message */}
        <CardHeader className="bg-green-50 rounded-t-lg text-center">
          <div className="mx-auto bg-green-100 rounded-full p-4 w-fit">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800 mt-4">
            English content normalized from the original source text.
          </CardTitle>
          <CardDescription className="text-gray-600">
            English content normalized from the original source text.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-gray-600" />
              English content normalized from the original source text.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">English content normalized from the original source text.</span>
                    <span className="font-mono font-semibold text-gray-800">{paymentId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">English content normalized from the original source text.</span>
                  <span className="font-semibold text-orange-600">
                    English content normalized from the original source text.
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">English content normalized from the original source text.</span>
                  <span className="font-bold text-xl text-green-700">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">English content normalized from the original source text.</span>
                  <span className="font-semibold text-blue-600">
                    English content normalized from the original source text.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          {shopOrders && shopOrders.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-lg mb-4">English content normalized from the original source text.</h3>
              <div className="space-y-3">
                {shopOrders.map((shopOrder, index) => (
                  <div key={shopOrder.shopId} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">Shop {index + 1}</p>
                        <p className="text-sm text-gray-600">
                          {shopOrder.cartItemIds.length} English content normalized from the original source text.
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">{formatCurrency(shopOrder.shippingFee || 0)}</p>
                        <p className="text-sm text-gray-500">
                          English content normalized from the original source text.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Notes */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-lg mb-3 text-orange-800">
              English content normalized from the original source text.
            </h3>
            <ul className="space-y-2 text-sm text-orange-700">
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>English content normalized from the original source text.
                <strong>{formatCurrency(totalAmount)}</strong>English content normalized from the original source text.
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>English content normalized from the original source text.
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>English content normalized from the original source text.
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>English content normalized from the original source text.
              </li>
            </ul>
          </div>
        </CardContent>

        {/* Footer Actions */}
        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button asChild className="w-full" variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              English content normalized from the original source text.
            </Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/user/orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              English content normalized from the original source text.
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
