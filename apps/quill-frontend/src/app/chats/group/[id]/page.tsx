'use client'

import { useState } from 'react'
import { ChatWindow } from '../../../components/chats/ChatWindow'
import { useGetGroupChatByIdQuery } from '../../../utils/store/groups'
import { SChatContainer } from '../../../utils/styles/shared'
import { useParams } from 'next/navigation'
import { ChatInfo } from '../../../components/chats/ChatInfo'

export default function GroupChatsPage() {
    const params = useParams()
    const { data, refetch } = useGetGroupChatByIdQuery(params.id as string)
    const [showInfo, setShowInfo] = useState(false)

    return (
        <>
            <SChatContainer>
                {data && (
                    <ChatWindow
                        chat={data}
                        onMessageSend={refetch}
                        onShowOptions={() => setShowInfo(!showInfo)}
                        optionsVisible={showInfo}
                    />
                )}
            </SChatContainer>
            <ChatInfo isVisible={showInfo} />
        </>
    )
}
