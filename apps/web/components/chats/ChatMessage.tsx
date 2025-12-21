import { PrivateMessage, GroupMessage } from '@repo/api'
import { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { isGif, isImage } from '../../utils/helpers'
import { Avatar } from '../Avatar'
import { GroupUserInitials } from '../GroupUserInitials'
import { format } from 'date-fns'

type Props = {
    message: GroupMessage | PrivateMessage
    isAuthor: boolean
    isEditing: boolean
    setIsEditing?: (value: boolean) => void
    onKeyUp?: (e: React.KeyboardEvent<HTMLDivElement>) => void
    onEditMessage?: () => void
    onImageClick?: (val: boolean) => void
    onContextMenu?: (e: React.MouseEvent) => void
}
export const ChatMessage = ({
    message,
    isAuthor,
    isEditing,
    setIsEditing,
    onKeyUp,
    onEditMessage,
    onImageClick,
    onContextMenu,
    children,
}: PropsWithChildren<Props>) => {
    return (
        <>
            {message.author.avatar !== null ? (
                <Avatar imgSrc={`/images/${message.author.avatar}`} />
            ) : (
                <GroupUserInitials
                    text={`${message.author?.firstName} ${message.author?.lastName}`}
                />
            )}
            <SChat $isAuthor={isAuthor} onContextMenu={onContextMenu}>
                {children}
                {!isAuthor && (
                    <h3>{`${message.author.firstName} ${message.author.lastName}`}</h3>
                )}
                {isEditing ? (
                    <>
                        <div
                            className="editBox"
                            role="textbox"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onKeyUp={(e) => onKeyUp && onKeyUp(e)}
                        >
                            {message.messageContent}
                        </div>
                        <small className="editActions">
                            escape to{' '}
                            <a
                                role="button"
                                onClick={() =>
                                    setIsEditing && setIsEditing(false)
                                }
                            >
                                cancel
                            </a>{' '}
                            • enter to{' '}
                            <a role="button" onClick={onEditMessage}>
                                save
                            </a>
                        </small>
                    </>
                ) : isImage(message.messageContent) ? (
                    <SChatImage
                        src={`/images/${message.messageContent}`}
                        alt={`Image from: ${message.author.firstName}`}
                        onClick={() => onImageClick && onImageClick(true)}
                    />
                ) : isGif(message.messageContent) ? (
                    <SChatImage
                        src={message.messageContent}
                        alt={`GIF from: ${message.author.firstName}`}
                        onClick={() => onImageClick && onImageClick(true)}
                    />
                ) : (
                    <SChatMessageContainer>
                        <p>{message.messageContent}</p>
                        <SChatMessageInfo>
                            {format(message.createdAt, 'hh:m')}
                        </SChatMessageInfo>
                    </SChatMessageContainer>
                )}
            </SChat>
        </>
    )
}

const SChat = styled.div<{ $isAuthor: boolean }>`
    background: ${({ $isAuthor, theme }) =>
        $isAuthor ? theme.colors.blueStrong : theme.colors.blueWeak};
    color: ${({ $isAuthor, theme }) =>
        $isAuthor ? theme.colors.text.light : theme.colors.text.primary};
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 0.5rem;

    h3 {
        font-size: 1.1rem;
        font-weight: 500;
        color: ${({ theme }) => theme.colors.text.accent};
    }
    .editBox {
        border: none;
        outline: none;
        padding: 1rem;
        border-radius: 0.5rem;
        background: ${({ theme }) => theme.colors.text.accent};
    }
    .editActions {
        padding-left: 0.5rem;
        font-size: 0.8rem;

        a {
            color: ${({ theme }) => theme.colors.text.accent};
            text-decoration: none;
            cursor: pointer;
        }
    }
`
const SChatImage = styled.img`
    border-radius: 0.5rem;
    height: 15rem;
    width: auto;
    object-fit: cover;
    cursor: pointer;
`

const SChatMessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
`
const SChatMessageInfo = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
`
