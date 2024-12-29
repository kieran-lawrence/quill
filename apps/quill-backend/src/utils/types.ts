import { OnlineStatus } from '@quill/data'
import { GroupChat, PrivateMessage, User } from './typeorm'
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
    firstName?: string
    lastName?: string
    onlineStatus?: OnlineStatus
    avatar?: Express.Multer.File
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
    file?: Express.Multer.File
} & Partial<GroupChat>
export type ModifyGroupChatMemberParams = {
    groupId: number
    userId?: number
    user: User
    users?: number[]
}
export type DeleteGroupChatParams = {
    groupId: number
    user: User
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
    messageContent?: string
    groupId: number
    user: User
    image?: Express.Multer.File
}
export type EditGroupMessageParams = {
    user: User
    id: number
    messageContent: string
}
export type DeleteGroupMessageParams = {
    user: User
    id: number
}
export type CreatePrivateMessageParams = {
    messageContent?: string
    chatId: number
    user: User
    image?: Express.Multer.File
}
export type EditPrivateMessageParams = {
    user: User
    id: number
    messageContent: string
}
export type DeletePrivateMessageParams = {
    user: User
    id: number
}
export type ValidateUserParams = {
    email: string
    password: string
}
export type SearchChatParams = {
    id: number
    query: string
}
