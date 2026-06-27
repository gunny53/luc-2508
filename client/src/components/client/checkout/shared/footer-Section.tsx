'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tag, ArrowLeft, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectShopProducts,
  selectTotalDiscountAmount,
  selectAppliedPlatformVoucher,
  removePlatformVoucher,
  setCommonInfo,
  selectCalculationResult,
  setPlatformDiscountCodes
} from '@/store/features/checkout/orders-silde'
import { formatCurrency } from '@/utils/formatter'
import { useEffect, useState } from 'react'
import { PlatformVoucherModal } from './cart-platform-voucher'
import { AppliedVoucherInfo } from '@/types/order.interface'
import { useAutoCalculateOrder } from '@/components/client/checkout/hooks/use-auto-calculate-order'

interface FooterSectionProps {
  variant?: 'default' | 'mobile'
  step?: 'information' | 'payment'
  onPrevious?: () => void
  onNext?: () => void
  isSubmitting?: boolean
  onTotalChange?: (total: number) => void
}


function PriceLine({ label, value, isBold = false }: { label: string; value: string; isBold?: boolean }) {
  return (
    <div className={`flex justify-between items-center ${isBold ? 'font-semibold text-lg' : 'text-sm'}`}>
      <span className="text-gray-600">{label}</span>
      <span className={`${isBold ? 'text-red-600' : 'text-gray-800'}`}>{value}</span>
    </div>
  )
}

export function FooterSection({
  variant = 'default',
  step = 'information',
  onPrevious,
  onNext,
  isSubmitting = false,
  onTotalChange
}: FooterSectionProps) {
  const dispatch = useDispatch()
  const shopProducts = useSelector(selectShopProducts)
  const totalDiscount = useSelector(selectTotalDiscountAmount)
  const appliedPlatformVoucher = useSelector(selectAppliedPlatformVoucher)
  const calculationResult = useSelector(selectCalculationResult)
  const [isPlatformModalOpen, setPlatformModalOpen] = useState(false)
  const {
    calculationResult: autoCalculationResult,
    loading: calculationLoading,
    error: calculationError
  } = useAutoCalculateOrder()
  
  
  
  
  const finalCalculationResult = autoCalculationResult || calculationResult
  const subtotal =
    finalCalculationResult?.totalItemCost ||
    Object.values(shopProducts).reduce((total, shopProducts) => {
      return (
        total +
        shopProducts.reduce((shopTotal, product) => {
          return shopTotal + product.price * product.quantity
        }, 0)
      )
    }, 0)

  const shippingFee = finalCalculationResult?.totalShippingFee || 0
  const voucherDiscount = finalCalculationResult?.totalVoucherDiscount || totalDiscount
  const totalPayment = finalCalculationResult?.totalPayment || subtotal + shippingFee - totalDiscount

  const handleApplyPlatformVoucher = (voucher: AppliedVoucherInfo) => {
    
    setPlatformModalOpen(false)
  }
  useEffect(() => {
    if (onTotalChange) {
      onTotalChange(totalPayment)
    }
    dispatch(setCommonInfo({ amount: totalPayment }))
  }, [totalPayment, onTotalChange, dispatch])

  const getButtonText = () => {
    if (isSubmitting) return 'Thanh to?n'
    return step === 'information'
      ? 'Thanh to?n'
      : 'Thanh to?n'
  }

  if (variant === 'mobile') {
    return (
      <div className="space-y-3">
        {}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Thanh to?n</span>
          <span className="text-lg font-semibold text-primary">{formatCurrency(totalPayment)}</span>
        </div>

        {}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Thanh to?n"
            className="h-9 text-sm flex-1"
          />
          <Button variant="secondary" className="h-9 px-4 text-sm font-medium whitespace-nowrap">
            Thanh to?n
          </Button>
        </div>

        {}
        <div className="flex items-center gap-2">
          {step === 'payment' && (
            <Button variant="outline" onClick={onPrevious} className="flex-1 h-10 text-sm font-medium">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Thanh to?n
            </Button>
          )}
          <Button className="flex-1 h-10 text-sm font-medium" onClick={onNext} disabled={isSubmitting}>
            {getButtonText()}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      {}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Thanh to?n</span>
        </div>
        {appliedPlatformVoucher ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
              {appliedPlatformVoucher.code}
            </span>
            <button onClick={() => dispatch(removePlatformVoucher())} className="p-1 hover:bg-gray-200 rounded-full">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setPlatformModalOpen(true)}>
            Thanh to?n
          </Button>
        )}
      </div>

      <h2 className="text-lg font-semibold">Thanh to?n</h2>
      <div className="space-y-2">
        {calculationLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">
              Thanh to?n
            </span>
          </div>
        ) : calculationError ? (
          <div className="text-center py-4">
            <p className="text-red-600 text-sm mb-2">{calculationError}</p>
            <p className="text-xs text-gray-500">Thanh to?n</p>
          </div>
        ) : null}

        <div className="space-y-3">
          <PriceLine
            label="Thanh to?n"
            value={formatCurrency(subtotal)}
          />
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Thanh to?n</span>
            <span className="text-green-600 font-medium">-{formatCurrency(Math.abs(voucherDiscount))}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Thanh to?n</span>
          <span className="text-red-600 font-medium">{formatCurrency(shippingFee)}</span>
        </div>

        <Separator className="my-3" />
        <PriceLine
          label="Thanh to?n"
          value={formatCurrency(totalPayment)}
          isBold={true}
        />

        {finalCalculationResult && (
          <div className="text-xs text-gray-500 text-center mt-2">
            {finalCalculationResult.shops?.length > 0 &&
              `Thanh to?n${finalCalculationResult.shops.length} shop`}
          </div>
        )}
      </div>

      {isPlatformModalOpen && (
        <PlatformVoucherModal
          isOpen={isPlatformModalOpen}
          onClose={() => setPlatformModalOpen(false)}
          onApplyVoucher={handleApplyPlatformVoucher}
        />
      )}

      {}
      <div className="pt-6 mt-6 border-t">
        <div className="flex items-center gap-3">
          {step === 'payment' && (
            <Button variant="outline" onClick={onPrevious} className="flex-1 h-10 text-sm font-medium">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Thanh to?n
            </Button>
          )}
          <Button className="flex-1 h-10 text-sm font-medium" onClick={onNext} disabled={isSubmitting}>
            {getButtonText()}
          </Button>
        </div>
        <p className="text-xs text-center mt-3 text-gray-500">
          Thanh to?n
        </p>
      </div>
    </div>
  )
}
