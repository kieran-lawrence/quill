/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chat, GroupChat, GroupMessage, PrivateMessage, User } from './typeorm'
export type CreateUserParams = {
    email: string
    firstName: string
    lastName: string
    username: string
    password: string
}
export type FindUserParams = Partial<{
    id: number
    email: string
    username: string
}>
export type UpdateUserParams = {
    user: User
    data: any
    avatar?: any
}
export type CreateChatParams = {
    user: User
    email: string
    message?: string
}
export type UpdateChatParams = {
    id: number
    lastMessageSent: PrivateMessage
}
export type SearchChatsParams = {
    userOneId: number
    userTwo: Partial<User>
}
export type CreateGroupChatParams = {
    name?: string
    creator: User
    members: string[]
    message: string
}
export type UpdateGroupChatParams = {
    user: User
} & Partial<GroupChat>
export type ModifyGroupChatMemberParams = {
    groupId: number
    userId?: number
    user: User
    users?: number[]
}
export type AddFriendParams = {
    user: User
    email: string
}
export type DeleteFriendParams = {
    id: number
    friendId: number
}
export type CreateGroupMessageParams = {
    messageContent: string
    groupId: number
    user: User
}
export type CreateGroupMessageResponse = {
    message: GroupMessage
    chat: GroupChat
}
export type EditGroupMessageParams = {
    user: User
    id: number
    messageContent: string
}
export type EditGroupMessageResponse = {
    messageId: number
    message: GroupMessage
    updatedChat: GroupChat
}
export type DeleteGroupMessageParams = {
    user: User
    id: number
}
export type CreatePrivateMessageParams = {
    messageContent: string
    chatId: number
    user: User
}
export type CreatePrivateMessageResponse = {
    message: PrivateMessage
    chat: Chat
}
export type EditPrivateMessageParams = {
    user: User
    id: number
    messageContent: string
}
export type EditPrivateMessageResponse = {
    messageId: number
    message: PrivateMessage
    updatedChat: Chat
}
export type DeletePrivateMessageParams = {
    user: User
    id: number
}
