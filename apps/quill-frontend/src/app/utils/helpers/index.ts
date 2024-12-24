import { Chat, GroupChat, User } from '@quill/data'

export const getGroupChatMembers = (chat: GroupChat) => {
    let members = ''
    chat.members.map((member) => {
        members += `${member.firstName}, `
    })
    return members.replace(/,\s*$/, '')
}

export const isChatCreator = (chat: GroupChat | Chat, user?: User) => {
    return chat.creator.id === user?.id
}

/** Returns the display name of the chat */
export const getChatDisplayName = (chat: GroupChat | Chat, user?: User) => {
    return 'members' in chat
        ? chat.name || getGroupChatMembers(chat)
        : user?.id === chat.creator.id
        ? `${chat.recipient.firstName} ${chat.recipient.lastName}`
        : `${chat.creator.firstName} ${chat.creator.lastName}`
}

/** Copies the provided text to the clipboard */
export const copyToClipboard = (text: string) => {
    return navigator.clipboard.writeText(text)
}

/** Returns the recipient of the chat */
export const getChatRecipient = (chat: Chat, user?: User) => {
    return user?.id === chat?.creator.id ? chat?.recipient : chat?.creator
}

export const isImage = (fileName: string) => {
    return /\.(jpe?g|png|gif)$/i.test(fileName)
}
