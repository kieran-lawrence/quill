import { User } from '@repo/api'
import { NestJSError } from '../../types'

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URI}/api/user`

export const updateUser = async (params: FormData) =>
    <Promise<User | NestJSError>>await fetch(`${BASE_URL}/update`, {
        method: 'POST',
        body: params,
        credentials: 'include',
    }).then((res) => res.json())
