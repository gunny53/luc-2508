'use client'

import { PaymentStatus } from '@/components/client/checkout/payment/payment-success'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { orderService } from '@/services/order-service'

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'pending' | 'failed'>('pending')
  const [orderId, setOrderId] = useState('N/A')
  const [totalAmount, setTotalAmount] = useState(0)
  const isVNPayCallback = searchParams.has('vnp_ResponseCode')

  console.log('Payment Success Page:', {
    isVNPayCallback,
    params: Object.fromEntries(searchParams.entries())
  })

  useEffect(() => {
    const processParams = async () => {
      if (isVNPayCallback) {
        try {
          const vnpParams = Array.from(searchParams.entries())
            .filter(([key]) => key.startsWith('vnp_'))
            .reduce(
              (obj, [key, value]) => {
                obj[key] = value
                return obj
              },
              {} as Record<string, string>
            )
          const queryString = new URLSearchParams(vnpParams).toString()
          console.log('[VNPay] Sending verification request with params:', queryString)
          const response = await orderService.verifyVNPayReturn(queryString)
          console.log('[VNPay] Verification response:', response.data)
          const { isSuccess, vnp_TxnRef, vnp_Amount } = response.data
          const extractedOrderId = vnp_TxnRef.replace('DH', '')
          const amount = vnp_Amount
          setOrderId(extractedOrderId)
          setTotalAmount(amount)
          const newStatus = isSuccess ? 'success' : 'failed'
          console.log(`[VNPay] Setting payment status to: ${newStatus} for order: ${extractedOrderId}`)
          setPaymentStatus(newStatus)
        } catch (error) {
          console.error('Failed to verify VNPay payment:', error)
          setPaymentStatus('failed')
        }
      } else {
        const status = (searchParams.get('status') as 'success' | 'pending' | 'failed') || 'success'
        const orderIdFromParams = searchParams.get('orderId') || 'N/A'
        const totalAmountFromParams = Number(searchParams.get('totalAmount')) || 0

        setOrderId(orderIdFromParams)
        setTotalAmount(totalAmountFromParams)
        setPaymentStatus(status)
      }
    }

    processParams()
  }, [searchParams, isVNPayCallback])

  return (
    <PaymentStatus
      orderId={orderId}
      totalAmount={totalAmount}
      initialStatus={paymentStatus}
      paymentMethod={isVNPayCallback ? 'vnpay' : searchParams.get('paymentMethod') || 'unknown'}
    />
  )
}

const PaymentSuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Thanh to?n</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}

export default PaymentSuccessPage
