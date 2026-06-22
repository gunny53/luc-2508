const TOKEN_KEY = 'token'
const USER_KEY = 'user'

import { getStore } from '@/store/store'
export const getAccessToken = (): string | null => {
  const { store } = getStore()
  return store.getState()?.authECSite?.accessToken || null
}
export const getRefreshToken = (): string | null => {
  const { store } = getStore()
  return store.getState()?.authECSite?.refreshToken || null
}
export const setToken = (accessToken: string, refreshToken: string) => {
  const { store } = getStore()
  store.dispatch({ type: 'authECSite/setCredentials', payload: { accessToken, refreshToken, user: null } })
}
export const removeToken = () => {
  const { store } = getStore()
  store.dispatch({ type: 'auth/logout' })
}
export const setUser = (user: any) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}
export const getUser = (): any | null => {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}
export const removeUser = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(USER_KEY)
}
export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}
export const clearAuth = () => {
  removeToken()
  removeUser()
}
