import {
    Chat,
    CreatePrivateMessageResponse,
    DeleteResult,
    EditPrivateMessageResponse,
} from '@quill/data'
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
    messageContent,
    chatId,
}: CreatePrivateMessageParams) =>
    <Promise<CreatePrivateMessageResponse | NestJSError>>await fetch(
        `${BASE_URL}/${chatId}/message`,
        {
            method: 'POST',
            body: JSON.stringify({ messageContent }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    ).then((res) => res.json())

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

type CreateChatParams = {
    email: string
    message?: string
}

type CreatePrivateMessageParams = {
    chatId: number
    messageContent: string
}

type UpdatePrivateMessageParams = {
    chatId: number
    messageId: number
    messageContent?: string
}
