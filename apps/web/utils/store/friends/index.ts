import { User } from '@repo/api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FriendState {
    friends: User[]
}

const initialState: FriendState = {
    friends: [],
}

const friendSlice = createSlice({
    name: 'friend',
    initialState,
    reducers: {
        setFriendState: (state, action: PayloadAction<User[]>) => {
            state.friends = action.payload
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
    },
})

export const filterFriends = (state: FriendState, searchTerm: string) => {
    return state.friends.reduce<User[]>((filtered, friend) => {
        if (
            friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            friend.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            friend.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            friend.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            friend.onlineStatus.includes(searchTerm.toLowerCase())
        ) {
            filtered.push(friend)
        }
        return filtered
    }, [])
}

export const findFriendById = (state: FriendState, id: number) => {
    return state.friends.find((friend) => friend.id === id)
}

export const { setFriendState, addFriendToState, updateFriendState } =
    friendSlice.actions

export default friendSlice.reducer
