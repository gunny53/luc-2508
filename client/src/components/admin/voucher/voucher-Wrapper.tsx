'use client'
import dynamic from 'next/dynamic'

const VoucherDynamic = dynamic(() => import('./voucher-table').then((mod) => mod.default), { ssr: false })

export default function VoucherWrapper() {
  return <VoucherDynamic />
}
