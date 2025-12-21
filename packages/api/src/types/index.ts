export type User = {
    id: number
    email: string
    username: string
    firstName: string
    lastName: string
    avatar?: string
    messages?: PrivateMessage[]
    groupChats?: GroupChat[]
    onlineStatus: OnlineStatus
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
    raw: any
    affected?: number | null
}
export type OnlineStatus = 'online' | 'offline' | 'away' | 'busy'

export type UpdateUserParams = {
    firstName?: string
    lastName?: string
    username?: string
    formData?: FormData
}

export type SocketEvent<TParams> = {
    event: string
    stateAction: (params: TParams) => void
    paramMap: (params: TParams) => void
}
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
export type UserUpdatedEventParams = {
    updatedUser: User
}

/** NestJS Routes / Services */
export enum Routes {
    AUTH = 'auth',
    USER = 'user',
    CHAT = 'chat',
    GROUP = 'group',
    GROUP_MESSAGE = 'group/:id/message',
    PRIVATE_MESSAGE = 'chat/:id/message',
    FRIEND = 'friend',
}
export enum Services {
    AUTH = 'AUTH_SERVICE',
    USER = 'USER_SERVICE',
    CHAT = 'CHAT_SERVICE',
    GROUP = 'GROUP_SERVICE',
    GROUP_MESSAGE = 'GROUP_MESSAGE_SERVICE',
    PRIVATE_MESSAGE = 'PRIVATE_MESSAGE_SERVICE',
    FRIEND = 'FRIEND_SERVICE',
    SESSION_STORE = 'SESSION_STORE_SERVICE',
}
export type GifResponse = {
    data: Gif[]
    pagination: GifPagination
    meta: GifMeta
}

export type GifMeta = {
    msg: string
    status: number
    response_id: string
}
export type GifPagination = {
    offset: number
    total_count: number
    count: number
}
export type Gif = {
    type: string
    id: string
    slug: string
    url: string
    bitly_url: string
    embed_url: string
    username: string
    source: string
    rating: string
    content_url: string
    user?: any // Replace 'any' with a User type if you have the structure
    source_tld: string
    source_post_url: string
    update_datetime: string
    create_datetime: string
    import_datetime: string
    trending_datetime: string
    images: any // Replace 'any' with an Images type if you have the structure
    title: string
    alt_text: string
    is_low_contrast?: boolean
}
