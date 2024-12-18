'use client'

import styled from 'styled-components'
import { useFriends } from '../../utils/hooks'
import { GroupUserInitials } from '../../components/GroupUserInitials'
import { Avatar } from '../../components/Avatar'
import { PiHandWavingBold } from 'react-icons/pi'
import { OnlineStatus } from '../../components/OnlineStatus'

export default function FriendsPage() {
    const { friends, setSearchTerm } = useFriends()
    return (
        <SFriendsContainer>
            <SHeading>
                <PiHandWavingBold size={26} />
                Friends
                <SFilterButton onClick={() => setSearchTerm('online')}>
                    Online
                </SFilterButton>
                <SFilterButton onClick={() => setSearchTerm('')}>
                    All
                </SFilterButton>
                <SFilterButton onClick={() => setSearchTerm('')}>
                    Pending
                </SFilterButton>
            </SHeading>
            <SFriendsWrapper>
                {friends &&
                    friends.map((friend) => (
                        <SFriendWrapper key={friend.id}>
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
    padding: 0.5rem;
    transition: all 0.2s;
    font-size: 1rem;

    &:is(:hover, :active, :focus-within) {
        outline: 1px solid #ff971f;
        cursor: pointer;
    }
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
