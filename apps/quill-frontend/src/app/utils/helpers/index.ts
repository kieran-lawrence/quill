import { GroupChat } from '../types'

export const getGroupChatMembers = (chat: GroupChat) => {
    let members = ''
    chat.members.map((member) => {
        members += `${member.firstName}, `
    })
    return members.replace(/,\s*$/, '')
}
