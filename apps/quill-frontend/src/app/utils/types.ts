export type User = {
    id: number
    email: string
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
}
export type GroupChat = {
    id: number
    name: string
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
