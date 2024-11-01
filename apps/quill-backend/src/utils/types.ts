import { User } from './typeorm'

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
