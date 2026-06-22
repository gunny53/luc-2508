import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { showToast } from '@/components/ui/toastify'
import { ROUTES } from '@/constants/route'
import { authService } from '@/services/auth/auth-service'
import { clearClientState } from '@/utils/state-manager'

export function useLogout() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    try {
      await authService.logout({})
    } catch (error) {
      console.error('API logout failed, proceeding with client-side cleanup:', error)
    } finally {
      await clearClientState()
      try {
        await authService.getCsrfToken()
      } catch (error) {
        console.error('Failed to fetch new CSRF token after logout:', error)
      }
      showToast('English content normalized from the original source text.', 'success')
      window.location.href = ROUTES.AUTH.SIGNIN
    }
  }

  return { handleLogout, loading }
}
