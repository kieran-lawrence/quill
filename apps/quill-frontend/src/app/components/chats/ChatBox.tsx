import styled from 'styled-components'
import { GroupMessage, PrivateMessage } from '@quill/data'
import { useAuth } from '../../contexts/auth'
import { useState, KeyboardEvent, useEffect } from 'react'
import { ContextMenu } from '../menu/ContextMenu'
import { copyToClipboard, isImage } from '../../utils/helpers'
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
    DeleteGroupMessageEventParams,
    DeletePrivateMessageEventParams,
    EditGroupMessageEventParams,
    EditPrivateMessageEventParams,
    SocketEvent,
} from '@quill/socket'
import { FullscreenImage } from './FullScreenImage'
import { ChatMessage } from './ChatMessage'

type ChatBoxProps = {
    message: PrivateMessage | GroupMessage
    isGroupChat: boolean
    chatId: number
}

/** This type represents the different socket events that can be produced by this component */
type ChatSocketEvents = {
    messageUpdated: {
        private: SocketEvent<EditPrivateMessageEventParams>
        group: SocketEvent<EditGroupMessageEventParams>
    }
    messageDeleted: {
        private: SocketEvent<DeletePrivateMessageEventParams>
        group: SocketEvent<DeleteGroupMessageEventParams>
    }
}

export const ChatBox = ({ message, isGroupChat, chatId }: ChatBoxProps) => {
    const { user } = useAuth()
    const isAuthor = user?.id === message.author.id
    const { sendMessage, listenForMessage } = useWebSocketEvents()
    const [showImageModal, setShowImageModal] = useState(false)
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
        const events: ChatSocketEvents = {
            messageUpdated: {
                private: {
                    event: 'messageUpdated',
                    stateAction: updatePrivateMessageState,
                    paramMap: (params: EditPrivateMessageEventParams) => ({
                        chatId: params.chatId,
                        message: params.message,
                    }),
                },
                group: {
                    event: 'groupMessageUpdated',
                    stateAction: updateGroupMessageState,
                    paramMap: (params: EditGroupMessageEventParams) => ({
                        groupId: params.groupId,
                        message: params.message,
                    }),
                },
            },
            messageDeleted: {
                private: {
                    event: 'messageDeleted',
                    stateAction: deletePrivateMessageState,
                    paramMap: (params: DeletePrivateMessageEventParams) => ({
                        chatId: params.chatId,
                        messageId: params.messageId,
                    }),
                },
                group: {
                    event: 'groupMessageDeleted',
                    stateAction: deleteGroupMessageState,
                    paramMap: (params: DeleteGroupMessageEventParams) => ({
                        groupId: params.groupId,
                        messageId: params.messageId,
                    }),
                },
            },
        }

        const cleanupFunctions = Object.values(events).flatMap((category) =>
            Object.values(category).map((eventType) =>
                listenForMessage(eventType.event, (params) => {
                    dispatch(eventType.action(eventType.paramMap(params)))
                }),
            ),
        )

        return () => {
            cleanupFunctions.forEach((cleanup) => cleanup?.())
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
                      sendMessage('onGroupMessageDeletion', {
                          groupId: chatId,
                          messageId: message.id,
                      })
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
                          sendMessage('onPrivateMessageDeletion', {
                              chatId,
                              messageId: message.id,
                          })
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
            {showImageModal && (
                <FullscreenImage
                    imagePath={message.messageContent}
                    onClose={() => setShowImageModal(false)}
                />
            )}
            <ChatMessage
                message={message}
                isAuthor={isAuthor}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                onKeyUp={handleKeyPress}
                onEditMessage={editMessage}
                onImageClick={setShowImageModal}
                onContextMenu={onContextMenu}
            >
                {showContextMenu && (
                    <ContextMenu
                        points={points}
                        width={5}
                        handleClose={() => setShowContextMenu(false)}
                    >
                        <ul>
                            {isAuthor && !isImage(message.messageContent) && (
                                <li onClick={() => setIsEditing(true)}>Edit</li>
                            )}
                            {isAuthor && (
                                <li onClick={deleteMessage}>Delete</li>
                            )}
                            {!isImage(message.messageContent) && (
                                <li onClick={copyText}>Copy Text</li>
                            )}
                        </ul>
                    </ContextMenu>
                )}
            </ChatMessage>
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
