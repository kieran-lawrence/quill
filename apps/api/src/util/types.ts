import {
    GroupChatEntity,
    PrivateMessageEntity,
    UserEntity,
    OnlineStatus,
} from '@repo/api'

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
    user: UserEntity
    firstName?: string
    lastName?: string
    onlineStatus?: OnlineStatus
    avatar?: Express.Multer.File
}
export type CreateChatParams = {
    user: UserEntity
    email: string
    message?: string
}
export type UpdateChatParams = {
    id: number
    lastMessageSent: PrivateMessageEntity
}
export type SearchChatsParams = {
    userOneId: number
    userTwo: Partial<UserEntity>
}
export type CreateGroupChatParams = {
    name?: string
    creator: UserEntity
    members: string[]
    message: string
}
export type UpdateGroupChatParams = {
    user: UserEntity
    file?: Express.Multer.File
} & Partial<GroupChatEntity>
export type ModifyGroupChatMemberParams = {
    groupId: number
    userId?: number
    user: UserEntity
    users?: number[]
}
export type DeleteGroupChatParams = {
    groupId: number
    user: UserEntity
}
export type AddFriendParams = {
    user: UserEntity
    email: string
}
export type DeleteFriendParams = {
    id: number
    friendId: number
}
export type CreateGroupMessageParams = {
    messageContent?: string
    groupId: number
    user: UserEntity
    image?: Express.Multer.File
}
export type EditGroupMessageParams = {
    user: UserEntity
    id: number
    messageContent: string
}
export type DeleteGroupMessageParams = {
    user: UserEntity
    id: number
}
export type CreatePrivateMessageParams = {
    messageContent?: string
    chatId: number
    user: UserEntity
    image?: Express.Multer.File
}
export type EditPrivateMessageParams = {
    user: UserEntity
    id: number
    messageContent: string
}
export type DeletePrivateMessageParams = {
    user: UserEntity
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
