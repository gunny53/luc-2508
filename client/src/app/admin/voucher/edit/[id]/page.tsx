'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { discountService } from '@/services/discount-service'
import { Discount } from '@/types/discount.interface'
import VoucherEditWrapper from '@/components/admin/voucher/edit/edit-wrapper'
import { useUserData } from '@/hooks/use-get-data-user-login'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

function EditVoucherContent() {
  const params = useParams()
  const router = useRouter()
  const userData = useUserData()
  const voucherId = params.id as string

  const [voucher, setVoucher] = useState<Discount | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  
  useEffect(() => {
    const fetchVoucher = async () => {
      if (!voucherId) {
        setError('M? gi?m gi?')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await discountService.getById(voucherId)

        if (response.data) {
          setVoucher(response.data)
        } else {
          setError('M? gi?m gi?')
        }
      } catch (err: any) {
        console.error('Error fetching voucher:', err)
        setError(err?.response?.data?.message || 'M? gi?m gi?')
        toast.error('M? gi?m gi?')
      } finally {
        setLoading(false)
      }
    }

    fetchVoucher()
  }, [voucherId])

  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <p className="text-sm text-gray-600">M? gi?m gi?</p>
        </div>
      </div>
    )
  }

  
  if (error || !voucher) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            M? gi?m gi?
          </h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/admin/voucher')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            M? gi?m gi?
          </button>
        </div>
      </div>
    )
  }

  const handleEditSuccess = () => {
    toast.success('M? gi?m gi?')
    router.push('/admin/voucher')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <button onClick={() => router.push('/admin/voucher')} className="hover:text-red-600">
            M? gi?m gi?
          </button>
          <span>/</span>
          <span>M? gi?m gi?</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          M? gi?m gi? {voucher.name}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          M? gi?m gi?<span className="font-medium">{voucher.code}</span>
        </p>
      </div>

      <VoucherEditWrapper voucher={voucher} userData={userData} onEditSuccess={handleEditSuccess} />
    </div>
  )
}

export default function EditVoucherPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            <p className="text-sm text-gray-600">M? gi?m gi?</p>
          </div>
        </div>
      }
    >
      <EditVoucherContent />
    </Suspense>
  )
}
