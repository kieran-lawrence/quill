'use client'

import { useState } from 'react'
import { ChatWindow } from '../../components/chats/ChatWindow'
import { useAppSelector } from '../../utils/store'
import { getChatById } from '../../utils/store/chats'
import { SChatContainer } from '../../utils/styles/shared'
import { useParams } from 'next/navigation'
import { SearchChat } from '../../components/chats/SearchChat'

export default function ChatsPage() {
    const { id } = useParams()
    const [showSearch, setShowSearch] = useState(false)
    const chat = useAppSelector((state) =>
        getChatById(state.chats, parseInt(id as string)),
    )

    return (
        <>
            <SChatContainer>
                {chat && (
                    <ChatWindow
                        chat={chat}
                        onChatAction={() => setShowSearch(!showSearch)}
                    />
                )}
            </SChatContainer>
            {chat && (
                <SearchChat
                    isVisible={showSearch}
                    chatId={chat.id}
                    isGroupChat={false}
                />
            )}
        </>
    )
}
