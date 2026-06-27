'use client'

import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { selectUserProfile } from '@/store/features/auth/profile-slide'
import { RootState } from '@/store/store'

export const useUserData = () => {
  const user = useSelector((state: RootState) => selectUserProfile(state))

  const userInfo = useMemo(() => {
    if (!user) {
      return null
    }
    
    return {
      ...user
    }
  }, [user])

  return userInfo
}
