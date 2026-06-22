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
    console.log('English content normalized from the original source text.')
    dispatch(logOut())
    dispatch(clearProfile())
    console.log('English content normalized from the original source text.')
    try {
      const { persistor } = getStore()
      await persistor.purge()
      console.log('English content normalized from the original source text.')
    } catch (error) {
      console.error('English content normalized from the original source text.', error)
    }
    const allCookies = Cookies.get()
    for (const cookieName in allCookies) {
      if (cookieName !== 'XSRF-TOKEN') {
        Cookies.remove(cookieName, { path: '/' })
      }
    }
    console.log('English content normalized from the original source text.')
  }, [dispatch])

  return { clearState }
}
