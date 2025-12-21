import {
    Chat,
    CreatePrivateMessageResponse,
    DeleteResult,
    EditPrivateMessageResponse,
    PrivateMessage,
} from '@repo/api'
import { NestJSError } from '../../types'

const BASE_URL = 'http://localhost:3001/api/chat'

export const getChats = async () =>
    <Promise<Chat[] | NestJSError>>(
        await fetch(`${BASE_URL}`, { credentials: 'include' }).then((res) =>
            res.json(),
        )
    )

export const createChat = async (chat: CreateChatParams) =>
    <Promise<Chat | NestJSError>>await fetch(`${BASE_URL}`, {
        method: 'POST',
        body: JSON.stringify(chat),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json())

export const createPrivateMessage = async ({
    formData,
    chatId,
}: CreatePrivateMessageParams) => {
    const isFormData =
        typeof FormData !== 'undefined' && formData instanceof FormData

    return <Promise<CreatePrivateMessageResponse | NestJSError>>await fetch(
        `${BASE_URL}/${chatId}/message`,
        {
            method: 'POST',
            body: isFormData ? formData : JSON.stringify(formData),
            ...(isFormData
                ? {}
                : { headers: { 'Content-Type': 'application/json' } }),
            credentials: 'include',
        },
    ).then((res) => res.json())
}

export const editPrivateMessage = async ({
    chatId,
    ...params
}: UpdatePrivateMessageParams) =>
    <Promise<EditPrivateMessageResponse | NestJSError>>await fetch(
        `${BASE_URL}/${chatId}/message/update`,
        {
            method: 'POST',
            body: JSON.stringify(params),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    ).then((res) => res.json())

export const deletePrivateMessage = async ({
    chatId,
    messageId,
}: UpdatePrivateMessageParams) =>
    <Promise<DeleteResult | NestJSError>>await fetch(
        `${BASE_URL}/${chatId}/message/${messageId}`,
        {
            method: 'DELETE',
            credentials: 'include',
        },
    ).then((res) => res.json())

export const searchPrivateMessages = async ({
    chatId,
    query,
}: SearchMessagesParams) => <Promise<PrivateMessage[] | []>>await fetch(
        `${BASE_URL}/${chatId}/message/search?query=${query}`,
        {
            credentials: 'include',
        },
    ).then((res) => res.json())

type Message = {
    messageContent: string
}
type CreateChatParams = {
    email: string
    message?: string
}
type CreatePrivateMessageParams = {
    chatId: number
    formData: FormData | Message
}
type UpdatePrivateMessageParams = {
    chatId: number
    messageId: number
    messageContent?: string
}
type SearchMessagesParams = {
    chatId: number
    query: string
}
