import styled from 'styled-components'
import { GroupChat, Chat } from '@quill/data'
import {
    GroupMessageReceivedEventParams,
    MessageReceivedEventParams,
} from '@quill/socket'
import { IoSearch, IoCall, IoPaperPlaneOutline, IoClose } from 'react-icons/io5'
import { LuChevronLeftSquare, LuChevronRightSquare } from 'react-icons/lu'
import toast, { Toaster } from 'react-hot-toast'
import { FiPaperclip } from 'react-icons/fi'
import { IconContext } from 'react-icons'
import { ChatBox } from './ChatBox'
import { getChatRecipient, getGroupChatMembers } from '../../utils/helpers'
import { SubmitHandler, useForm } from 'react-hook-form'
import { NoMessagesYet } from './NoMessagesYet'
import { useWebSocketEvents } from '../../utils/hooks'
import { useEffect } from 'react'
import { useAuth } from '../../contexts/auth'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../utils/store'
import { addMessageState } from '../../utils/store/chats'
import { createGroupMessage, createPrivateMessage } from '../../utils/api'
import { addGroupMessageState } from '../../utils/store/groups'
import { MenuActions } from '../../utils/types'

type ChatWindowProps = {
    chat: Chat | GroupChat
    /** Function that controls updating state on the chat menu actions (i.e. Search, Info panel) */
    onChatAction?: (action: MenuActions) => void
    optionsVisible?: boolean
}
type CreateMessageParams = {
    message?: string
    image?: FileList
}

export const ChatWindow = ({
    chat,
    onChatAction,
    optionsVisible,
}: ChatWindowProps) => {
    const { user } = useAuth()
    const dispatch = useDispatch<AppDispatch>()
    const {
        register,
        handleSubmit,
        reset: clearForm,
        watch,
    } = useForm<CreateMessageParams>()
    const isGroupChat = 'members' in chat
    const chatName = isGroupChat
        ? chat.name || getGroupChatMembers(chat)
        : `${getChatRecipient(chat, user).firstName} ${
              getChatRecipient(chat, user).lastName
          }`
    const { sendMessage, listenForMessage } = useWebSocketEvents()
    const imageMessage = watch('image') ? watch('image')?.item(0) : null

    useEffect(() => {
        const privateMessageEvent =
            listenForMessage<MessageReceivedEventParams>(
                'messageReceived',
                (data) => {
                    dispatch(
                        addMessageState({
                            chatId: data.chat.id,
                            message: data.message,
                        }),
                    )
                },
            )
        const groupMessageEvent =
            listenForMessage<GroupMessageReceivedEventParams>(
                'groupMessageReceived',
                (data) => {
                    dispatch(
                        addGroupMessageState({
                            groupId: data.chat.id,
                            message: data.message,
                        }),
                    )
                },
            )
        return () => {
            privateMessageEvent?.()
            groupMessageEvent?.()
        }
    }, [dispatch, listenForMessage])

    /** Provides a single method in which to dispatch websocket events related to Chats */
    const sendMessageToSocket = <T extends object>(event: string, data: T) => {
        sendMessage(event, data)
    }

    const onSubmit: SubmitHandler<CreateMessageParams> = ({
        image,
        message,
    }) => {
        if (!image && !message) {
            toast.error('Please enter a message or attach an image')
            return
        }

        const formData = new FormData()

        if (image && image.length) {
            const uploadedFile = image.item(0)
            uploadedFile && formData.append('image', uploadedFile)
        }
        if (message) formData.append('messageContent', message)

        isGroupChat
            ? createGroupMessage({
                  groupId: chat.id,
                  formData,
              }).then((resp) => {
                  if ('status' in resp) {
                      const errorMessage = resp?.message
                      toast.error(
                          errorMessage ||
                              'Unable to send message. An error occurred.',
                      )
                  } else {
                      dispatch(
                          addGroupMessageState({
                              groupId: chat.id,
                              message: resp.message,
                          }),
                      )
                      clearForm()
                      sendMessageToSocket('onGroupMessageCreation', {
                          message: resp.message,
                          chat,
                      })
                  }
              })
            : createPrivateMessage({
                  chatId: chat.id,
                  formData,
              }).then((resp) => {
                  if ('status' in resp) {
                      const errorMessage = resp?.message
                      toast.error(
                          errorMessage ||
                              'Unable to send message. An error occurred.',
                      )
                  } else {
                      dispatch(
                          addMessageState({
                              chatId: chat.id,
                              message: resp.message,
                          }),
                      )
                      clearForm()
                      sendMessageToSocket('onPrivateMessageCreation', {
                          message: resp.message,
                          chat,
                          recipientId: getChatRecipient(chat, user).id,
                      })
                  }
              })
    }
    return (
        <SChatWindow>
            <Toaster />
            <SChatHeader>
                <div className="chatInfo">
                    <h1>{chatName}</h1>
                    {isGroupChat ? (
                        <p>
                            {chat.members.length} members,{' '}
                            {
                                chat.members.filter(
                                    (member) =>
                                        member.onlineStatus === 'online',
                                ).length
                            }{' '}
                            online
                        </p>
                    ) : null}
                </div>
                <div className="chatIcons">
                    {onChatAction && (
                        <IconContext.Provider
                            value={{
                                className: 'optionIcons',
                                size: '1.5rem',
                            }}
                        >
                            <IoSearch onClick={() => onChatAction('search')} />
                            <IoCall />
                            {isGroupChat ? (
                                optionsVisible ? (
                                    <LuChevronRightSquare
                                        onClick={() => onChatAction('info')}
                                    />
                                ) : (
                                    <LuChevronLeftSquare
                                        onClick={() => onChatAction('info')}
                                    />
                                )
                            ) : null}
                        </IconContext.Provider>
                    )}
                </div>
            </SChatHeader>
            <SChatBody>
                {chat.messages && chat.messages.length > 0 ? (
                    chat.messages.map((message) => (
                        <ChatBox
                            key={message.id}
                            message={message}
                            isGroupChat={isGroupChat}
                            chatId={chat.id}
                        />
                    ))
                ) : (
                    <NoMessagesYet />
                )}
            </SChatBody>
            <SMessageInputWrapper
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
            >
                <IconContext.Provider
                    value={{ className: 'messageIcons', size: '1.6rem' }}
                >
                    <FiPaperclip
                        onClick={() =>
                            document.getElementById('fileInput')?.click()
                        }
                    />
                    <input
                        id="fileInput"
                        type="file"
                        {...register('image')}
                        accept=".jpg, .jpeg, .png"
                    />
                    {imageMessage && (
                        <SImageWrapper>
                            <SImagePreview
                                src={URL.createObjectURL(imageMessage)}
                                alt="Image Preview"
                            />
                            <RemoveImageIcon
                                className="removeImageIcon"
                                onClick={() => clearForm()}
                            />
                        </SImageWrapper>
                    )}
                    <input
                        className="messageInput"
                        placeholder={`Message ${chatName}`}
                        {...register('message')}
                    />
                    <button type="submit">
                        <IoPaperPlaneOutline />
                    </button>
                </IconContext.Provider>
            </SMessageInputWrapper>
        </SChatWindow>
    )
}
const SChatWindow = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    box-sizing: border-box;
`
const SChatHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    box-shadow: ${({ theme }) => `0 2px 2px ${theme.colors.shadow}`};
    margin-bottom: 2px;
    h1 {
        font-size: 1.5rem;
        font-weight: 500;
    }
    .chatInfo {
        display: flex;
        flex-direction: column;

        p {
            font-size: 0.9rem;
            color: ${({ theme }) => theme.colors.text.weak};
        }
    }
    .chatIcons {
        display: flex;
        gap: 1rem;
    }
    .optionIcons {
        cursor: pointer;
        color: ${({ theme }) => theme.colors.text.weak};
        transition: color 0.2s;
        &:hover {
            color: ${({ theme }) => theme.colors.blueStrong};
        }
    }
`
const SChatBody = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column-reverse;
    gap: 1rem;
    overflow-y: scroll;
    transition: all 0.2s;
    padding: 1rem 2rem;
