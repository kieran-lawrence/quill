'use client'

import styled from 'styled-components'
import { useAuth } from '../../contexts/auth'
import { useEffect, useState } from 'react'
import { CreateChatModal } from './CreateChatModal'
import { IoAdd, IoSearch } from 'react-icons/io5'
import { ChatPreview } from './ChatPreview'
import { Chat, GroupChat } from '@repo/api'
import { getChats, getFriends, getGroups } from '../../utils/api'
import { AppDispatch, useAppSelector } from '../../utils/store'
import { setChatState, updateChatUserState } from '../../utils/store/chats'
import { useDispatch } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast'
import { setGroupsState } from '../../utils/store/groups'
import { useRouter } from 'next/navigation'
import { PiHandWavingBold } from 'react-icons/pi'
import { useWebSocketConnection, useWebSocketEvents } from '../../utils/hooks'
import { setFriendState, updateFriendState } from '../../utils/store/friends'
import { UserUpdatedEventParams } from '@repo/api'

export const AvailableChats = () => {
    // Establish WebSocket connection
    useWebSocketConnection()

    const [showCreateChatModal, setShowCreateChatModal] = useState(false)
    const { user } = useAuth()
    const dispatch = useDispatch<AppDispatch>()
    const chats = useAppSelector((state) => state.chats.chats)
    const groups = useAppSelector((state) => state.groups.groups)
    const data = [...chats, ...groups]
    const router = useRouter()

    const { listenForMessage } = useWebSocketEvents()

    useEffect(() => {
        const userStatusListener = listenForMessage<UserUpdatedEventParams>(
            'userUpdated',
            ({ updatedUser }) => {
                if (!updatedUser) return
                dispatch(updateFriendState(updatedUser))
                dispatch(updateChatUserState(updatedUser))
            },
        )
        return userStatusListener
    }, [listenForMessage, dispatch])

    useEffect(() => {
        const fetchChats = async () => {
            Promise.all([getChats(), getGroups(), getFriends()]).then(
                (responses) => {
                    const [chatsResp, groupsResp, friendResp] = responses

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

                    if ('status' in friendResp) {
                        const errorMessage = friendResp?.message
                        toast.error(
                            errorMessage ||
                                'An error occurred fetching your groups.',
                        )
                    } else {
                        const friendsResponse = friendResp.friends.map(
                            (friend) =>
                                friend?.userOne.id === user?.id
                                    ? friend?.userTwo
                                    : friend?.userOne,
                        )
                        dispatch(setFriendState(friendsResponse))
                    }
                },
            )
        }
        fetchChats()
    }, [dispatch, user])

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
    background: ${({ theme }) => theme.colors.backgroundPrimary};
    box-shadow: ${({ theme }) => `2px 0 2px ${theme.colors.shadow}`};
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    min-width: 10rem;
    max-width: 20vw;
    z-index: 1;
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
    background: ${({ theme }) => theme.colors.blueAccent};
    outline: ${({ theme }) => `1px solid ${theme.colors.blueAccent}`};
    border: none;
    padding: 0.5rem;
    transition: all 0.2s;

    &:is(:hover, :active, :focus-within) {
        outline: ${({ theme }) => `1px solid ${theme.colors.blueStrong}`};
        cursor: pointer;
    }
`
const SSearchInput = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    background: ${({ theme }) => theme.colors.blueAccent};
    border-radius: 0.5rem;
    padding: 0.5rem;
    gap: 0.5rem;
    outline: ${({ theme }) => `1px solid ${theme.colors.blueAccent}`};
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
        outline: ${({ theme }) => `1px solid ${theme.colors.blueStrong}`};
        cursor: text;
    }
`
const SFriendsButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: ${({ theme }) => theme.colors.blueWeak};
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    padding: 0.5rem;
    outline: ${({ theme }) => `1px solid ${theme.colors.blueWeak}`};
    transition: all 0.2s;
    border: none;
    font-weight: 500;
    font-size: 1.1rem;
    &:is(:hover, :active, :focus-within) {
        outline: ${({ theme }) => `1px solid ${theme.colors.blueStrong}`};
        cursor: pointer;
    }
`
