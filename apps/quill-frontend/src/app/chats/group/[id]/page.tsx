'use client'

import { useState } from 'react'
import { ChatWindow } from '../../../components/chats/ChatWindow'
import { SChatContainer } from '../../../utils/styles/shared'
import { useParams } from 'next/navigation'
import { ChatInfo } from '../../../components/chats/ChatInfo'
import { useAppSelector } from '../../../utils/store'
import { getGroupById } from '../../../utils/store/groups'

export default function GroupChatsPage() {
    const { id } = useParams()
    const group = useAppSelector((state) =>
        getGroupById(state.groups, parseInt(id as string)),
    )
    const [showInfo, setShowInfo] = useState(false)

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
