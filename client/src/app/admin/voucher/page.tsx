
import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'
import VoucherPageClient from './voucher-page-client'

export const metadata: Metadata = metadataConfig['/admin/voucher']

export default function VoucherPage() {
  return <VoucherPageClient />
}
