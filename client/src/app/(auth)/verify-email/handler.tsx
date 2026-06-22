'use client'
import { redirect, useSearchParams } from 'next/navigation'
import { VerifyEmailForm } from '@/components/auth/verify-email/verifyemail-form'
import { useEffect } from 'react'

export default function VerifyCodeHandler() {
  const searchParams = useSearchParams()
  const type = searchParams.get('action')

  useEffect(() => {
    if (!type) {
      window.location.replace('/verify-email?action=signup')
    }
  }, [type])
  if (!type) return null

  return <VerifyEmailForm />
}
