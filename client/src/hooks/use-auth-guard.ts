import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'
import { ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES, ADMIN_ONLY_ROUTES, SELLER_ALLOWED_ROUTES } from '@/constants/route'
import { showToast } from '@/components/ui/toastify'
import { useUserData } from './use-get-data-user-login'

interface UseAuthGuardOptions {
  redirectTo?: string
  showToastMessage?: boolean
  silentCheck?: boolean
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { redirectTo = ROUTES.AUTH.SIGNIN, showToastMessage = true, silentCheck = false } = options

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const userData = useUserData()
  const checkAuth = useCallback(() => {
    try {
      const accessToken = Cookies.get('access_token')
      const hasToken = !!accessToken
      const hasReduxData = !!userData
      const isAuthed = hasToken || hasReduxData

      setIsAuthenticated(isAuthed)
      setIsLoading(false)
      return isAuthed
    } catch (error) {
      console.error('Error checking authentication:', error)
      setIsAuthenticated(false)
      setIsLoading(false)
      return false
    }
  }, [userData])
  const checkRouteAccess = useCallback((pathname: string) => {
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route))

    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route.replace(':slug', '').replace(':id', ''))
    )

    const isAdminRoute = pathname.startsWith('/admin')
    const canAccessAdminRoute = (userRole: string) => {
      if (!isAdminRoute) return true

      
      const normalizedRole = userRole?.toUpperCase?.() || ''

      console.log(`Checking admin route access: User role "${normalizedRole}", Route: "${pathname}"`)
      if (normalizedRole === 'ADMIN') {
        console.log('✅ Admin access granted')
        return true
      }
      if (normalizedRole === 'SELLER') {
        const canAccess = SELLER_ALLOWED_ROUTES.some((route) => pathname === route || pathname.startsWith(route))
        console.log(`${canAccess ? '✅' : '❌'} Seller access ${canAccess ? 'granted' : 'denied'}`)
        return canAccess
      }
      console.log(`❌ Access denied for role "${normalizedRole}" to admin routes`)
      return false
    }

    return {
      isProtectedRoute,
      isPublicRoute,
      isAdminRoute,
      canAccessAdminRoute
    }
  }, [])
  const getHomeRedirectByRole = useCallback((userRole: string) => {
    const normalizedRole = userRole?.toUpperCase?.() || ''

    console.log(`Getting home redirect for role: "${normalizedRole}"`)

    switch (normalizedRole) {
      case 'ADMIN':
      case 'SELLER':
        console.log('Redirecting to admin dashboard')
        return '/admin'
      case 'CLIENT':
      case 'CUSTOMER':
      default:
        console.log('Redirecting to home page')
        return '/'
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  const withAuth = <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options: { showError?: boolean } = {}
  ): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
    return async (...args: Parameters<T>) => {
      const isAuthed = checkAuth()

      if (!isAuthed) {
        if (options.showError !== false && showToastMessage) {
          showToast('X?c th?c', 'error')
        }
        throw new Error('UNAUTHORIZED')
      }

      try {
        return await fn(...args)
      } catch (error: any) {
        if (error?.response?.status === 401) {
          if (options.showError !== false && showToastMessage) {
            showToast('X?c th?c', 'error')
          }
          throw new Error('SESSION_EXPIRED')
        }
        throw error
      }
    }
  }
  const requireAuth = () => {
    const isAuthed = checkAuth()
    if (!isAuthed && showToastMessage) {
      showToast('X?c th?c', 'error')
    }
    return isAuthed
  }

  return {
    isAuthenticated,
    isLoading,
    userData,
    withAuth,
    requireAuth,
    checkAuth,
    checkRouteAccess,
    getHomeRedirectByRole
  }
}
