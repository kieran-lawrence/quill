'use client'

import { ChatWindow } from '../../../components/chats/ChatWindow'
import { useGetGroupChatByIdQuery } from '../../../utils/store/groups'
import { SChatContainer } from '../../../utils/styles/shared'
import { useParams } from 'next/navigation'

export default function GroupChatsPage() {
    const params = useParams()
    const { data } = useGetGroupChatByIdQuery(params.id as string)

    return <SChatContainer>{data && <ChatWindow chat={data} />}</SChatContainer>
}
