import { Chat, GroupChat, User } from '@repo/api'

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
    return /\.(jpe?g|png)$/i.test(fileName)
}

export const isGif = (fileName: string) => {
    return /\.gif$/i.test(fileName)
}

/**
 * Check if the audio level is exceeding the threshold
 */
export const isAudioLevelExceedingThreshold = ({
    threshold,
    analyser,
}: {
    threshold: number
    analyser: AnalyserNode
}) => {
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(dataArray)

    const average =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
    const normalizedValue = average / 255

    return normalizedValue > threshold
}

/**
 * Check if the audio level is exceeding the threshold,
 * and call the appropriate callback
 */
export const checkAudioLevel = ({
    threshold,
    analyser,
    onExceedThreshold,
    onBelowThreshold,
}: {
    threshold: number
    analyser: AnalyserNode
    onExceedThreshold: () => void
    onBelowThreshold: () => void
}) => {
    if (isAudioLevelExceedingThreshold({ threshold, analyser })) {
        onExceedThreshold()
    } else {
        onBelowThreshold()
    }
}
