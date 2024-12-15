import styled from 'styled-components'
import { GroupMessage, PrivateMessage } from '../../utils/types'
import { useAuth } from '../../contexts/auth'
import { Avatar } from '../Avatar'
import { GroupUserInitials } from '../GroupUserInitials'
import { useState, KeyboardEvent } from 'react'
import { ContextMenu } from '../menu/ContextMenu'
import { copyToClipboard } from '../../utils/helpers'
import {
    usePostDeleteGroupMessageMutation,
    usePostEditGroupMessageMutation,
} from '../../utils/store/groups'
import {
    usePostEditPrivateMessageMutation,
    usePostDeletePrivateMessageMutation,
} from '../../utils/store/chats'

type ChatBoxProps = {
    message: PrivateMessage | GroupMessage
    isGroupChat: boolean
    chatId: number
    onMessageUpdate: () => void
}
export const ChatBox = ({
    message,
    isGroupChat,
    chatId,
    onMessageUpdate,
}: ChatBoxProps) => {
    const { user } = useAuth()
    const isAuthor = user?.id === message.author.id

    const [showContextMenu, setShowContextMenu] = useState(false)
    const [points, setPoints] = useState({ x: 0, y: 0 })
    const [isEditing, setIsEditing] = useState(false)
    const [messageContent, setMessageContent] = useState(message.messageContent)
    const [editGroupMessage] = usePostEditGroupMessageMutation()
    const [deleteGroupMessage] = usePostDeleteGroupMessageMutation()
    const [editPrivateMessage] = usePostEditPrivateMessageMutation()
    const [deletePrivateMessage] = usePostDeletePrivateMessageMutation()

    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        setShowContextMenu(true)
        setPoints({ x: e.clientX, y: e.clientY })
    }
    const copyText = () => {
        copyToClipboard(message.messageContent, () => setShowContextMenu(false))
    }
    const editMessage = () => {
        if (isGroupChat) {
            editGroupMessage({ groupId: 1, messageId: 1, messageContent }).then(
                () => {
                    setIsEditing(false)
                    onMessageUpdate()
                },
            )
        } else {
            editPrivateMessage({
                chatId,
                messageId: message.id,
                messageContent,
            }).then(() => {
                setIsEditing(false)
                onMessageUpdate()
            })
        }
    }

    const deleteMessage = () => {
        isGroupChat
            ? deleteGroupMessage({
                  groupId: chatId,
                  messageId: message.id,
              }).then(() => {
                  setShowContextMenu(false)
                  onMessageUpdate()
              })
            : deletePrivateMessage({ chatId, messageId: message.id }).then(
                  () => {
                      setShowContextMenu(false)
                      onMessageUpdate()
                  },
              )
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
        setMessageContent(e.currentTarget.innerText)
        if (e.key === 'Escape') {
            setIsEditing(false)
        } else if (e.key === 'Enter') {
            e.preventDefault()
            editMessage()
        }
    }

    return (
        <SChatBox $isAuthor={isAuthor}>
            {message.author.avatar !== null ? (
                <Avatar imgSrc={`/images/${message.author.avatar}`} />
            ) : (
                <GroupUserInitials
                    text={`${message.author?.firstName} ${message.author?.lastName}`}
                />
            )}
            <SChat $isAuthor={isAuthor} onContextMenu={onContextMenu}>
                {showContextMenu && (
                    <ContextMenu
                        points={points}
                        width={5}
                        handleClose={() => setShowContextMenu(false)}
                    >
                        <ul>
                            {isAuthor && (
                                <li onClick={() => setIsEditing(true)}>Edit</li>
                            )}
                            {isAuthor && (
                                <li onClick={deleteMessage}>Delete</li>
                            )}
                            <li onClick={copyText}>Copy Text</li>
                        </ul>
                    </ContextMenu>
                )}
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
                            onKeyUp={(e) => handleKeyPress(e)}
                        >
                            {message.messageContent}
                        </div>
                        <small className="editActions">
                            escape to{' '}
                            <a
                                role="button"
                                onClick={() => setIsEditing(false)}
                            >
                                cancel
                            </a>{' '}
                            • enter to{' '}
                            <a role="button" onClick={editMessage}>
                                save
                            </a>
                        </small>
                    </>
                ) : (
                    <div>{message.messageContent}</div>
                )}
            </SChat>
        </SChatBox>
    )
}
const SChatBox = styled.address<{ $isAuthor: boolean }>`
    display: flex;
    align-items: flex-end;
    flex-direction: ${({ $isAuthor }) => ($isAuthor ? 'row-reverse' : 'row')};
    align-self: ${({ $isAuthor }) => ($isAuthor ? 'flex-end' : 'flex-start')};
    gap: 0.5rem;
    width: fit-content;
    max-width: 55%;
    font-style: normal;
`
const SChat = styled.div<{ $isAuthor: boolean }>`
    background: ${({ $isAuthor }) => ($isAuthor ? '#ff971f' : '#f4e7d8')};
    color: ${({ $isAuthor }) => ($isAuthor ? '#f6f6f6' : '#1e1e1e')};
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
        color: #562e00;
    }
    .editBox {
        border: none;
        outline: none;
        padding: 1rem;
        border-radius: 0.5rem;
        background: ${({ $isAuthor }) => ($isAuthor ? '#cf7b1a' : '#cfc3b6')};
    }
    .editActions {
        padding-left: 0.5rem;
        font-size: 0.8rem;

        a {
            color: #6a5742;
            text-decoration: none;
            cursor: pointer;
        }
    }
`
