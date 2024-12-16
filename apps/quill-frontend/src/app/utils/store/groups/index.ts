import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { NestJSError } from '../../types'
import { GroupChat, GroupMessage } from '@quill/data'

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
        postEditGroupMessage: builder.mutation<
            GroupMessage,
            UpdateGroupMessageParams
        >({
            query: ({ groupId, ...message }) => ({
                url: `/${groupId}/message/update`,
                method: 'PUT',
                body: message,
                credentials: 'include',
            }),
        }),
        postDeleteGroupMessage: builder.mutation<
            void,
            UpdateGroupMessageParams
        >({
            query: ({ messageId, groupId }) => ({
                url: `/${groupId}/message/${messageId}`,
                method: 'DELETE',
                credentials: 'include',
            }),
        }),
        postCreateGroupMessage: builder.mutation<
            GroupMessage,
            CreateGroupMessageParams
        >({
            query: ({ groupId, messageContent }) => ({
                url: `/${groupId}/message`,
                method: 'POST',
                body: { messageContent },
                credentials: 'include',
            }),
        }),
        postUpdateGroupChat: builder.mutation<void, UpdateGroupChatParams>({
            query: ({ groupId, ...chat }) => ({
                url: `/${groupId}/update`,
                method: 'POST',
                body: chat,
                credentials: 'include',
            }),
        }),
        postDeleteGroupChat: builder.mutation<void, number>({
            query: (groupId) => ({
                url: `/${groupId}`,
                method: 'DELETE',
                credentials: 'include',
            }),
        }),
        postChangeCoverImage: builder.mutation<void, UpdateGroupChatParams>({
            query: ({ groupId, formData }) => ({
                url: `/${groupId}/update`,
                method: 'POST',
                body: formData,
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
    usePostEditGroupMessageMutation,
    usePostDeleteGroupMessageMutation,
    usePostUpdateGroupChatMutation,
    usePostDeleteGroupChatMutation,
    usePostChangeCoverImageMutation,
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
    groupId: number
    messageContent: string
}
type UpdateGroupChatParams = {
    groupId: number
    name?: string
    formData?: FormData
}
type UpdateGroupMessageParams = {
    groupId: number
    messageId: number
    messageContent?: string
}
