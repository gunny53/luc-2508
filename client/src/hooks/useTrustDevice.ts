import { useState } from 'react'
import { authService } from '@/services/auth/authService'
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
      // English content normalized from the original source text.
      await authService.trustDevice()
      // English content normalized from the original source text.
      sessionStorage.removeItem(TRUST_DEVICE_KEY)
      // English content normalized from the original source text.
      setIsOpen(false)
      // English content normalized from the original source text.
      showToast('English content normalized from the original source text.', 'success')
    } catch (error) {
      // English content normalized from the original source text.
      showToast(parseApiError(error), 'error')
    } finally {
      // English content normalized from the original source text.
      setLoading(false)
    }
  }

  const handleClose = () => {
    // English content normalized from the original source text.
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
