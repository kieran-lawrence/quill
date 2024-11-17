'use client'

import { ChatWindow } from '../../components/chats/ChatWindow'
import { useGetChatByIdQuery } from '../../utils/store/chats'
import { SChatContainer } from '../../utils/styles/shared'
import { useParams } from 'next/navigation'

export default function ChatsPage() {
    const params = useParams()
    const { data, refetch } = useGetChatByIdQuery(params.id as string)

    return (
        <SChatContainer>
            {data && <ChatWindow chat={data} onMessageSend={refetch} />}
        </SChatContainer>
    )
}
