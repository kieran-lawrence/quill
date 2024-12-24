import {
    CreateGroupMessageResponse,
    DeleteResult,
    EditGroupMessageResponse,
    GroupChat,
} from '@quill/data'
import { NestJSError } from '../../types'

const BASE_URL = 'http://localhost:3001/api/group'

export const getGroups = async () =>
    <Promise<GroupChat[] | NestJSError>>(
        await fetch(`${BASE_URL}`, { credentials: 'include' }).then((res) =>
            res.json(),
        )
    )

export const getGroupById = async (groupId: string) =>
    <Promise<GroupChat | NestJSError>>(
        await fetch(`${BASE_URL}/${groupId}`, { credentials: 'include' }).then(
            (res) => res.json(),
        )
    )

export const createGroup = async (chat: CreateGroupChatParams) =>
    <Promise<GroupChat | NestJSError>>await fetch(`${BASE_URL}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(chat),
    }).then((res) => res.json())

export const updateGroup = async ({
    groupId,
    ...group
}: UpdateGroupChatParams) => <Promise<GroupChat | NestJSError>>await fetch(
        `${BASE_URL}/${groupId}/update`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(group),
        },
    ).then((res) => res.json())

export const updateGroupCoverImage = async ({
    groupId,
    formData,
}: UpdateGroupChatParams) => <Promise<GroupChat | NestJSError>>await fetch(
        `${BASE_URL}/${groupId}/update`,
        {
            method: 'POST',
            credentials: 'include',
            body: formData,
        },
    ).then((res) => res.json())

export const deleteGroup = async (groupId: number) =>
    <Promise<DeleteResult | NestJSError>>await fetch(`${BASE_URL}/${groupId}`, {
        method: 'DELETE',
        credentials: 'include',
    }).then((res) => res.json())

export const createGroupMessage = async ({
    groupId,
    formData,
}: CreateGroupMessageParams) =>
    <Promise<CreateGroupMessageResponse | NestJSError>>await fetch(
        `${BASE_URL}/${groupId}/message`,
        {
            method: 'POST',
            credentials: 'include',
            body: formData,
        },
    ).then((res) => res.json())

export const updateGroupMessage = async ({
    groupId,
    ...message
}: UpdateGroupMessageParams) =>
    <Promise<EditGroupMessageResponse | NestJSError>>await fetch(
        `${BASE_URL}/${groupId}/message/update`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        },
    ).then((res) => res.json())

export const deleteGroupMessage = async ({
    groupId,
    messageId,
}: UpdateGroupMessageParams) =>
    <Promise<{ groupId: number } | NestJSError>>await fetch(
        `${BASE_URL}/${groupId}/message/${messageId}`,
        {
            method: 'DELETE',
            credentials: 'include',
        },
    ).then((res) => res.json())

type CreateGroupChatParams = {
    members: string[]
    name?: string
    message?: string
}
type CreateGroupMessageParams = {
    groupId: number
    formData: FormData
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
