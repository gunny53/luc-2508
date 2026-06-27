import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { authService } from '@/services/auth/auth-service'
import { setPermissions } from '@/store/features/auth/profile-slide'
import { AppDispatch } from '@/store/store'


export const useGetAbility = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAbility = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.getAbility()
      if (response && response.data && response.data.permissions) {
        dispatch(setPermissions(response.data.permissions))
      } else {
        
        throw new Error('Invalid response structure for permissions')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch abilities'
      setError(errorMessage)
      console.error('useGetAbility Error:', errorMessage)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  return { fetchAbility, loading, error }
}