`
const SMessageInputWrapper = styled.form`
    display: flex;
    align-items: center;
    gap: 1rem;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.colors.blueAccent};
    outline: ${({ theme }) => `1px solid ${theme.colors.blueAccent}`};
    color: ${({ theme }) => theme.colors.text.primary};
    padding: 0 1rem;
    transition: all 0.2s;
    margin: 1rem 2rem;

    .messageInput {
        flex: 1;
        outline: none;
        background: none;
        border: none;
        padding: 1.5rem 0;
        font-size: 1rem;
    }
    .messageIcons {
        size: 2rem;
        color: ${({ theme }) => theme.colors.blueStrong};
        cursor: pointer;

        transition: all 0.2s;
        &:hover {
            color: ${({ theme }) => theme.colors.orangeStrong};
        }
    }
    button {
        border: none;
        outline: none;
        background: none;
    }
    #fileInput {
        display: none;
    }

    &:is(:hover, :active, :focus-within) {
        outline: ${({ theme }) => `1px solid ${theme.colors.blueStrong}`};
        cursor: text;
    }
`
const RemoveImageIcon = styled(IoClose)`
    position: absolute;
    top: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.blueAccent};
    border-radius: 50%;
    opacity: 0;
    transition: all 0.2s;
`
const SImageWrapper = styled.div`
    position: relative;

    &:hover ${RemoveImageIcon} {
        font-size: 1.5rem;
        opacity: 1;
    }
`

const SImagePreview = styled.img`
    width: auto;
    height: 5rem;
    margin: 0.2rem;
    border: 1px solid ${({ theme }) => theme.colors.blueStrong};
    border-radius: 0.5rem;
    object-fit: cover;
    transition: all 0.2s;

    &:hover {
        cursor: pointer;
    }
`
