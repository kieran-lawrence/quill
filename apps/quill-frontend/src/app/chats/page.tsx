'use client'
import styled from 'styled-components'
import { useGetChatsQuery } from '../utils/store/chats'
import { IoSearch } from 'react-icons/io5'
import { Chat } from '../utils/types'
import { ChatPreview } from '../components/chats/ChatPreview'
import { ChatWindow } from '../components/chats/ChatWindow'
import { useState } from 'react'
import { useAuth } from '../contexts/auth'

export default function ChatsPage() {
    const { data: chats } = useGetChatsQuery()
    const [currentChat, setCurrentChat] = useState<Chat | undefined>()
    const { user } = useAuth()
    return (
        chats && (
            <SChatPage>
                <SChatOverview>
                    <SSearchInput>
                        <IoSearch size={26} />
                        <input placeholder="Search" tabIndex={0} />
                    </SSearchInput>
                    {chats &&
                        chats.map((chat: Chat) => (
                            <ChatPreview
                                key={chat.id}
                                chat={chat}
                                user={
                                    user?.id === chat.creator.id
                                        ? chat.recipient
                                        : chat.creator
                                }
                                onClick={() => setCurrentChat(chat)}
                            />
                        ))}
                </SChatOverview>
                {currentChat && <ChatWindow chat={currentChat} />}
            </SChatPage>
        )
    )
}
const SChatPage = styled.div`
    display: flex;
    height: 100%;
    flex: 1;
    background: #f2f2f2;
    border-radius: 0.5rem;
`
const SChatOverview = styled.div`
    display: flex;
    flex-direction: column;
    width: 20vw;
    border-radius: 0.5rem;
    box-sizing: border-box;
    padding: 1.5rem 1rem;
    gap: 0.2rem;
`
const SSearchInput = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    background: #f4e7d8;
    border-radius: 0.5rem;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
    outline: 1px solid #f4e7d8;
    transition: all 0.2s;
    input {
        border: none;
        background: none;
        outline: none;
        font-size: 1.1rem;
        flex: 1;
        box-sizing: border-box;
    }

    &:is(:hover, :active, :focus-within) {
        background: #f4e7d8;
        outline: 1px solid #ff971f;
        cursor: text;
    }
`
