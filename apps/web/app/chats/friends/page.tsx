'use client'

import styled from 'styled-components'
import { useFriends } from '../../../utils/hooks'
import { GroupUserInitials } from '../../../components/GroupUserInitials'
import { Avatar } from '../../../components/Avatar'
import { PiHandWavingBold } from 'react-icons/pi'
import { OnlineStatus } from '../../../components/OnlineStatus'
import { useAppSelector } from '../../../utils/store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AddFriendModal from '../../../components/AddFriendModal'
import RequestOptionsModal from '../../../components/RequestOptionsModal'
import { FriendRequest } from '@repo/api'

export default function FriendsPage() {
    const { friends, pending, searchTerm, setSearchTerm } = useFriends()
    const chats = useAppSelector((state) => state.chats.chats)
    const [showAddFriendModal, setShowAddFriendModal] = useState(false)
    const [selectedRequest, setSelectedRequest] =
        useState<FriendRequest | null>(null)
    const [showRequestOptionsModal, setShowRequestOptionsModal] =
        useState(false)
    const router = useRouter()

    const handleFriendMessage = (friendId: number) => {
        const chat = chats.find(
            (chat) =>
                chat.creator.id === friendId || chat.recipient.id === friendId,
        )
        chat && router.push(`/chats/${chat.id}`)
    }

    return (
        <SFriendsContainer>
            {showAddFriendModal && (
                <AddFriendModal onClose={() => setShowAddFriendModal(false)} />
            )}
            {showRequestOptionsModal && selectedRequest && (
                <RequestOptionsModal
                    request={selectedRequest}
                    onClose={() => setShowRequestOptionsModal(false)}
                />
            )}
            <SHeading>
                <PiHandWavingBold size={26} />
                Friends
                <SFilterButton onClick={() => setSearchTerm('online')}>
                    Online
                </SFilterButton>
                <SFilterButton onClick={() => setSearchTerm('')}>
                    All
                </SFilterButton>
                <SFilterButton onClick={() => setSearchTerm('pending')}>
                    Pending
                </SFilterButton>
                <SAddFriendButton onClick={() => setShowAddFriendModal(true)}>
                    Add Friend
                </SAddFriendButton>
            </SHeading>
            <SFriendsWrapper>
                {searchTerm === 'pending' ? (
                    pending.length > 0 ? (
                        <>
                            {pending.map((request) => (
                                <SFriendWrapper
                                    key={request.addressee.id}
                                    onClick={() => {
                                        setSelectedRequest(request)
                                        setShowRequestOptionsModal(true)
                                    }}
                                >
                                    {request.addressee.avatar ? (
                                        <Avatar
                                            imgSrc={`/images/${request.addressee.avatar}`}
                                            size="3.5rem"
                                        />
                                    ) : (
                                        <GroupUserInitials
                                            text={`${request.addressee.firstName} ${request.addressee.lastName}`}
                                            size="3.5rem"
                                        />
                                    )}
                                    {`${request.addressee.firstName} ${request.addressee.lastName}`}
                                    <SPendingRequestBadge>
                                        Pending
                                    </SPendingRequestBadge>
                                </SFriendWrapper>
                            ))}
                        </>
                    ) : (
                        <>No friend requests</>
                    )
                ) : (
                    friends &&
                    friends.map((friend) => (
                        <SFriendWrapper
                            key={friend.id}
                            onClick={() => handleFriendMessage(friend.id)}
                        >
                            {friend.avatar ? (
                                <Avatar
                                    imgSrc={`/images/${friend.avatar}`}
                                    size="3.5rem"
                                />
                            ) : (
                                <GroupUserInitials
                                    text={`${friend.firstName} ${friend.lastName}`}
                                    size="3.5rem"
                                />
                            )}

                            {`${friend.firstName} ${friend.lastName}`}
                            <OnlineStatus userId={friend.id} />
                        </SFriendWrapper>
                    ))
                )}
            </SFriendsWrapper>
        </SFriendsContainer>
    )
}

export const SFriendsContainer = styled.div`
    display: flex;
    height: 100%;
    flex: 1;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.backgroundPrimary};
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    padding: 0 1rem;
`
const SHeading = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    height: 3rem;
    width: 100%;
    padding: 1rem;
    font-size: 1.5rem;
`
const SFilterButton = styled.button`
    display: grid;
    place-items: center;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.colors.blueAccent};
    outline: ${({ theme }) => `1px solid ${theme.colors.blueAccent}`};
    border: none;
    padding: 0.5rem 1rem;
    transition: all 0.2s;
    font-size: 1.1rem;
    font-weight: 400;

    &:is(:hover, :active, :focus-within) {
        outline: ${({ theme }) => `1px solid ${theme.colors.blueStrong}`};
        cursor: pointer;
    }
`
const SAddFriendButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.colors.blueStrong};
    outline: ${({ theme }) => `1px solid ${theme.colors.blueStrong}`};
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.text.light};
    font-weight: 500;

    &:is(:hover, :active, :focus-within) {
        opacity: 0.8;
        cursor: pointer;
    }
    transition: all 0.2s;
`
const SFriendsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    border-radius: 0.5rem;
    box-sizing: border-box;
    gap: 0.5rem;
`
const SFriendWrapper = styled.address`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-style: normal;
    font-weight: 500;
    width: 50%;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s;

    &:is(:hover, :active, :focus-within) {
        background: ${({ theme }) => theme.colors.blueWeak};
        cursor: pointer;
    }
`
const SPendingRequestBadge = styled.div`
    display: grid;
    place-items: center;
    background: ${({ theme }) => theme.colors.blueAccent};
    color: ${({ theme }) => theme.colors.text};
    border-radius: 0.5rem;
    padding: 0.3rem 0.6rem;
    font-size: 0.9rem;
`
