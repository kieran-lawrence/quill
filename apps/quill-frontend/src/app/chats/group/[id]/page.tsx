'use client'

import { useEffect, useState } from 'react'
import { ChatWindow } from '../../../components/chats/ChatWindow'
import { SChatContainer } from '../../../utils/styles/shared'
import { useParams, usePathname } from 'next/navigation'
import { ChatInfo } from '../../../components/chats/ChatInfo'
import { useAppSelector } from '../../../utils/store'
import { getGroupById } from '../../../utils/store/groups'
import { useWebSocketEvents } from '../../../utils/hooks'

export default function GroupChatsPage() {
    const { id } = useParams()
    const pathname = usePathname()
    const group = useAppSelector((state) =>
        getGroupById(state.groups, parseInt(id as string)),
    )
    const [showInfo, setShowInfo] = useState(false)
    const { sendMessage } = useWebSocketEvents()

    useEffect(() => {
        sendMessage('onGroupChatJoin', { groupId: id })

        // Handle browser/tab close
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            sendMessage('onGroupChatLeave', { groupId: id })
        }
        // Add event listeners
        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            sendMessage('onGroupChatLeave', { groupId: id })
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [sendMessage, id, pathname])

    return (
        <>
            <SChatContainer>
                {group && (
                    <ChatWindow
                        chat={group}
                        onShowOptions={() => setShowInfo(!showInfo)}
                        optionsVisible={showInfo}
                    />
                )}
            </SChatContainer>
            {group && <ChatInfo isVisible={showInfo} chat={group} />}
        </>
    )
}
