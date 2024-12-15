import { Chat, GroupChat, User } from '../types'

export const getGroupChatMembers = (chat: GroupChat) => {
    let members = ''
    chat.members.map((member) => {
        members += `${member.firstName}, `
    })
    return members.replace(/,\s*$/, '')
}

export const isGroupChatCreator = (chat: GroupChat, user?: Partial<User>) => {
    return chat.creator.id === user?.id
}

/** Returns the display name of the chat */
export const getChatDisplayName = (
    chat: GroupChat | Chat,
    user?: Partial<User>,
) => {
    return 'members' in chat
        ? chat.name || getGroupChatMembers(chat)
        : user?.id === chat.creator.id
        ? `${chat.recipient.firstName} ${chat.recipient.lastName}`
        : `${chat.creator.firstName} ${chat.creator.lastName}`
}

/** Copies the provided text to the clipboard, calls the onCompletion function regardless of success or failure */
export const copyToClipboard = (text: string, onCompletion: () => void) => {
    navigator.clipboard.writeText(text).then(
        () => {
            onCompletion()
        },
        (err) => {
            onCompletion()
        },
    )
}
