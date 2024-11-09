import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { Chat, PrivateMessage } from '../../types'

interface NestJSError {
    status: number
    data?: {
        message?: string
        statusCode?: number
    }
}
export const chatsApi = createApi({
    reducerPath: 'chatsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3001/api/chat',
    }) as BaseQueryFn<string | FetchArgs, unknown, NestJSError>,
    endpoints: (builder) => ({
        getChats: builder.query<Chat[], void>({
            query: () => ({
                url: `/`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        getPrivateMessages: builder.query<
            PrivateMessage[],
            GetPrivateMessagesParams
        >({
            query: ({ chatId }) => ({
                url: `/${chatId}/message`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
    }),
})

export const { useGetChatsQuery, useGetPrivateMessagesQuery } = chatsApi

type GetPrivateMessagesParams = {
    chatId: string
}
