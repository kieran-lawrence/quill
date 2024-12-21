import {
    PrivateMessage,
    Chat,
    User,
    OnlineStatus,
    GroupMessage,
    GroupChat,
} from '@quill/data'

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
export type GroupMessageReceivedEventParams = {
    message: GroupMessage
    chat: GroupChat
}
export type EditGroupMessageEventParams = {
    groupId: number
    message: GroupMessage
}
export type EditPrivateMessageEventParams = {
    chatId: number
    message: PrivateMessage
}
export type DeleteGroupMessageEventParams = {
    groupId: number
    messageId: number
}
export type DeletePrivateMessageEventParams = {
    chatId: number
    messageId: number
}
