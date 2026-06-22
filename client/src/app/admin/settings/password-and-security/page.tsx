'use client'
import { PasswordSecurityWrapper } from '@/components/admin/settings/password-and-security/password-security-wrapper'
import { useTranslations } from 'next-intl'

export default function PasswordAndSecuritySettingsPage() {
  const t = useTranslations()
  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
      <PasswordSecurityWrapper />
    </div>
  )
}
