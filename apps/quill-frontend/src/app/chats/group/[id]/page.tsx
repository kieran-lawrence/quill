'use client'

import { useEffect, useState } from 'react'
import { ChatWindow } from '../../../components/chats/ChatWindow'
import { SChatContainer } from '../../../utils/styles/shared'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { ChatInfo } from '../../../components/chats/ChatInfo'
import { AppDispatch, useAppSelector } from '../../../utils/store'
import {
    deleteGroupState,
    getGroupById,
    updateGroupState,
} from '../../../utils/store/groups'
import { useWebSocketEvents } from '../../../utils/hooks'
import { useDispatch } from 'react-redux'
import { GroupChat } from '@quill/data'
import { MenuActions } from '../../../utils/types'
import { SearchChat } from '../../../components/chats/SearchChat'

export default function GroupChatsPage() {
    const { id } = useParams()
    const pathname = usePathname()
    const router = useRouter()
    const group = useAppSelector((state) =>
        getGroupById(state.groups, parseInt(id as string)),
    )
    const [showInfo, setShowInfo] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const { sendMessage, listenForMessage } = useWebSocketEvents()
    const dispatch = useDispatch<AppDispatch>()

    /** Search and Info panes use the same space, so we need to close one before opening the other */
    const handleMenuActions = (action: MenuActions) => {
        switch (action) {
            case 'search':
                if (showInfo) {
                    setShowInfo(false)
                    setShowSearch(true)
                } else {
                    setShowSearch(!showSearch)
                }
                break
            case 'info':
                if (showSearch) {
                    setShowSearch(false)
                    setShowInfo(true)
                } else {
                    setShowInfo(!showInfo)
                }
                break
        }
    }
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

    useEffect(() => {
        const groupUpdateListener = listenForMessage<GroupChat>(
            'groupChatUpdated',
            (group) => {
                if (!group) return
                dispatch(updateGroupState(group))
            },
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const groupDeletedListener = listenForMessage<any>(
            'groupChatDeleted',
            (groupId) => {
                if (!groupId) return
                dispatch(deleteGroupState(groupId))
                router.replace('/chats')
            },
        )
        return () => {
            if (groupUpdateListener) groupUpdateListener()
            if (groupDeletedListener) groupDeletedListener()
        }
    }, [listenForMessage, dispatch, router])

    return (
        <>
            <SChatContainer>
                {group && (
                    <ChatWindow
                        chat={group}
                        onChatAction={handleMenuActions}
                        optionsVisible={showInfo}
                    />
                )}
            </SChatContainer>
            {group && <ChatInfo isVisible={showInfo} chat={group} />}
            {group && <SearchChat isVisible={showSearch} chat={group} />}
        </>
    )
}
