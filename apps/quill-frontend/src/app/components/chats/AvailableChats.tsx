'use client'

import styled from 'styled-components'
import { useAuth } from '../../contexts/auth'
import { useEffect, useState } from 'react'
import { CreateChatModal } from './CreateChatModal'
import { IoAdd, IoSearch } from 'react-icons/io5'
import { ChatPreview } from './ChatPreview'
import { Chat, GroupChat } from '@quill/data'
import { getChats, getGroups } from '../../utils/api'
import { AppDispatch, useAppSelector } from '../../utils/store'
import { setChatState } from '../../utils/store/chats'
import { useDispatch } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast'
import { setGroupsState } from '../../utils/store/groups'
import { useWebSocketConnection } from '../../utils/hooks'
import { useRouter } from 'next/navigation'
import { PiHandWavingBold } from 'react-icons/pi'

export const AvailableChats = () => {
    const [showCreateChatModal, setShowCreateChatModal] = useState(false)
    const { user } = useAuth()
    const dispatch = useDispatch<AppDispatch>()
    const chats = useAppSelector((state) => state.chats.chats)
    const groups = useAppSelector((state) => state.groups.groups)
    const data = [...chats, ...groups]
    const router = useRouter()

    // Establish WebSocket connection
    useWebSocketConnection()

    useEffect(() => {
        const fetchChats = async () => {
            Promise.all([getChats(), getGroups()]).then((responses) => {
                const [chatsResp, groupsResp] = responses

                if ('status' in chatsResp) {
                    const errorMessage = chatsResp?.message
                    toast.error(
                        errorMessage ||
                            'An error occurred fetching your chats.',
                    )
                } else {
                    dispatch(setChatState(chatsResp))
                }

                if ('status' in groupsResp) {
                    const errorMessage = groupsResp?.message
                    toast.error(
                        errorMessage ||
                            'An error occurred fetching your groups.',
                    )
                } else {
                    dispatch(setGroupsState(groupsResp))
                }
            })
        }
        fetchChats()
    }, [dispatch])

    return (
        data && (
            <SAvailableChats>
                <Toaster />
                {showCreateChatModal && (
                    <CreateChatModal
                        onClose={() => setShowCreateChatModal(false)}
                    />
                )}
                <SChatOverview>
                    <SActionsContainer>
                        <SSearchInput>
                            <IoSearch size={26} />
                            <input placeholder="Search" tabIndex={0} />
                        </SSearchInput>
                        <SCreateButton>
                            <IoAdd
                                size={26}
                                onClick={() =>
                                    setShowCreateChatModal(!showCreateChatModal)
                                }
                            />
                        </SCreateButton>
                    </SActionsContainer>
                    <SFriendsButton
                        onClick={() => router.push('/chats/friends')}
                    >
                        <PiHandWavingBold size={26} />
                        Friends
                    </SFriendsButton>
                    {data &&
                        data.map((chat: Chat | GroupChat, index) => (
                            <ChatPreview key={index} chat={chat} user={user} />
                        ))}
                </SChatOverview>
            </SAvailableChats>
        )
    )
}

const SAvailableChats = styled.div`
    display: flex;
    height: 100%;
    background: #f2f2f2;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    min-width: 10rem;
    max-width: 20vw;
`
const SChatOverview = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 0.5rem;
    box-sizing: border-box;
    padding: 1.5rem 1rem;
    gap: 0.2rem;
`
const SActionsContainer = styled.div`
    display: flex;
    width: 100%;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
`
const SCreateButton = styled.button`
    display: grid;
    place-items: center;
    border-radius: 0.5rem;
    box-sizing: border-box;
    background: #f4e7d8;
    outline: 1px solid #f4e7d8;
    border: none;
    padding: 0.5rem;
    transition: all 0.2s;

    &:is(:hover, :active, :focus-within) {
        outline: 1px solid #ff971f;
        cursor: pointer;
    }
`
const SSearchInput = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    background: #f4e7d8;
    border-radius: 0.5rem;
    padding: 0.5rem;
    gap: 0.5rem;
    outline: 1px solid #f4e7d8;
    transition: all 0.2s;
    input {
        border: none;
        background: none;
        outline: none;
        font-size: 1.1rem;
        width: 100%;
        box-sizing: border-box;
    }

    &:is(:hover, :active, :focus-within) {
        outline: 1px solid #ff971f;
        cursor: text;
    }
`
const SFriendsButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: inherit;
    border-radius: 0.5rem;
    padding: 0.5rem;
    outline: 1px solid #f2f2f2;
    transition: all 0.2s;
    border: none;
    font-weight: 500;
    font-size: 1.1rem;
    &:is(:hover, :active, :focus-within) {
        outline: 1px solid #ff971f;
        cursor: pointer;
    }
`
