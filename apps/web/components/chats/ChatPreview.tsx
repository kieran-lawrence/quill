import styled from 'styled-components'
import { Chat, GroupChat, User } from '@repo/api'
import { Avatar } from '../Avatar'
import { GroupUserInitials } from '../GroupUserInitials'
import { useRouter } from 'next/navigation'
import {
    getChatDisplayName,
    getChatRecipient,
    getGroupChatMembers,
} from '../../utils/helpers'
import { OnlineStatus } from '../OnlineStatus'

type ChatPreviewProps = {
    user?: User
    chat: Chat | GroupChat
}
export const ChatPreview = ({ user, chat }: ChatPreviewProps) => {
    const router = useRouter()
    const isGroupChat = 'members' in chat
    const displayName = getChatDisplayName(chat, user)
    const chatUser = !isGroupChat && getChatRecipient(chat, user)

    /** Navigate to the appropriate chat on click dependant on type */
    const handleClick = () => {
        isGroupChat
            ? router.push(`/chats/group/${chat.id}`)
            : router.push(`/chats/${chat.id}`)
    }

    return (
        <SChatPreview tabIndex={0} onClick={handleClick}>
            {getImageOrInitials(chat, user)}
            <SContent>
                <SNameContainer>
                    <SName>{displayName}</SName>
                    {chatUser && <OnlineStatus userId={chatUser.id} />}
                </SNameContainer>
                <SMessage>
                    {chat.lastMessageSent
                        ? chat.lastMessageSent.messageContent.length > 30
                            ? `${chat.lastMessageSent.messageContent.slice(0, 30)}...`
                            : chat.lastMessageSent.messageContent
                        : `No messages yet`}
                </SMessage>
            </SContent>
        </SChatPreview>
    )
}

const getImageOrInitials = (chat: Chat | GroupChat, user?: User) => {
    if (!user) return
    if ('members' in chat) {
        return chat.coverImage ? (
            <Avatar imgSrc={`/images/${chat.coverImage}`} />
        ) : (
            <GroupUserInitials
                text={`${chat.name || getGroupChatMembers(chat)}`}
            />
        )
    } else {
        const chatUser =
            user.id === chat.creator.id ? chat.recipient : chat.creator
        return chatUser.avatar ? (
            <Avatar imgSrc={`/images/${chatUser.avatar}`} />
        ) : (
            <GroupUserInitials
                text={`${chatUser.firstName} ${chatUser.lastName}`}
            />
        )
    }
}

const SChatPreview = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    border-radius: 0.5rem;
    box-sizing: border-box;
    padding: 0.5rem;
    outline: none;
    transition: all 0.2s;
    &:is(:hover, :focus) {
        background: ${({ theme }) => theme.colors.blueWeak};
        cursor: pointer;
    }
`
const SContent = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 0.3rem 0;
    gap: 0.5rem;
    flex: 1;
`
const SNameContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`
const SName = styled.div`
    font-size: 1.05rem;
    font-weight: 500;
`
const SMessage = styled.div`
    font-size: 0.9rem;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.text.primary};
`
