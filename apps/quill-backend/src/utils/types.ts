import { PrivateMessage, User } from './typeorm'

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
