'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useECSiteSocket } from '@/providers/ec-site-socket-provider'
import { formatCurrency } from '@/utils/formatter'
import { CheckCircle2, Home, Loader2, ShoppingBag, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { clearCheckoutState } from '@/store/features/checkout/orders-silde'
import { orderService } from '@/services/order-service'
import { OrderStatus } from '@/types/order.interface'

interface PaymentStatusProps {
  orderId: string
  totalAmount: number
  initialStatus: 'success' | 'pending' | 'failed'
  paymentMethod?: string
}

// Main component to orchestrate views
export function PaymentStatus({ orderId, totalAmount, initialStatus, paymentMethod }: PaymentStatusProps) {
  const [status, setStatus] = useState(initialStatus)
  const dispatch = useDispatch()
  useEffect(() => {
    console.log('[Payment Status Component]', {
      initialStatus,
      paymentMethod,
      orderId,
      totalAmount
    })
  }, [initialStatus, paymentMethod, orderId, totalAmount])
  useEffect(() => {
    console.log('[Payment Status] initialStatus updated:', initialStatus)
    setStatus(initialStatus)
  }, [initialStatus])

  // Clear Redux state on successful payment
  useEffect(() => {
    if (status === 'success') {
      console.log('[Payment Success] Clearing checkout state from Redux.')
      dispatch(clearCheckoutState())
    }
  }, [status, dispatch])
  useEffect(() => {
    if (status !== 'pending' || !orderId || orderId === 'N/A' || !orderId.match(/^[a-zA-Z0-9]+$/)) return

    const checkPaymentStatus = async () => {
      try {
        const orderData = await orderService.getById(orderId)
        if (
          orderData.data.status === OrderStatus.PICKUPED ||
          orderData.data.status === OrderStatus.PENDING_DELIVERY ||
          orderData.data.status === OrderStatus.DELIVERED
        ) {
          setStatus('success')
        } else if (orderData.data.status === OrderStatus.CANCELLED) {
          setStatus('failed')
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
      }
    }
    if (paymentMethod === 'vnpay') {
      console.log('[VNPay] Waiting for socket confirmation for 8 seconds before API fallback')

      const fallbackTimer = setTimeout(() => {
        console.log('[VNPay] Socket timeout, falling back to API check')
        checkPaymentStatus()
        const intervalId = setInterval(checkPaymentStatus, 3000)
        return () => clearInterval(intervalId)
      }, 8000)

      return () => clearTimeout(fallbackTimer)
    } else {
      checkPaymentStatus()
      const intervalId = setInterval(checkPaymentStatus, 3000)

      return () => clearInterval(intervalId)
    }
  }, [orderId, status, paymentMethod])
  console.log(
    `[PaymentStatus] Rendering view for status: ${status} (initialStatus: ${initialStatus}, paymentMethod: ${paymentMethod})`
  )

  if (status === 'pending') {
    return (
      <PendingView
        orderId={orderId}
        totalAmount={totalAmount}
        paymentMethod={paymentMethod}
        onPaymentSuccess={() => setStatus('success')}
      />
    )
  }

  if (status === 'success') {
    return <SuccessView orderId={orderId} totalAmount={totalAmount} />
  }

  return <FailureView orderId={orderId} />
}

// View for successful payment
const SuccessView = ({ orderId, totalAmount }: { orderId: string; totalAmount: number }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <Card className="w-full max-w-lg mx-auto shadow-lg text-center">
      <CardHeader className="bg-green-50 rounded-t-lg">
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
      <CardContent className="space-y-4 pt-6">
        <div className="text-left bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-3">English content normalized from the original source text.</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">English content normalized from the original source text.</span>
            <span className="font-mono font-semibold text-gray-800">{orderId}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-500">English content normalized from the original source text.</span>
            <span className="font-bold text-lg text-green-700">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
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

// View for pending payment
const PendingView = ({
  orderId,
  totalAmount,
  paymentMethod = 'vnpay',
  onPaymentSuccess
}: {
  orderId: string
  totalAmount: number
  paymentMethod?: string
  onPaymentSuccess: () => void
}) => {
  const { connect, disconnect } = useECSiteSocket()
  const [paymentId, setPaymentId] = useState<string>('')
  useEffect(() => {
    if (paymentMethod === 'vnpay') {
      const searchParams = new URLSearchParams(window.location.search)
      const orderInfo = searchParams.get('vnp_OrderInfo')

      if (orderInfo && orderInfo.startsWith('DH')) {
        setPaymentId(orderInfo.replace('DH', ''))
        console.log(`[VNPay] Extracted paymentId: ${orderInfo.replace('DH', '')}`)
      } else {
        setPaymentId(orderId)
      }
    } else {
      setPaymentId(orderId)
    }
  }, [orderId, paymentMethod])

  useEffect(() => {
    if (!paymentId || paymentId === 'N/A' || !paymentId.match(/^[a-zA-Z0-9]+$/)) {
      console.log('[Socket] Invalid paymentId, not connecting')
      return
    }
    console.log(`[Socket] Connecting with paymentId: ${paymentId} for ${paymentMethod} payment`)
    connect(paymentId)
    return () => disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId, paymentMethod])

  useEffect(() => {
    if (!paymentId || paymentId === 'N/A') {
      console.log('[Storage Events] No valid paymentId for storage listening')
      return
    }
    try {
      const existingData = localStorage.getItem('payment_event')
      if (existingData) {
        const paymentData = JSON.parse(existingData)
        if (paymentData && paymentData.paymentId.toString() === paymentId && paymentData.status === 'success') {
          console.log('✅ Existing payment success found for paymentId:', paymentId)
          localStorage.removeItem('payment_event')
          onPaymentSuccess()
          return
        }
      }
    } catch (err) {
      console.error('Error checking local storage:', err)
    }
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'payment_event' && event.newValue) {
        try {
          const paymentData = JSON.parse(event.newValue)
          if (paymentData && paymentData.paymentId.toString() === paymentId && paymentData.status === 'success') {
            console.log('✅ Payment success detected for paymentId:', paymentId)
            localStorage.removeItem('payment_event')
            onPaymentSuccess()
          }
        } catch (err) {
          console.error('Error processing storage event:', err)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [paymentId, onPaymentSuccess, paymentMethod])
  const getPaymentColors = () => {
    switch (paymentMethod) {
      case 'vnpay':
        return {
          primary: 'blue',
          light: 'blue-50',
          border: 'blue-100',
          text: 'blue-600',
          textDark: 'blue-800'
        }
      case 'momo':
        return {
          primary: 'pink',
          light: 'pink-50',
          border: 'pink-100',
          text: 'pink-600',
          textDark: 'pink-800'
        }
      default:
        return {
          primary: 'blue',
          light: 'blue-50',
          border: 'blue-100',
          text: 'blue-600',
          textDark: 'blue-800'
        }
    }
  }

  const colors = getPaymentColors()
  const getPaymentLogo = () => {
    switch (paymentMethod) {
      case 'vnpay':
        return '/images/client/checkout/vnpay_vi.webp'
      case 'momo':
        return '/images/client/checkout/momo_vi.webp'
      default:
        return null
    }
  }

  const paymentLogo = getPaymentLogo()
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className={`w-full max-w-lg mx-auto shadow-lg text-center border-${colors.border}`}>
        <CardHeader className={`bg-${colors.light}`}>
          {paymentLogo && (
            <div className="flex justify-center mb-4">
              <img src={paymentLogo} alt={`${paymentMethod} Logo`} className="h-10 object-contain" />
            </div>
          )}
          <div className="mx-auto p-4 w-fit">
            <Loader2 className={`h-16 w-16 text-${colors.text} animate-spin`} />
          </div>
          <CardTitle className={`text-2xl font-bold text-${colors.textDark} mt-4`}>
            English content normalized from the original source text.
          </CardTitle>
          <CardDescription className="text-gray-600">
            English content normalized from the original source text.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <div className="text-left bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-lg mb-3">English content normalized from the original source text.</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">English content normalized from the original source text.</span>
              <span className="font-mono font-semibold text-gray-800">{orderId}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-500">English content normalized from the original source text.</span>
              <span className="font-bold text-lg text-blue-700">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-4">
            <p>English content normalized from the original source text.</p>
            <p className="mt-1">English content normalized from the original source text.</p>
          </div>

          <Button onClick={() => router.push('/')} variant="outline" className="w-full mt-4">
            <Home className="mr-2 h-4 w-4" />
            English content normalized from the original source text.
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// View for failed payment
const FailureView = ({ orderId }: { orderId: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <Card className="w-full max-w-lg mx-auto shadow-lg text-center">
      <CardHeader className="bg-red-50 rounded-t-lg">
        <div className="mx-auto bg-red-100 rounded-full p-4 w-fit">
          <XCircle className="h-16 w-16 text-red-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-red-800 mt-4">
          English content normalized from the original source text.
        </CardTitle>
        <CardDescription className="text-gray-600">
          English content normalized from the original source text.<span className="font-mono">{orderId}</span>.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button asChild className="w-full" variant="outline">
          <Link href="/checkout">English content normalized from the original source text.</Link>
        </Button>
        <Button asChild className="w-full">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            English content normalized from the original source text.
          </Link>
        </Button>
      </CardFooter>
    </Card>
  </div>
)
