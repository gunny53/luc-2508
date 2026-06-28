import Cookies from 'js-cookie'
import { logOut } from '@/store/features/auth/auth-slide'
import { clearProfile } from '@/store/features/auth/profile-slide'
import { getStore } from '@/store/store'

export async function clearClientState() {
  console.log('Clearing client state')
  const { store, persistor } = getStore()

  store.dispatch(logOut())
  store.dispatch(clearProfile())
  console.log('Redux state cleared')

  try {
    await persistor?.purge()
    console.log('Persisted state purged')
  } catch (error) {
    console.error('Failed to purge persisted state', error)
  }

  const allCookies = Cookies.get()
  for (const cookieName in allCookies) {
    if (cookieName !== 'csrf_token') {
      Cookies.remove(cookieName, { path: '/' })
    }
  }
  console.log('Client cookies cleared')

  if (typeof window !== 'undefined') {
    localStorage.clear()
    console.log('Local storage cleared')
  }

  if (typeof window !== 'undefined') {
    sessionStorage.clear()
    console.log('Session storage cleared')
  }

  console.log('Client state cleared')
}
