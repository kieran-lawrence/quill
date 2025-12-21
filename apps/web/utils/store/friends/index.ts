import { FriendRequest, User } from '@repo/api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FriendState {
    friends: User[]
    requests: FriendRequest[]
}

const initialState: FriendState = {
    friends: [],
    requests: [],
}

const friendSlice = createSlice({
    name: 'friend',
    initialState,
    reducers: {
        setFriendState: (state, action: PayloadAction<User[]>) => {
            state.friends = action.payload
        },
        setFriendRequestsState: (
            state,
            action: PayloadAction<FriendRequest[]>,
        ) => {
            state.requests = action.payload
        },
        addFriendToState: (state, action: PayloadAction<User>) => {
            state.friends.push(action.payload)
        },
        updateFriendState: (state, action: PayloadAction<User>) => {
            const index = state.friends.findIndex(
                (friend) => friend.id === action.payload.id,
            )
            if (index !== -1) {
                state.friends[index] = action.payload
            }
        },
        updateFriendRequestState: (
            state,
            action: PayloadAction<FriendRequest>,
        ) => {
            const index = state.requests.findIndex(
                (request) => request.id === action.payload.id,
            )
            if (index !== -1) {
                state.requests[index] = action.payload
            }
        },
    },
})

export const filterFriends = (state: FriendState, searchTerm: string) => {
    const friends: User[] = state.friends.reduce<User[]>((filtered, friend) => {
        if (matchesSearchTerm(searchTerm, friend)) {
            filtered.push(friend)
        }
        return filtered
    }, [])
    return {
        friends,
        pending: state.requests.filter(
            (request) => request.status === 'pending',
        ),
    }
}

const matchesSearchTerm = (searchTerm: string, friend: User) => {
    return (
        friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.onlineStatus.includes(searchTerm.toLowerCase())
    )
}

export const findFriendById = (state: FriendState, id: number) => {
    return state.friends.find((friend) => friend.id === id)
}

export const {
    setFriendState,
    addFriendToState,
    updateFriendState,
    setFriendRequestsState,
    updateFriendRequestState,
} = friendSlice.actions

export default friendSlice.reducer
