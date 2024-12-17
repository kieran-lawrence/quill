import { Chat, PrivateMessage } from '@quill/data'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ChatState {
    chats: Chat[]
}

const initialState: ChatState = {
    chats: [],
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChatState: (state, action: PayloadAction<Chat[]>) => {
            state.chats = action.payload
        },
        addChatToState: (state, action: PayloadAction<Chat>) => {
            state.chats.push(action.payload)
        },
        updateChatState: (state, action: PayloadAction<Chat>) => {
            const index = state.chats.findIndex(
                (chat) => chat.id === action.payload.id,
            )
            if (index !== -1) {
                state.chats[index] = action.payload
            }
        },
        addMessageState: (
            state,
            action: PayloadAction<{ chatId: number; message: PrivateMessage }>,
        ) => {
            const { chatId, message } = action.payload
            const chat = state.chats.find((chat) => chat.id === chatId)
            if (chat) {
                const existingMessage = chat.messages.find(
                    (msg) => msg.id === message.id,
                )
                if (!existingMessage) {
                    chat.messages.unshift(message)
                }
            }
        },
        updatePrivateMessageState: (
            state,
            action: PayloadAction<{ chatId: number; message: PrivateMessage }>,
        ) => {
            const { chatId, message } = action.payload
            const chat = state.chats.find((chat) => chat.id === chatId)
            if (chat) {
                const index = chat.messages.findIndex(
                    (msg) => msg.id === message.id,
                )
                if (index !== -1) {
                    chat.messages[index] = message
                }
            }
        },
        deletePrivateMessageState: (
            state,
            action: PayloadAction<{ chatId: number; messageId: number }>,
        ) => {
            const { chatId, messageId } = action.payload
            const chat = state.chats.find((chat) => chat.id === chatId)
            if (chat) {
                chat.messages = chat.messages.filter(
                    (msg) => msg.id !== messageId,
                )
            }
        },
    },
})

export const getChatById = (state: ChatState, chatId: number) => {
    return state.chats.find((chat) => chat.id === chatId)
}

export const {
    addChatToState,
    setChatState,
    updateChatState,
    addMessageState,
    updatePrivateMessageState,
    deletePrivateMessageState,
} = chatSlice.actions

export default chatSlice.reducer
