import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import { DEFAULT_REDUX_ENCRYPTION_KEY } from '@/configs/common'

import authReducer from './features/auth/auth-slide'
import langReducer from './features/lang/lang-slice'
import profileReducer from './features/auth/profile-slide'
import ordersReducer from './features/checkout/orders-silde'

const rootReducer = combineReducers({
  authECSite: authReducer,
  langECSite: langReducer,
  profile: profileReducer,
  orders: ordersReducer
})

const isBrowser = typeof window !== 'undefined'

const browserReducer = () => {
  const storage = {
    getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key: string, value: string) => {
      window.localStorage.setItem(key, value)
      return Promise.resolve(value)
    },
    removeItem: (key: string) => {
      window.localStorage.removeItem(key)
      return Promise.resolve()
    }
  }

  const encryptor = encryptTransform({
    secretKey: process.env.NEXT_PUBLIC_REDUX_ENCRYPTION_KEY || DEFAULT_REDUX_ENCRYPTION_KEY,
    onError: (err) => console.error('Encrypt error:', err)
  })

  const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['authECSite', 'langECSite', 'profile', 'orders'],
    transforms: [encryptor]
  }

  return persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer)
}

export const makeStore = () => {
  const reducer = (isBrowser ? browserReducer() : rootReducer) as typeof rootReducer

  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  })

  const persistor = isBrowser ? persistStore(store) : null
  return { store, persistor }
}
let storeInstance: ReturnType<typeof makeStore> | null = null

export const getStore = () => {
  if (!storeInstance) {
    storeInstance = makeStore()
  }
  return storeInstance
}

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['store']['dispatch']
export type RootState = ReturnType<AppStore['store']['getState']>
