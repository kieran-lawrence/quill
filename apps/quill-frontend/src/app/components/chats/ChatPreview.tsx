import styled from 'styled-components'
import { Chat, User } from '../../utils/types'
import { Avatar } from '../Avatar'
import { GroupUserInitials } from '../GroupUserInitials'

type ChatPreviewProps = {
    user: User
    chat: Chat
    showUsernames?: boolean
    onClick: () => void
}
export const ChatPreview = ({
    user,
    chat,
    showUsernames,
    onClick,
}: ChatPreviewProps) => {
    const displayName = showUsernames
        ? user.username
        : `${user.firstName} ${user.lastName}`
    return (
        <SChatPreview tabIndex={0} onClick={onClick}>
            {user.avatar !== null ? (
                <Avatar imgSrc={`/images/${user.avatar}`} />
            ) : (
                <GroupUserInitials text={displayName} />
            )}
            <SContent>
                <SName>{displayName}</SName>
                <SMessage>
                    {chat.lastMessageSent
                        ? `${chat.lastMessageSent.messageContent.slice(
                              0,
                              30,
                          )}...`
                        : `No messages yet`}
                </SMessage>
            </SContent>
        </SChatPreview>
    )
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
        background: #f4e7d8;
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
const SName = styled.div`
    font-size: 1.1rem;
    font-weight: 500;
`
const SMessage = styled.div`
    font-size: 0.9rem;
    font-weight: 400;
    color: #5c5c5c;
`
