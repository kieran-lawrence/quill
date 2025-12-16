import { User } from '@repo/api'
import { NestJSError } from '../../types'

const BASE_URL = 'http://localhost:3001/api/user'

export const updateUser = async (params: FormData) =>
    <Promise<User | NestJSError>>await fetch(`${BASE_URL}/update`, {
        method: 'POST',
        body: params,
        credentials: 'include',
    }).then((res) => res.json())
