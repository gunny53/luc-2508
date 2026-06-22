'use client'

import { useRouter } from 'next/navigation'
import OrderIndex from '@/components/admin/orders/detail/orders-index'

export default function OrderDetailPage() {
  const router = useRouter()

  return <OrderIndex onBack={() => router.push('/admin/order')} />
}
