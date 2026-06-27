'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useOrder } from '../use-orders'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  DollarSign,
  ShoppingBag,
  Loader2,
  Printer
} from 'lucide-react'

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const { orderDetail, loading, fetchOrderDetail, cancelOrder, handlePrintInvoice } = useOrder()

  useEffect(() => {
    if (id) fetchOrderDetail(id)
  }, [id, fetchOrderDetail])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
          <p className="text-slate-600 text-sm">??n h?ng</p>
        </div>
      </div>
    )

  if (!orderDetail)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-red-600 text-base font-medium">
            ??n h?ng
          </p>
          <p className="text-slate-500 mt-1 text-sm">??n h?ng</p>
        </div>
      </div>
    )

  const statusConfig: Record<string, { color: string; label: string; bgColor: string }> = {
    PENDING_PAYMENT: {
      color: 'text-amber-700',
      bgColor: 'bg-amber-50 border-amber-200',
      label: '??n h?ng'
    },
    PENDING_PACKAGING: {
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 border-blue-200',
      label: '??n h?ng'
    },
    PENDING_PICKUP: {
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 border-blue-200',
      label: '??n h?ng'
    },
    PENDING_DELIVERY: {
      color: 'text-purple-700',
      bgColor: 'bg-purple-50 border-purple-200',
      label: '??n h?ng'
    },
    DELIVERED: {
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50 border-emerald-200',
      label: '??n h?ng'
    },
    RETURNED: {
      color: 'text-slate-700',
      bgColor: 'bg-slate-50 border-slate-200',
      label: '??n h?ng'
    },
    CANCELLED: {
      color: 'text-red-700',
      bgColor: 'bg-red-50 border-red-200',
      label: '??n h?ng'
    }
  }

  const status = statusConfig[orderDetail.status] || {
    color: 'text-slate-700',
    bgColor: 'bg-slate-50 border-slate-200',
    label: orderDetail.status
  }
  const totalAmount =
    orderDetail.totalPayment || orderDetail.items.reduce((sum, item) => sum + item.skuPrice * item.quantity, 0)

  const showCancelButton = orderDetail.status === 'PENDING_PAYMENT'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-slate-200/60">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              ??n h?ng{orderDetail.id}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              ??n h?ng{' '}
              {format(new Date(orderDetail.createdAt), '??n h?ng')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={`${status.bgColor} ${status.color} border px-3 py-1.5 rounded-full text-xs font-medium`}>
            {status.label}
          </Badge>

          {}
          {id && (
            <Button
              variant="outline"
              onClick={() => handlePrintInvoice(id)}
              className="text-blue-600 border-blue-300 hover:bg-blue-50 h-9 px-4 text-sm"
            >
              <Printer className="w-3 h-3 mr-2" />
              ??n h?ng
            </Button>
          )}

          {showCancelButton && id && (
            <Button
              variant="outline"
              onClick={() => cancelOrder(id)}
              className="text-red-600 border-red-300 hover:bg-red-50 h-9 px-4 text-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  ??n h?ng
                </>
              ) : (
                '??n h?ng'
              )}
            </Button>
          )}
        </div>
      </div>

      {}
      <div className="grid lg:grid-cols-12 gap-6">
        {}
        <div className="lg:col-span-7 space-y-6">
          {}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-base font-medium text-slate-700">
                ??n h?ng
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">??n h?ng</p>
                  <p className="text-sm font-medium text-slate-800 truncate">{orderDetail.receiver.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">??n h?ng</p>
                  <p className="text-sm font-medium text-slate-800">{orderDetail.receiver.phone}</p>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">??n h?ng</p>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">{orderDetail.receiver.address}</p>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-base font-medium text-slate-700">
                ??n h?ng{orderDetail.items.length} ??n h?ng
              </h2>
            </div>

            <div className="space-y-4">
              {orderDetail.items.map((item, index) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50/30">
                  <div className="flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      width={70}
                      height={70}
                      className="rounded-lg object-cover border border-white shadow-sm"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h3 className="font-medium text-slate-800 text-sm leading-tight line-clamp-2">
                      {item.productName}
                    </h3>
                    <p className="text-slate-600 text-xs">{item.skuValue}</p>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-slate-500 text-xs">
                        SL: <span className="font-medium text-slate-700">{item.quantity}</span>
                      </p>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          {item.skuPrice.toLocaleString()}₫ × {item.quantity}
                        </p>
                        <p className="font-semibold text-sm text-emerald-600">
                          {(item.skuPrice * item.quantity).toLocaleString()}₫
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="lg:col-span-5 h-full">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/60 sticky top-6 h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-base font-medium text-slate-700">
                ??n h?ng
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-600 text-sm">
                    ??n h?ng
                  </span>
                </div>
                <span className="font-medium text-slate-800 text-sm">
                  {format(new Date(orderDetail.createdAt), 'dd/MM/yyyy')}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-600 text-sm">
                    ??n h?ng
                  </span>
                </div>
                <span className="font-medium text-slate-800 text-xs">#{orderDetail.paymentId}</span>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600 text-sm">
                    ??n h?ng
                  </span>
                  <span className="font-medium text-slate-800 text-sm">
                    {orderDetail.totalItemCost?.toLocaleString() || '0'}₫
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600 text-sm">
                    ??n h?ng
                  </span>
                  <span className="font-medium text-slate-800 text-sm">
                    {orderDetail.totalShippingFee?.toLocaleString() || '0'}₫
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600 text-sm">
                    ??n h?ng
                  </span>
                  <span className="font-medium text-red-600 text-sm">
                    -{orderDetail.totalVoucherDiscount?.toLocaleString() || '0'}₫
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 bg-emerald-50 rounded-lg px-4 mt-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-800 font-semibold text-sm">
                    ??n h?ng
                  </span>
                </div>
                <span className="font-semibold text-lg text-emerald-600">{totalAmount.toLocaleString()}₫</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
