import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { User } from '../../types'

interface NestJSError {
    data?: {
        message: string
        error: string
        statusCode: number
    }
    status: number
}
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3001/api/auth',
    }) as BaseQueryFn<string | FetchArgs, unknown, NestJSError>,
    endpoints: (builder) => ({
        postLogin: builder.mutation<void, LoginParams>({
            query: (loginParams) => ({
                url: `/login`,
                method: 'POST',
                body: loginParams,
                credentials: 'include',
            }),
        }),
        postRegister: builder.mutation<User, RegisterParams>({
            query: (registerParams) => ({
                url: `/register`,
                method: 'POST',
                body: registerParams,
            }),
        }),
        getAuthStatus: builder.query<Partial<User>, void>({
            query: () => ({
                url: `/status`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
    }),
})

export const {
    usePostLoginMutation,
    usePostRegisterMutation,
    useGetAuthStatusQuery,
} = authApi

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
