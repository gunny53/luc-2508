'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Phone, ChevronLeft, AlertTriangle } from 'lucide-react'
import { useOrder } from './use-order'
import { Order, OrderItem } from '@/types/order.interface'
import Link from 'next/link'
import { createProductSlug } from '@/components/client/products/shared/product-slug'
import { OrderTimeline } from './orders-timeline'
import OrderInfo from './orders-info'

interface OrderDetailProps {
  readonly orderId: string
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')

  const { fetchOrderDetail, cancelOrder, loading } = useOrder()
  const [order, setOrder] = useState<Order | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return
      try {
        const res = await fetchOrderDetail(orderId)
        setOrder(res?.data ?? null)
      } catch (err) {}
    }

    loadOrder()
  }, [orderId, fetchOrderDetail])

  const handleCancelClick = () => {
    setShowCancelDialog(true)
  }

  const handleConfirmCancel = async () => {
    if (!orderId) return

    setIsCancelling(true)
    try {
      await cancelOrder(orderId)
      const res = await fetchOrderDetail(orderId)
      setOrder(res?.data ?? null)
      setShowCancelDialog(false)
    } catch (error) {
      console.error('Error cancelling order:', error)
    } finally {
      setIsCancelling(false)
    }
  }

  const handleCancelDialogClose = () => {
    if (!isCancelling) {
      setShowCancelDialog(false)
    }
  }

  if (loading || !order) {
    return <div>English content normalized from the original source text.</div>
  }

  const statusMap: Record<string, { label: string; variant?: 'default' | 'destructive' }> = {
    PENDING_PAYMENT: { label: 'English content normalized from the original source text.' },
    PENDING_PACKAGING: { label: 'English content normalized from the original source text.' },
    PENDING_PICKUP: { label: 'English content normalized from the original source text.' },
    PENDING_DELIVERY: { label: 'English content normalized from the original source text.' },
    DELIVERED: { label: 'English content normalized from the original source text.' },
    RETURNED: { label: 'English content normalized from the original source text.' },
    CANCELLED: { label: 'English content normalized from the original source text.', variant: 'destructive' }
  }

  const currentStatus = statusMap[order.status] || { label: order.status }

  const selectedItem: OrderItem | undefined =
    order.items?.find((item) => item.productId === productId) || order.items?.[0]

  const totalQuantity = selectedItem?.quantity ?? order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  const discount = order.totalVoucherDiscount
  const shippingFee: number = order.totalShippingFee

  const totalAmount = order.totalItemCost

  const finalAmount = order.totalPayment

  return (
    <div className="mx-auto bg-[#f5f5f5] space-y-3 text-sm rounded-md">
      <Link
        href="/user/orders"
        className="flex items-center gap-1 text-muted-foreground text-sm bg-white rounded-lg p-4 border cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-[#121214] text-sm">
          English content normalized from the original source text.
          <span className="font-medium text-[#CFCFD3]"> English content normalized from the original source text.</span>
        </span>
      </Link>

      <section className="bg-white rounded-lg border p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">English content normalized from the original source text.</h2>
          <span className="text-sm font-medium">
            {order.status === 'DELIVERED'
              ? `English content normalized from the original source text.${order.orderCode}`
              : `English content normalized from the original source text.${order.orderCode}`}
          </span>
        </div>
        <OrderTimeline
          status={order.status}
          createdAt={order.createdAt}
          finalAmount={order.totalPayment}
          orderCode={order.orderCode}
        />
      </section>

      {order.status !== 'CANCELLED' && (
        <section className="bg-white rounded-lg border p-4 space-y-3">
          <OrderInfo orderCode={order.orderCode} />
        </section>
      )}

      {}
      <section className="bg-white rounded-lg border p-4 space-y-3">
        <h2 className="text-lg font-semibold">English content normalized from the original source text.</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium">
            English content normalized from the original source text.{order.paymentId}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            English content normalized from the original source text.{' '}
            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
          </span>
          <span className="text-muted-foreground">•</span>
          <Badge variant={currentStatus.variant || 'default'} className="text-xs text-white">
            {currentStatus.label}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div className="flex items-center gap-4">
            <img src={selectedItem?.image} alt={selectedItem?.productName} className="w-20 h-20 object-cover rounded" />
            <div>
              <p className="font-medium line-clamp-2">{selectedItem?.productName}</p>
              <div className="flex items-center gap-2">
                <span className="text-[#d70018] font-semibold">
                  {(selectedItem?.skuPrice ?? 0).toLocaleString()}English content normalized from the original source
                  text.
                </span>
              </div>
              <span className="text-xs bg-gray-100 rounded px-2 py-0.5">{selectedItem?.skuValue}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 min-w-[100px]">
            <span className="text-sm">English content normalized from the original source text. {totalQuantity}</span>
            <div className="flex gap-2">
              {}
              {(order.status === 'DELIVERED' || order.status === 'RETURNED' || order.status === 'CANCELLED') && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#d70018] text-[#d70018] hover:bg-[#d70018] hover:text-white min-w-[100px]"
                  onClick={() => {
                    if (selectedItem) {
                      const slug = createProductSlug(selectedItem.productName, selectedItem.productId)
                      router.push(`/products/${slug}`)
                    }
                  }}
                >
                  English content normalized from the original source text.
                </Button>
              )}
              {}
              {order.status === 'PENDING_PAYMENT' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#0066cc] text-[#0066cc] hover:bg-[#0066cc] hover:text-white min-w-[120px]"
                  onClick={() => {
                    router.push(`/checkout/retry/${order.id}`)
                  }}
                >
                  English content normalized from the original source text.
                </Button>
              )}

              {}
              {(order.status === 'PENDING_PAYMENT' || order.status === 'PENDING_PACKAGING') && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-500 hover:bg-red-50 min-w-[110px]"
                  onClick={handleCancelClick}
                >
                  English content normalized from the original source text.
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-3">
        {}
        <div className="md:col-span-5 flex flex-col space-y-3">
          {}
          <section className="bg-white rounded-lg border p-4 space-y-3">
            <h2 className="text-lg font-semibold">English content normalized from the original source text.</h2>
            <div className="px-2 space-y-2 text-base">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">English content normalized from the original source text.</span>
                <span className="font-sm">{order.receiver?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">English content normalized from the original source text.</span>
                <span className="font-sm">{order.receiver?.phone}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">English content normalized from the original source text.</span>
                <span className="font-sm text-right max-w-[70%]">{order.receiver?.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">English content normalized from the original source text.</span>
                <span className="text-muted-foreground">-</span>
              </div>
            </div>
          </section>

          {}
          <section className="bg-white rounded-lg border p-4 py-6 space-y-3">
            <h2 className="text-lg font-semibold">English content normalized from the original source text.</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">English content normalized from the original source text.</span>
                <span className="font-semibold">18002097</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-[#d70018] text-[#d70018] hover:bg-[#d70018] hover:text-white"
              >
                <Phone className="w-4 h-4 mr-1" />
                English content normalized from the original source text.
              </Button>
            </div>
          </section>

          {}
          <section className="bg-white rounded-lg border p-4 space-y-3 flex-1">
            <h2 className="text-lg font-semibold">English content normalized from the original source text.</h2>
            <div className="flex justify-between border-b">
              <span>English content normalized from the original source text.</span>
              <Button variant="link" className="text-primary px-0">
                English content normalized from the original source text.
              </Button>
            </div>
            <div className="flex justify-between">
              <span>English content normalized from the original source text.</span>
              <Button variant="link" className="text-primary px-0">
                English content normalized from the original source text.
              </Button>
            </div>
          </section>
        </div>

        {}
        <section className="bg-white rounded-lg border p-6 space-y-4 md:col-span-5 flex flex-col shadow-sm h-full">
          <h2 className="text-lg font-semibold">English content normalized from the original source text.</h2>

          {}
          <div className="p-2 space-y-3">
            <h3 className="text-base font-medium bg-neutral-100 rounded-xs px-2 py-1">
              English content normalized from the original source text.
            </h3>
            <div className="flex px-2 justify-between border-b pb-2">
              <span>English content normalized from the original source text.</span>
              <span>{totalQuantity}</span>
            </div>
            <div className="flex px-2 justify-between border-b pb-2">
              <span>English content normalized from the original source text.</span>
              <span>{totalAmount.toLocaleString()}English content normalized from the original source text.</span>
            </div>
            <div className="flex px-2 justify-between border-b pb-2">
              <span>English content normalized from the original source text.</span>
              <span>
                {shippingFee === 0
                  ? 'English content normalized from the original source text.'
                  : `${shippingFee.toLocaleString()}English content normalized from the original source text.`}
              </span>
            </div>
            <div className="flex px-2 justify-between border-b pb-2 text-green-600">
              <span>English content normalized from the original source text.</span>
              <span>-{discount.toLocaleString()}English content normalized from the original source text.</span>
            </div>
          </div>

          {}
          <div className="p-2 space-y-3 mt-3">
            <h3 className="text-base font-medium bg-neutral-100 rounded-xs px-2 py-1">
              English content normalized from the original source text.
            </h3>
            <div className="flex px-2 justify-between border-b pb-2 font-semibold text-[#d70018] text-lg">
              <span>English content normalized from the original source text.</span>
              <span>{finalAmount.toLocaleString()}English content normalized from the original source text.</span>
            </div>
            <p className="text-xs px-2 text-muted-foreground border-b pb-2">
              English content normalized from the original source text.
            </p>
            <div className="flex px-2 justify-between text-red-600">
              <span>English content normalized from the original source text.</span>
              <span>
                {order.status === 'PICKUPED' || order.status === 'PENDING_DELIVERY' || order.status === 'DELIVERED'
                  ? order.totalPayment.toLocaleString()
                  : '0'}
                English content normalized from the original source text.
              </span>
            </div>
          </div>
        </section>
      </div>

      {}
      <Dialog open={showCancelDialog} onOpenChange={handleCancelDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <DialogTitle>English content normalized from the original source text.</DialogTitle>
            </div>
            <DialogDescription className="text-left">
              English content normalized from the original source text.{' '}
              <span className="font-semibold">#{order?.paymentId}</span>English content normalized from the original
              source text.
              <br />
              <span className="text-red-600 text-sm mt-2 block">
                English content normalized from the original source text.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancelDialogClose} disabled={isCancelling}>
              English content normalized from the original source text.
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel} disabled={isCancelling} className="text-white">
              {isCancelling
                ? 'English content normalized from the original source text.'
                : 'English content normalized from the original source text.'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
