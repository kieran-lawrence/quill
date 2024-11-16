import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authApi } from './auth'
import { chatsApi } from './chats'
import { userApi } from './user'

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [chatsApi.reducerPath]: chatsApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            chatsApi.middleware,
            userApi.middleware,
        ),
    devTools: true,
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
