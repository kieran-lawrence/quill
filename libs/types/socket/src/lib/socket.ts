import { PrivateMessage, Chat, User, OnlineStatus } from '@quill/data'

export type NewPrivateMessageEventParams = {
    recipientId: number
} & MessageReceivedEventParams
export type MessageReceivedEventParams = {
    message: PrivateMessage
    chat: Chat
}
export type DeleteMessageEventParams = {
    messageId: number
    chatId: number
    userId: number
}
export type EditMessageEventParams = {
    messageId: number
    chatId: number
    messageContent: string
}
export type EditGroupChatMemberEventParams = {
    groupId: number
    userId?: number
    users?: number[]
}
export type UserStatusUpdatedEventParams = {
    user: User
    status: OnlineStatus
}
