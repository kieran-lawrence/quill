import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { Chat, NestJSError, PrivateMessage } from '../../types'

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
        getChatById: builder.query<Chat, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        postCreateChat: builder.mutation<Chat, CreateChatParams>({
            query: (chat) => ({
                url: '/',
                method: 'POST',
                body: chat,
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
        postCreatePrivateMessage: builder.mutation<
            PrivateMessage,
            CreatePrivateMessageParams
        >({
            query: ({ chatId, messageContent }) => ({
                url: `/${chatId}/message`,
                method: 'POST',
                body: { messageContent },
                credentials: 'include',
            }),
        }),
    }),
})

export const {
    useGetChatsQuery,
    useGetChatByIdQuery,
    useGetPrivateMessagesQuery,
    usePostCreateChatMutation,
    usePostCreatePrivateMessageMutation,
} = chatsApi

type GetPrivateMessagesParams = {
    chatId: string
}
type CreateChatParams = {
    email: string
    message?: string
}
type CreatePrivateMessageParams = {
    chatId: number
    messageContent: string
}
