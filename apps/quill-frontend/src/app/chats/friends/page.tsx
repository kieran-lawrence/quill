'use client'

import styled from 'styled-components'
import { useFriends } from '../../utils/hooks'
import { GroupUserInitials } from '../../components/GroupUserInitials'
import { Avatar } from '../../components/Avatar'
import { PiHandWavingBold } from 'react-icons/pi'
import { OnlineStatus } from '../../components/OnlineStatus'
import { useAppSelector } from '../../utils/store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AddFriendModal from '../../components/AddFriendModal'

export default function FriendsPage() {
    const { friends, setSearchTerm } = useFriends()
    const chats = useAppSelector((state) => state.chats.chats)
    const [showAddFriendModal, setShowAddFriendModal] = useState(false)
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
            <SHeading>
                <PiHandWavingBold size={26} />
                Friends
                <SFilterButton onClick={() => setSearchTerm('online')}>
                    Online
                </SFilterButton>
                <SFilterButton onClick={() => setSearchTerm('')}>
                    All
                </SFilterButton>
                {/* <SFilterButton onClick={() => setSearchTerm('')}>
                    Pending
                </SFilterButton> */}
                <SAddFriendButton onClick={() => setShowAddFriendModal(true)}>
                    Add Friend
                </SAddFriendButton>
            </SHeading>
            <SFriendsWrapper>
                {friends &&
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
                            <OnlineStatus status={friend.onlineStatus} />
                        </SFriendWrapper>
                    ))}
            </SFriendsWrapper>
        </SFriendsContainer>
    )
}

export const SFriendsContainer = styled.div`
    display: flex;
    height: 100%;
    flex: 1;
    flex-direction: column;
    background: #f2f2f2;
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
`
const SHeading = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    height: 3rem;
    width: 100%;
    padding: 1rem;
    font-size: 1.4rem;
`
const SFilterButton = styled.button`
    display: grid;
    place-items: center;
    border-radius: 0.5rem;
    background: #f4e7d8;
    outline: 1px solid #f4e7d8;
    border: none;
    padding: 0.5rem 1rem;
    transition: all 0.2s;
    font-size: 1rem;

    &:is(:hover, :active, :focus-within) {
        outline: 1px solid #ff971f;
        cursor: pointer;
    }
`
const SAddFriendButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    background: #ff971f;
    outline: 1px solid #ff971f;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    color: #f2f2f2;
    font-weight: 600;

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

    &:is(:hover, :active, :focus-within) {
        outline: 1px solid #ff971f;
        cursor: pointer;
    }
`
