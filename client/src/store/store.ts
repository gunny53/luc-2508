import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import { DEFAULT_REDUX_ENCRYPTION_KEY } from '@/configs/common'

import authReducer from './features/auth/auth-slide'
import langReducer from './features/lang/lang-slice'
import profileReducer from './features/auth/profile-slide'
import ordersReducer from './features/checkout/orders-silde'
const encryptor = encryptTransform({
  secretKey: process.env.NEXT_PUBLIC_REDUX_ENCRYPTION_KEY || DEFAULT_REDUX_ENCRYPTION_KEY,
  onError: (err) => console.error('Encrypt error:', err)
})






const rootReducer = combineReducers({
  authECSite: authReducer,
  langECSite: langReducer,
  profile: profileReducer,
  orders: ordersReducer
})


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authECSite', 'langECSite', 'profile', 'orders'],
  transforms: [encryptor]
}

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer)

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  })

  const persistor = persistStore(store)
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
