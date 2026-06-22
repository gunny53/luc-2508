'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUserData } from '@/hooks/use-get-data-user-login'
const PROTECTED_ROUTES = ['/admin', '/cart', '/user']
const ADMIN_ONLY_ROUTES = [
  '/admin/permissions',
  '/admin/roles',
  '/admin/users',
  '/admin/audit-logs',
  '/admin/languages',
  '/admin/device',
  '/admin/brand',
  '/admin/categories',
  '/admin/system'
]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const userData = useUserData()

  const isAuthenticated = !!userData

  useEffect(() => {
    const userRole = userData?.role?.name || ''
    const needsAuth = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))

    if (needsAuth && !isAuthenticated) {
      router.replace('/sign-in')
      return
    }
    if (isAuthenticated && pathname.startsWith('/admin')) {
      if (userRole === 'CLIENT') {
        router.replace('/not-found')
        return
      }
      if (userRole === 'SELLER') {
        const isAdminOnlyRoute = ADMIN_ONLY_ROUTES.some((route) => pathname === route || pathname.startsWith(route))

        if (isAdminOnlyRoute) {
          router.replace('/not-found')
          return
        }
      }
    }
    if (isAuthenticated && (pathname === '/sign-in' || pathname === '/sign-up')) {
      if (userRole === 'CLIENT') {
        router.replace('/')
      } else {
        router.replace('/admin')
      }
    }
  }, [isAuthenticated, pathname, userData, router])
  return <>{children}</>
}
