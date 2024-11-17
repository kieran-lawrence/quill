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
export type NestJSError = {
    status: number
    data?: {
        message?: string
        statusCode?: number
    }
}
export type Friend = {
    id: number
    userOne: User
    userTwo: User
    createdAt: number
}
