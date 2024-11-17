import styled from 'styled-components'
import { Chat, GroupChat } from '../../utils/types'
import {
    IoSearch,
    IoCall,
    IoEllipsisVertical,
    IoPaperPlaneOutline,
} from 'react-icons/io5'
import { FiPaperclip } from 'react-icons/fi'
import { IconContext } from 'react-icons'
import { ChatBox } from './ChatBox'
import { getGroupChatMembers } from '../../utils/helpers'
import { SubmitHandler, useForm } from 'react-hook-form'
import { usePostCreatePrivateMessageMutation } from '../../utils/store/chats'
import { usePostCreateGroupMessageMutation } from '../../utils/store/groups'

type ChatWindowProps = {
    chat: Chat | GroupChat
    onMessageSend: () => void
}
type CreateMessageParams = {
    message: string
}
export const ChatWindow = ({ chat, onMessageSend }: ChatWindowProps) => {
    const { register, handleSubmit, reset } = useForm<CreateMessageParams>()
    const [createMessage, { error }] = usePostCreatePrivateMessageMutation()
    const [createGroupMessage, { error: groupError }] =
        usePostCreateGroupMessageMutation()
    const isGroupChat = 'members' in chat
    const chatName = isGroupChat
        ? chat.name || getGroupChatMembers(chat)
        : `${chat.recipient.firstName} ${chat.recipient.lastName}`

    const onSubmit: SubmitHandler<CreateMessageParams> = (data) => {
        isGroupChat
            ? createGroupMessage({
                  groupId: chat.id,
                  messageContent: data.message,
              }).then(() => {
                  onMessageSend()
                  reset()
              })
            : createMessage({
                  chatId: chat.id,
                  messageContent: data.message,
              }).then(() => {
                  onMessageSend()
                  reset()
              })
    }
    return (
        <SChatWindow>
            <SChatHeader>
                <h1>{chatName}</h1>
                <div className="chatIcons">
                    <IconContext.Provider
                        value={{ color: '#1c1c1c8d', size: '1.6rem' }}
                    >
                        <IoSearch />
                        <IoCall />
                        <IoEllipsisVertical />
                    </IconContext.Provider>
                </div>
            </SChatHeader>
            <SChatBody>
                {chat.messages && chat.messages.length > 0 ? (
                    chat.messages.map((message) => (
                        <ChatBox key={message.id} message={message} />
                    ))
                ) : (
                    <>No messages yet</>
                )}
            </SChatBody>
            <SMessageInputWrapper onSubmit={handleSubmit(onSubmit)}>
                <IconContext.Provider
                    value={{ className: 'messageIcons', size: '1.6rem' }}
                >
                    <FiPaperclip />
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
    .chatIcons {
        display: flex;
        gap: 1rem;
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
    background: #f4e7d8;
    outline: 1px solid #f4e7d8;
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
        color: #562e00;
        cursor: pointer;
    }
    button {
        border: none;
        outline: none;
        background: none;
    }

    &:is(:hover, :active, :focus-within) {
        outline: 1px solid #ff971f;
        cursor: text;
    }
`
