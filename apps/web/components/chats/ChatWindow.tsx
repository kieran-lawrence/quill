import styled from 'styled-components'
import { GroupChat, Chat, Gif } from '@repo/api'
import {
    GroupMessageReceivedEventParams,
    MessageReceivedEventParams,
} from '@repo/api'
import { IoSearch, IoCall, IoPaperPlaneOutline, IoClose } from 'react-icons/io5'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import toast, { Toaster } from 'react-hot-toast'
import { FiPaperclip } from 'react-icons/fi'
import { MdGif } from 'react-icons/md'
import { IconContext } from 'react-icons'
import { ChatBox } from './ChatBox'
import { getChatRecipient, getGroupChatMembers } from '../../utils/helpers'
import { SubmitHandler, useForm } from 'react-hook-form'
import { NoMessagesYet } from './NoMessagesYet'
import { useDebounce, useWebSocketEvents } from '../../utils/hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/auth'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../utils/store'
import { addMessageState } from '../../utils/store/chats'
import { createGroupMessage, createPrivateMessage } from '../../utils/api'
import { addGroupMessageState } from '../../utils/store/groups'
import { MenuActions } from '../../utils/types'
import { getTrendingGifs, searchGifs } from '../../utils/api/gif'
import { FaSearch } from 'react-icons/fa'

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
    const [showGifWindow, setShowGifWindow] = useState(false)
    const [gifs, setGifs] = useState<Gif[]>([])
    const gifWindowRef = useRef<HTMLDivElement>(null)
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
    const sendMessageToSocket = useCallback(
        <T extends object>(event: string, data: T) => {
            sendMessage(event, data)
        },
        [sendMessage],
    )

    const handleGifClick = useCallback(
        (gif: Gif) => {
            if (isGroupChat) {
                createGroupMessage({
                    groupId: chat.id,
                    formData: { messageContent: gif.images['downsized'].url },
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
                        setShowGifWindow(false)
                        sendMessageToSocket('onGroupMessageCreation', {
                            message: resp.message,
                            chat,
                        })
                    }
                })
            } else {
                createPrivateMessage({
                    chatId: chat.id,
                    formData: { messageContent: gif.images['downsized'].url },
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
                        setShowGifWindow(false)
                        sendMessageToSocket('onPrivateMessageCreation', {
                            message: resp.message,
                            chat,
                            recipientId: getChatRecipient(chat, user).id,
                        })
                    }
                })
            }
        },
        [chat, dispatch, isGroupChat, sendMessageToSocket, user],
    )

    const handleSearchGifs = useDebounce((query: string) => {
        if (!query || query.length < 2) return
        const fetchGifs = async () => {
            const gifs = await searchGifs(query)
            setGifs(gifs.data)
        }
        fetchGifs()
    }, 500)

    useEffect(() => {
        const fetchGifs = async () => {
            const gifs = await getTrendingGifs()
            setGifs(gifs.data)
        }
        fetchGifs()
    }, [])

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
            if (uploadedFile) {
                formData.append('image', uploadedFile)
            }
        }
        if (message) formData.append('messageContent', message)

        if (isGroupChat) {
            createGroupMessage({
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
        } else {
            createPrivateMessage({
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
    }

    // Close GIF window on outside click
    useEffect(() => {
        if (!showGifWindow) return
        const handleClick = (e: MouseEvent) => {
            if (
                gifWindowRef.current &&
                !gifWindowRef.current.contains(e.target as Node)
            ) {
                setShowGifWindow(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, [showGifWindow])

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
                                    <LuChevronRight
                                        onClick={() => onChatAction('info')}
                                    />
                                ) : (
                                    <LuChevronLeft
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
                {showGifWindow && (
                    <SGifWindow ref={gifWindowRef}>
                        <SGifSearchWrapper>
                            <IconContext.Provider
                                value={{
                                    className: 'messageIcons',
                                    size: '1.6rem',
                                }}
                            >
                                <SGifSearchInput
                                    onChange={(e) =>
                                        handleSearchGifs(e.target.value)
                                    }
                                    placeholder="Search GIPHY"
                                />
                            </IconContext.Provider>
                            <FaSearch />
                        </SGifSearchWrapper>
                        {gifs.map((gif) => (
                            <SGifSendButton
                                key={gif.id}
                                onClick={() => handleGifClick(gif)}
                            >
                                <SGif
                                    alt={gif.title}
                                    src={gif.images['downsized'].url}
                                />
                            </SGifSendButton>
                        ))}
                    </SGifWindow>
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
                    <MdGif
                        onClick={() => {
                            setShowGifWindow((prev) => !prev)
                        }}
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
    position: relative;
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

const SGifWindow = styled.div`
    position: absolute;
    bottom: 0;
    left: 2rem;
    width: fit-content;
    height: fit-content;
    border: 1px solid ${({ theme }) => theme.colors.blueStrong};
    background: #ffffff;
    border-radius: 0.5rem;
    box-shadow: ${({ theme }) => `0 4px 8px ${theme.colors.shadow}`};
    z-index: 1000;
    padding: 0.5rem;
    display: grid;
    grid-template-columns: repeat(3, 10rem);
    grid-template-rows: 2rem auto;
    height: 30rem;
    overflow-y: auto;
    gap: 0.3rem;

    .messageIcons {
        size: 2rem;
        color: ${({ theme }) => theme.colors.blueStrong};
        cursor: pointer;

        transition: all 0.2s;
        &:hover {
            color: ${({ theme }) => theme.colors.orangeStrong};
        }
    }
`
const SGifSearchWrapper = styled.div`
    display: flex;
    grid-column: 1 / span 3;
    align-items: center;
    gap: 0.5rem;
    background: ${({ theme }) => theme.colors.blueAccent};
    outline: ${({ theme }) => `1px solid ${theme.colors.blueAccent}`};
    color: ${({ theme }) => theme.colors.text.primary};
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
`
const SGifSearchInput = styled.input`
    flex: 1;
    border: none;
    background: none;
    outline: none;
    font-size: 1rem;
`
const SGifSendButton = styled.button`
    background: none;
    border: none;
`
const SGif = styled.img`
    aspect-ratio: 1 / 1;
    object-fit: cover;
    width: 100%;
`
