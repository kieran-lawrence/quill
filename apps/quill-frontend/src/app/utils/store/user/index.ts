import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { NestJSError } from '../../types'

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3001/api/user',
    }) as BaseQueryFn<string | FetchArgs, unknown, NestJSError>,
    endpoints: (builder) => ({
        postUpdateUser: builder.mutation<void, FormData>({
            query: (updateParams) => ({
                url: `/update`,
                method: 'POST',
                body: updateParams,
                credentials: 'include',
            }),
        }),
    }),
})

export const { usePostUpdateUserMutation } = userApi