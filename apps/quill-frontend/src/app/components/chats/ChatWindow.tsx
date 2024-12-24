import styled from 'styled-components'
import { GroupChat, Chat } from '@quill/data'
import {
    GroupMessageReceivedEventParams,
    MessageReceivedEventParams,
} from '@quill/socket'
import { IoSearch, IoCall, IoPaperPlaneOutline } from 'react-icons/io5'
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

type ChatWindowProps = {
    chat: Chat | GroupChat
    onShowOptions?: () => void
    optionsVisible?: boolean
}
type CreateMessageParams = {
    message?: string
    image?: FileList
}

export const ChatWindow = ({
    chat,
    onShowOptions,
    optionsVisible,
}: ChatWindowProps) => {
    const { user } = useAuth()
    const dispatch = useDispatch<AppDispatch>()
    const {
        register,
        handleSubmit,
        reset: clearForm,
    } = useForm<CreateMessageParams>()
    const isGroupChat = 'members' in chat
    const chatName = isGroupChat
        ? chat.name || getGroupChatMembers(chat)
        : `${getChatRecipient(chat, user).firstName} ${
              getChatRecipient(chat, user).lastName
          }`
    const { sendMessage, listenForMessage } = useWebSocketEvents()

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
                    <IconContext.Provider
                        value={{
                            className: 'optionIcons',
                            size: '1.5rem',
                        }}
                    >
                        <IoSearch />
                        <IoCall />
                        {isGroupChat ? (
                            optionsVisible ? (
                                <LuChevronRightSquare onClick={onShowOptions} />
                            ) : (
                                <LuChevronLeftSquare onClick={onShowOptions} />
                            )
                        ) : null}
                    </IconContext.Provider>
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
    padding: 1rem 2rem;
    box-sizing: border-box;
    gap: 1rem;
`
const SChatHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
        font-size: 2rem;
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
