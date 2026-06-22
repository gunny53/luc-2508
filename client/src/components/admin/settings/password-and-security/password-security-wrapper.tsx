'use client'
import dynamic from 'next/dynamic'

const PasswordSecurityDynamic = dynamic(
  () => import('./password-security-table').then((mod) => mod.PasswordSecurityTable),
  { ssr: false }
)
const PasswordSecuritySessionDynamic = dynamic(
  () => import('./password-security-session').then((mod) => mod.PasswordSecuritySession),
  { ssr: false }
)

export function PasswordSecurityWrapper() {
  return <PasswordSecurityDynamic />
}

export function PasswordSecuritySessionWrapper() {
  return <PasswordSecuritySessionDynamic />
}
