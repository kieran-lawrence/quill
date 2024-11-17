import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { GroupChat, GroupMessage, NestJSError } from '../../types'

export const groupsApi = createApi({
    reducerPath: 'groupsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3001/api/group',
    }) as BaseQueryFn<string | FetchArgs, unknown, NestJSError>,
    endpoints: (builder) => ({
        getGroupChats: builder.query<GroupChat[], void>({
            query: () => ({
                url: `/`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        getGroupChatById: builder.query<GroupChat, string>({
            query: (groupId) => ({
                url: `/${groupId}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        postCreateGroupChat: builder.mutation<GroupChat, CreateGroupChatParams>(
            {
                query: (chat) => ({
                    url: '/',
                    method: 'POST',
                    body: chat,
                    credentials: 'include',
                }),
            },
        ),
        getGroupMessages: builder.query<GroupMessage[], GetGroupMessagesParams>(
            {
                query: ({ groupId }) => ({
                    url: `/${groupId}/message`,
                    method: 'GET',
                    credentials: 'include',
                }),
            },
        ),
        postCreateGroupMessage: builder.mutation<
            GroupMessage,
            CreateGroupMessageParams
        >({
            query: ({ groupId, messageContent }) => ({
                url: `/${groupId}/message`,
                method: 'POST',
                body: messageContent,
                credentials: 'include',
            }),
        }),
    }),
})

export const {
    useGetGroupChatsQuery,
    useGetGroupChatByIdQuery,
    usePostCreateGroupChatMutation,
    useGetGroupMessagesQuery,
    usePostCreateGroupMessageMutation,
} = groupsApi

type GetGroupMessagesParams = {
    groupId: string
}
type CreateGroupChatParams = {
    members: string[]
    name?: string
    message?: string
}
type CreateGroupMessageParams = {
    groupId: string
    messageContent: string
}
