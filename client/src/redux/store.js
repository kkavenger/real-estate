import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

//Adding persist reducer and store it in local storage
const rootReducers = combineReducers({user: userReducer});

//It is the key to store the user in local storage
const persistconfig = {
  key : 'root',
  storage,
  version: 1,
}

const persistedReducers = persistReducer(persistconfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getdefaultMiddleware) => getdefaultMiddleware({
    serializableCheck: false,
  }),
  
})
export const persistor = persistStore(store)