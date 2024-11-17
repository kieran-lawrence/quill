import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { Friend, NestJSError, PrivateMessage, User } from '../../types'

export const friendsApi = createApi({
    reducerPath: 'friendsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3001/api/friend',
    }) as BaseQueryFn<string | FetchArgs, unknown, NestJSError>,
    endpoints: (builder) => ({
        getFriends: builder.query<User[], void>({
            query: () => ({
                url: `/`,
                method: 'GET',
                credentials: 'include',
            }),
            /**
             * Transforms the server response into a list of users
             * This is required because the schema for a Friend is {userOne:User,userTwo:User}
             * so we need to figure out which is not the current user in the Friend object
             */
            transformResponse: ({ friends, userId }: GetFriendResponse) =>
                friends.map((friend) =>
                    friend?.userOne.id === userId
                        ? friend?.userTwo
                        : friend?.userOne,
                ),
        }),
        addFriend: builder.query<PrivateMessage[], AddFriendParams>({
            query: ({ email }) => ({
                url: `/`,
                method: 'POST',
                credentials: 'include',
                body: {
                    email,
                },
            }),
        }),
    }),
})

export const { useGetFriendsQuery, useAddFriendQuery } = friendsApi

type AddFriendParams = {
    email: string
}
type GetFriendResponse = {
    friends: Friend[]
    userId: number
}
