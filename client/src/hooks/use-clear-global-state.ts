'use client'

import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import { logOut } from '@/store/features/auth/auth-slide'
import { clearProfile } from '@/store/features/auth/profile-slide'
import { AppDispatch, getStore } from '@/store/store'
import { useCallback } from 'react'

export function useClearGlobalState() {
  const dispatch = useDispatch<AppDispatch>()

  const clearState = useCallback(async () => {
    console.log('ECSite')
    dispatch(logOut())
    dispatch(clearProfile())
    console.log('ECSite')
    try {
      const { persistor } = getStore()
      await persistor.purge()
      console.log('ECSite')
    } catch (error) {
      console.error('ECSite', error)
    }
    const allCookies = Cookies.get()
    for (const cookieName in allCookies) {
      if (cookieName !== 'XSRF-TOKEN') {
        Cookies.remove(cookieName, { path: '/' })
      }
    }
    console.log('ECSite')
  }, [dispatch])

  return { clearState }
}
