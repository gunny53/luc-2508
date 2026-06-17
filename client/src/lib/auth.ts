// English content normalized from the original source text.
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

import { getStore } from '@/store/store';

// English content normalized from the original source text.
export const getAccessToken = (): string | null => {
  const { store } = getStore();
  return store.getState()?.authECSite?.accessToken || null;
};

// English content normalized from the original source text.
export const getRefreshToken = (): string | null => {
  const { store } = getStore();
  return store.getState()?.authECSite?.refreshToken || null;
};

// English content normalized from the original source text.
export const setToken = (accessToken: string, refreshToken: string) => {
  const { store } = getStore();
  store.dispatch({ type: 'authECSite/setCredentials', payload: { accessToken, refreshToken, user: null } });
};

// English content normalized from the original source text.
export const removeToken = () => {
  const { store } = getStore();
  store.dispatch({ type: 'auth/logout' });
};

// English content normalized from the original source text.
export const setUser = (user: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// English content normalized from the original source text.
export const getUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// English content normalized from the original source text.
export const removeUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
};

// English content normalized from the original source text.
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// English content normalized from the original source text.
export const clearAuth = () => {
  removeToken();
  removeUser();
};
