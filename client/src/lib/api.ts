import { showToast } from '@/components/ui/toastify'
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { API_ENDPOINTS } from '@/constants/api'
import { ROUTES } from '@/constants/route'
import { getStore } from '@/store/store'
import { clearProfile } from '@/store/features/auth/profile-slide'

export const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true
})

publicAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const csrfToken = Cookies.get('csrf-token')
      if (csrfToken && config.headers) {
        config.headers['x-csrf-token'] = csrfToken
      }
      // Inject Accept-Language from Redux
      const store = getStore()
      const lang = store.store.getState().langECSite?.language || 'vi'
      if (config.headers) {
        config.headers['Accept-Language'] = lang
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

publicAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    console.error('❌ publicAxios error:', error)
    return Promise.reject(error)
  }
)

export const refreshAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

refreshAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const csrfToken = Cookies.get('csrf-token')
      if (csrfToken && config.headers) {
        config.headers['x-csrf-token'] = csrfToken
      }
      // Inject Accept-Language from Redux
      const store = getStore()
      const lang = store.store.getState().langECSite?.language || 'vi'
      if (config.headers) {
        config.headers['Accept-Language'] = lang
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const privateAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true
})

privateAxios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const csrfToken = Cookies.get('csrf_token')
      if (csrfToken && config.headers) {
        config.headers['x-csrf-token'] = csrfToken
      }
      // Inject Accept-Language from Redux
      const store = getStore()
      const lang = store.store.getState().langECSite?.language || 'vi'
      if (config.headers) {
        config.headers['Accept-Language'] = lang
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

const clearAllCookies = () => {
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  }
}

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

const handleLogout = async () => {
  const { store, persistor } = getStore()

  clearAllCookies()

  await persistor.purge()

  store.dispatch(clearProfile())

  showToast('Session expired. Please sign in again.', 'info')
  setTimeout(() => {
    window.location.href = ROUTES.AUTH.SIGNIN
  }, 100)
}

privateAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (axios.isAxiosError(error) && error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
          return privateAxios(originalRequest)
        } catch (err) {
          return Promise.reject(err)
        }
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await refreshAxios.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN)

        if (response.status === 200) {
          processQueue()
          return privateAxios(originalRequest)
        }
      } catch (refreshError) {
        processQueue(refreshError)
        await handleLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    if (error.response?.status === 401) {
      await handleLogout()
    }

    return Promise.reject(error)
  }
)
