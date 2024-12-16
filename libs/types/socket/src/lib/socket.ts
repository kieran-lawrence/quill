import { PrivateMessage, Chat } from '@quill/data'

export type NewPrivateMessageEventParams = {
    message: PrivateMessage
    chat: Chat
    recipientId: number
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
