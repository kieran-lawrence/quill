import styled from 'styled-components'
import { GroupMessage, PrivateMessage } from '@quill/data'
import { useAuth } from '../../contexts/auth'
import { Avatar } from '../Avatar'
import { GroupUserInitials } from '../GroupUserInitials'
import { useState, KeyboardEvent, useEffect } from 'react'
import { ContextMenu } from '../menu/ContextMenu'
import { copyToClipboard } from '../../utils/helpers'
import {
    deleteGroupMessage,
    deletePrivateMessage,
    editPrivateMessage,
    updateGroupMessage,
} from '../../utils/api'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../utils/store'
import {
    deleteGroupMessageState,
    updateGroupMessageState,
} from '../../utils/store/groups'
import {
    deletePrivateMessageState,
    updatePrivateMessageState,
} from '../../utils/store/chats'
import { useWebSocketEvents } from '../../utils/hooks'
import {
    EditGroupMessageEventParams,
    EditPrivateMessageEventParams,
} from '@quill/socket'

type ChatBoxProps = {
    message: PrivateMessage | GroupMessage
    isGroupChat: boolean
    chatId: number
}
export const ChatBox = ({ message, isGroupChat, chatId }: ChatBoxProps) => {
    const { user } = useAuth()
    const isAuthor = user?.id === message.author.id
    const { sendMessage, listenForMessage } = useWebSocketEvents()

    const [showContextMenu, setShowContextMenu] = useState(false)
    const [points, setPoints] = useState({ x: 0, y: 0 })
    const [isEditing, setIsEditing] = useState(false)
    const [messageContent, setMessageContent] = useState(message.messageContent)
    const dispatch = useDispatch<AppDispatch>()

    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        setShowContextMenu(true)
        setPoints({ x: e.clientX, y: e.clientY })
    }
    const copyText = () => {
        copyToClipboard(message.messageContent).then(() =>
            setShowContextMenu(false),
        )
    }

    useEffect(() => {
        const privateMessageUpdatedEvent =
            listenForMessage<EditPrivateMessageEventParams>(
                'messageUpdated',
                ({ chatId, message }) => {
                    dispatch(
                        updatePrivateMessageState({
                            chatId,
                            message,
                        }),
                    )
                },
            )
        const groupMessageUpdatedEvent =
            listenForMessage<EditGroupMessageEventParams>(
                'groupMessageUpdated',
                ({ groupId, message }) => {
                    dispatch(
                        updateGroupMessageState({
                            groupId,
                            message,
                        }),
                    )
                },
            )
        return () => {
            privateMessageUpdatedEvent?.()
            groupMessageUpdatedEvent?.()
        }
    }, [dispatch, listenForMessage])

    const editMessage = () => {
        if (isGroupChat) {
            updateGroupMessage({
                groupId: chatId,
                messageId: message.id,
                messageContent,
            }).then((resp) => {
                if ('status' in resp) {
                    const errorMessage = resp?.message
                    toast.error(
                        errorMessage ||
                            'An error occurred updating this message.',
                    )
                } else {
                    setIsEditing(false)
                    dispatch(
                        updateGroupMessageState({
                            groupId: chatId,
                            message: resp.message,
                        }),
                    )
                    sendMessage('onGroupMessageUpdate', {
                        groupId: chatId,
                        message: resp.message,
                    })
                }
            })
        } else {
            editPrivateMessage({
                chatId,
                messageId: message.id,
                messageContent,
            }).then((resp) => {
                if ('status' in resp) {
                    const errorMessage = resp?.message
                    toast.error(
                        errorMessage ||
                            'An error occurred updating this message.',
                    )
                } else {
                    setIsEditing(false)
                    dispatch(
                        updatePrivateMessageState({
                            chatId,
                            message: resp.message,
                        }),
                    )
                    sendMessage('onPrivateMessageUpdate', {
                        chatId,
                        message: resp.message,
                    })
                }
            })
        }
    }

    const deleteMessage = () => {
        isGroupChat
            ? deleteGroupMessage({
                  groupId: chatId,
                  messageId: message.id,
              }).then((resp) => {
                  if ('status' in resp) {
                      const errorMessage = resp?.message
                      toast.error(
                          errorMessage ||
                              'An error occurred deleting this message.',
                      )
                  } else {
                      setShowContextMenu(false)
                      dispatch(
                          deleteGroupMessageState({
                              groupId: chatId,
                              messageId: message.id,
                          }),
                      )
                  }
              })
            : deletePrivateMessage({ chatId, messageId: message.id }).then(
                  (resp) => {
                      if ('status' in resp) {
                          const errorMessage = resp?.message
                          toast.error(
                              errorMessage ||
                                  'An error occurred deleting this message.',
                          )
                      } else {
                          setShowContextMenu(false)
                          dispatch(
                              deletePrivateMessageState({
                                  chatId,
                                  messageId: message.id,
                              }),
                          )
                      }
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
            <Toaster />
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
