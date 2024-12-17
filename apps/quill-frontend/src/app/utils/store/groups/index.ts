import { GroupChat, GroupMessage } from '@quill/data'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { updateGroupMessage } from '../../api'

interface GroupState {
    groups: GroupChat[]
}

const initialState: GroupState = {
    groups: [],
}

const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        setGroupsState: (state, action: PayloadAction<GroupChat[]>) => {
            state.groups = action.payload
        },
        addGroupToState: (state, action: PayloadAction<GroupChat>) => {
            state.groups.push(action.payload)
        },
        updateGroupState: (state, action: PayloadAction<GroupChat>) => {
            const index = state.groups.findIndex(
                (group) => group.id === action.payload.id,
            )
            if (index !== -1) {
                state.groups[index] = action.payload
            }
        },
        deleteGroupState: (state, action: PayloadAction<number>) => {
            state.groups = state.groups.filter(
                (group) => group.id !== action.payload,
            )
        },
        addGroupMessageState: (
            state,
            action: PayloadAction<{ groupId: number; message: GroupMessage }>,
        ) => {
            const { groupId, message } = action.payload
            const group = state.groups.find((group) => group.id === groupId)
            if (group) {
                const existingMessage = group.messages.find(
                    (msg) => msg.id === message.id,
                )
                if (!existingMessage) {
                    group.messages.unshift(message)
                }
            }
        },
        updateGroupMessageState: (
            state,
            action: PayloadAction<{ groupId: number; message: GroupMessage }>,
        ) => {
            const { groupId, message } = action.payload
            const group = state.groups.find((group) => group.id === groupId)
            if (group) {
                const index = group.messages.findIndex(
                    (msg) => msg.id === message.id,
                )
                if (index !== -1) {
                    group.messages[index] = message
                }
            }
        },
        deleteGroupMessageState: (
            state,
            action: PayloadAction<{ groupId: number; messageId: number }>,
        ) => {
            const { groupId, messageId } = action.payload
            const group = state.groups.find((group) => group.id === groupId)
            if (group) {
                group.messages = group.messages.filter(
                    (msg) => msg.id !== messageId,
                )
            }
        },
    },
})

export const getGroupById = (state: GroupState, groupId: number) => {
    return state.groups.find((group) => group.id === groupId)
}

export const {
    addGroupToState,
    setGroupsState,
    updateGroupState,
    addGroupMessageState,
    updateGroupMessageState,
    deleteGroupMessageState,
    deleteGroupState,
} = groupSlice.actions

export default groupSlice.reducer
