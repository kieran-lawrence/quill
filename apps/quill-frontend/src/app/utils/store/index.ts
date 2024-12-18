import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import chatSlice from './chats'
import groupSlice from './groups'
import friendSlice from './friends'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const store = configureStore({
    reducer: {
        chats: chatSlice,
        groups: groupSlice,
        friends: friendSlice,
    },
    devTools: true,
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
