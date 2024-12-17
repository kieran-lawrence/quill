export type User = {
    id: number
    email: string
    username: string
    firstName: string
    lastName: string
    avatar?: string
    messages?: PrivateMessage[]
    groupChats?: GroupChat[]
}
export type PrivateMessage = {
    id: number
    messageContent: string
    createdAt: string
    author: User
    chat: Chat
}
export type Chat = {
    id: number
    creator: User
    recipient: User
    messages: PrivateMessage[]
    createdAt: string
    lastMessageSent: PrivateMessage
    lastMessageSentAt: string
}
export type GroupChat = {
    id: number
    name?: string
    creator: User
    members: User[]
    messages: GroupMessage[]
    createdAt: string
    lastMessageSent: GroupMessage
    lastMessageSentAt: string
    coverImage?: string
}
export type GroupMessage = {
    id: number
    messageContent: string
    createdAt: string
    author: User
    groupChat: GroupChat
}
export type Friend = {
    id: number
    userOne: User
    userTwo: User
    createdAt: string
}
export type CreateGroupMessageResponse = {
    message: GroupMessage
    chat: GroupChat
}
export type EditGroupMessageResponse = {
    messageId: number
    message: GroupMessage
    updatedChat: GroupChat
}
export type CreatePrivateMessageResponse = {
    message: PrivateMessage
    chat: Chat
}
export type EditPrivateMessageResponse = {
    messageId: number
    message: PrivateMessage
    updatedChat: Chat
}

export type DeleteResult = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raw: any
    affected?: number | null
}
