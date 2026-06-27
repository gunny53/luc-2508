import { useState } from 'react'
import { authService } from '@/services/auth/auth-service'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'

const TRUST_DEVICE_KEY = 'askToTrustDevice'

export function useTrustDevice() {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const checkTrustDevice = () => {
    const shouldTrust = sessionStorage.getItem(TRUST_DEVICE_KEY)
    if (shouldTrust === 'false') {
      setIsOpen(true)
    }
  }
  const handleTrustDevice = async () => {
    try {
      setLoading(true)
      await authService.trustDevice()
      sessionStorage.removeItem(TRUST_DEVICE_KEY)
      setIsOpen(false)
      showToast('X?c th?c', 'success')
    } catch (error) {
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setIsOpen(false)
      sessionStorage.removeItem(TRUST_DEVICE_KEY)
    }
  }

  return {
    loading,
    isOpen,
    checkTrustDevice,
    handleTrustDevice,
    handleClose
  }
}
