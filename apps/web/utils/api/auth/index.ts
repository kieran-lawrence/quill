import { User } from '@repo/api'
import { NestJSError } from '../../types'

const BASE_URL = 'http://localhost:3001/api/auth'

export const login = async (params: LoginParams) => <boolean>await fetch(
        `${BASE_URL}/login`,
        {
            method: 'POST',
            body: JSON.stringify(params),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    ).then((res) => res.ok)

export const register = async (params: RegisterParams) =>
    <Promise<User | NestJSError>>await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        body: JSON.stringify(params),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json())

export const authStatus = async () =>
    <Promise<User | NestJSError>>(
        await fetch(`${BASE_URL}/status`, { credentials: 'include' }).then(
            (res) => res.json(),
        )
    )

type LoginParams = {
    email: string
    password: string
}
type RegisterParams = {
    email: string
    firstName: string
    lastName: string
    avatar?: string
    password: string
}
