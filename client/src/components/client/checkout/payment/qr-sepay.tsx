'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Clock, QrCode, CheckCircle2, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { selectCommonOrderInfo, selectShopProducts } from '@/store/features/checkout/orders-silde'
import { orderService } from '@/services/order-service'
import { useRouter } from 'next/navigation'
import { Order, OrderStatus } from '@/types/order.interface'
import { formatCurrency } from '@/utils/formatter'
import { toast } from 'sonner'
import { useECSiteSocket } from '@/providers/ec-site-socket-provider'

interface QrSepayProps {
  paymentId: string
  orderId: string 
  totalAmount?: number 
  onPaymentConfirm: () => void
  onPaymentCancel: () => void
}

export function QrSepay({ paymentId, orderId, totalAmount, onPaymentConfirm, onPaymentCancel }: QrSepayProps) {
  const [timeLeft, setTimeLeft] = useState(5 * 60) 
  const [isExpired, setIsExpired] = useState(false)
  const { payments, connect, disconnect } = useECSiteSocket()
  const commonInfo = useSelector(selectCommonOrderInfo)
  const router = useRouter()
  const finalTotalAmount = totalAmount || commonInfo.amount

  
  const SEPAY_ACCOUNT = process.env.NEXT_PUBLIC_SEPAY_ACCOUNT || '565615056666'
  const SEPAY_BANK = process.env.NEXT_PUBLIC_SEPAY_BANK || 'MbBank'

  
  const qrUrl = `https://qr.sepay.vn/img?acc=${SEPAY_ACCOUNT}&bank=${SEPAY_BANK}&amount=${finalTotalAmount}&des=DH${paymentId}`

  
  useEffect(() => {
    if (paymentId) {
      connect(paymentId)
    }
    return () => {
      disconnect()
    }
    
  }, [paymentId])

  
  useEffect(() => {
    
    
  }, [])

  
  useEffect(() => {
    if (payments.length === 0) return

    const latestPayment = payments[payments.length - 1]
    console.log('🔍 [WebSocket] Latest payment received:', latestPayment)
    console.log('🔍 [WebSocket] Current paymentId:', paymentId)
    console.log('🔍 [WebSocket] Current orderId:', orderId)

    
    if (
      latestPayment &&
      (latestPayment.paymentId?.toString() === paymentId?.toString() || latestPayment.orderId === orderId) && 
      latestPayment.status === 'success' &&
      latestPayment.gateway === 'sepay'
    ) {
      console.log('✅ [WebSocket] Payment success matched!')
      toast.success('Thanh to?n')
      console.clear()
      
      router.push(`/checkout/payment-success?orderId=${orderId}&totalAmount=${finalTotalAmount}`)
    } else {
      console.log('❌ [WebSocket] Payment not matched:')
      console.log('- PaymentId match:', latestPayment?.paymentId?.toString() === paymentId?.toString())
      console.log('- OrderId match:', latestPayment?.orderId === orderId)
      console.log('- Status match:', latestPayment?.status === 'success')
      console.log('- Gateway match:', latestPayment?.gateway === 'sepay')
    }
  }, [payments, paymentId, orderId, router, finalTotalAmount])

  
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  
  useEffect(() => {
    
    
  }, [])

  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handlePaymentConfirm = async () => {
    if (isExpired) {
      toast.error('Thanh to?n')
      return
    }
    try {
      if (!orderId) {
        toast.error('Thanh to?n')
        return
      }

      toast.loading('Thanh to?n')
      const Order = await orderService.getById(orderId)

      if (Order.data.status === OrderStatus.PICKUPED || OrderStatus.PENDING_PACKAGING || OrderStatus.VERIFY_PAYMENT) {
        toast.dismiss()
        toast.success('Thanh to?n')
        router.push(`/checkout/payment-success?orderId=${orderId}&totalAmount=${finalTotalAmount}`)
      } else {
        toast.dismiss()
        toast.info('Thanh to?n')
        
      }
    } catch (error) {
      toast.dismiss()
      console.error('Thanh to?n', error)
      toast.error('Thanh to?n')
    }
  }

  const handlePaymentCancel = () => {
    router.push(`/user/orders`)
  }

  if (isExpired) {
    return (
      <Card className="w-full max-w-md mx-auto border-red-200 shadow-lg">
        <CardHeader className="text-center bg-red-50 rounded-t-lg">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-red-600 text-xl font-bold">
            Thanh to?n
          </CardTitle>
          <CardDescription className="text-red-500">
            Thanh to?n
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Button
            onClick={handlePaymentCancel}
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
          >
            <X className="h-4 w-4 mr-2" />
            Thanh to?n
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto border-red-200 shadow-lg">
      <CardHeader className="text-center bg-gradient-to-b from-red-50 to-white rounded-t-lg">
        <div className="flex justify-center mb-4">
          <QrCode className="h-8 w-8 text-red-600" />
        </div>
        <CardTitle className="text-red-700 text-xl font-bold">
          Thanh to?n
        </CardTitle>
        <CardDescription className="text-gray-600">
          Thanh to?n
        </CardDescription>

        {}
        <div
          className={`flex items-center justify-center gap-2 mt-4 p-3 rounded-lg transition-all duration-300 ${
            timeLeft <= 60 ? 'bg-red-100 border border-red-300' : 'bg-red-50 border border-red-200'
          }`}
        >
          <Clock className={`h-5 w-5 ${timeLeft <= 60 ? 'text-red-600 animate-pulse' : 'text-red-500'}`} />
          <span className={`text-lg font-mono font-semibold ${timeLeft <= 60 ? 'text-red-700' : 'text-red-600'}`}>
            {formatTime(timeLeft)}
          </span>
          <span className={`text-sm ${timeLeft <= 60 ? 'text-red-600' : 'text-red-500'}`}>
            Thanh to?n
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {}
        <div className="flex justify-center relative">
          <div className="p-4 bg-white border-2 border-red-200 rounded-lg shadow-sm relative">
            <Image
              src={qrUrl}
              alt="QR Code Sepay"
              width={200}
              height={200}
              className={`w-48 h-48 object-contain transition-all duration-500 ${
                timeLeft <= 30 ? 'opacity-50 blur-sm grayscale' : 'opacity-100'
              }`}
              unoptimized 
            />
            {timeLeft <= 30 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 font-semibold text-sm">
                    Thanh to?n
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="space-y-3 p-4 bg-red-50 border border-red-100 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-medium">Thanh to?n</span>
            <span className="font-semibold text-gray-900">{SEPAY_ACCOUNT}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-medium">Thanh to?n</span>
            <span className="font-semibold text-gray-900">{SEPAY_BANK}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-medium">Thanh to?n</span>
            <span className="font-bold text-red-600 text-base">{formatCurrency(finalTotalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-medium">Thanh to?n</span>
            <span className="font-semibold text-gray-900">DH{paymentId}</span>
          </div>
        </div>

        {}
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-sm text-red-700">
            <strong className="text-red-800">Thanh to?n</strong>thanh to?n
          </AlertDescription>
        </Alert>

        {}
        <div className="space-y-3">
          <Button
            onClick={handlePaymentConfirm}
            className={`w-full transition-all duration-300 ${
              timeLeft <= 30 ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            disabled={isExpired}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Thanh to?n
          </Button>

          <Button
            onClick={handlePaymentCancel}
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
          >
            <X className="h-4 w-4 mr-2" />
            Thanh to?n
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
