'use client'

import { ChatWindow } from '../../components/chats/ChatWindow'
import { useAppSelector } from '../../utils/store'
import { getChatById } from '../../utils/store/chats'
import { SChatContainer } from '../../utils/styles/shared'
import { useParams } from 'next/navigation'

export default function ChatsPage() {
    const { id } = useParams()
    const chat = useAppSelector((state) =>
        getChatById(state.chats, parseInt(id as string)),
    )

    return <SChatContainer>{chat && <ChatWindow chat={chat} />}</SChatContainer>
}
