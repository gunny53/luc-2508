'use client'
import PaymentTable from '@/components/client/user/account/desktop/payment/payment-table'
import { useTranslations } from 'next-intl'

export default function AuditLogsPage() {
  const t = useTranslations()
  return (
    <div className="space-y-6">
      <PaymentTable />
    </div>
  )
}
