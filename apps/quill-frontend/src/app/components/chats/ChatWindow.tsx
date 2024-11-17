import styled from 'styled-components'
import { Chat, GroupChat } from '../../utils/types'
import { IoSearch, IoCall, IoEllipsisVertical } from 'react-icons/io5'
import { IconContext } from 'react-icons'
import { ChatBox } from './ChatBox'
import { getGroupChatMembers } from '../../utils/helpers'

type ChatWindowProps = {
    chat: Chat | GroupChat
}
export const ChatWindow = ({ chat }: ChatWindowProps) => {
    return (
        <SChatWindow>
            <SChatHeader>
                <h1>
                    {'recipient' in chat
                        ? `${chat.recipient.firstName} ${chat.recipient.lastName}`
                        : chat.name || getGroupChatMembers(chat)}
                </h1>
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
                    <>No messages :-(</>
                )}
            </SChatBody>
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
`
