import { Friend, FriendRequest, FriendRequestStatus } from '@repo/api'
import { NestJSError } from '../../types'

const BASE_URL = 'http://localhost:3001/api/friend'

export const getFriends = async () =>
    <Promise<GetFriendResponse | NestJSError>>await fetch(`${BASE_URL}/`, {
        method: 'GET',
        credentials: 'include',
    }).then(async (res) => res.json())

export const addFriend = async ({ email }: AddFriendParams) =>
    <Promise<Friend[] | NestJSError>>await fetch(`${BASE_URL}/request`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email }),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(async (res) => res.json())

export const updateFriendRequest = async (
    requestId: number,
    status: Omit<FriendRequestStatus, 'pending'>,
) => <Promise<FriendRequest | NestJSError>>await fetch(
        `${BASE_URL}/${requestId}/${status === 'accepted' ? 'accept' : 'reject'}`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    ).then(async (res) => res.json())
export const getFriendRequests = async () =>
    <Promise<FriendRequest[] | NestJSError>>await fetch(
        `${BASE_URL}/requests`,
        {
            method: 'GET',
            credentials: 'include',
        },
    ).then(async (res) => res.json())

type AddFriendParams = {
    email: string
}
type GetFriendResponse = {
    friends: Friend[]
    userId: number
}
