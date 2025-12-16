import styled from 'styled-components'
import { ActionMenu } from '../ActionMenu'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { addUsersToGroup } from '../../../utils/api'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../utils/store'
import { updateGroupState } from '../../../utils/store/groups'
import { useFriends, useWebSocketEvents } from '../../../utils/hooks'
import { GroupChat, User } from '@repo/api'
import { SSelectedFriendWrapper } from '../../chats/CreateChatModal'
import { IoClose } from 'react-icons/io5'

type AddGroupMembersMenuprops = {
    group: GroupChat
    onCancel: () => void
}
export const AddGroupMembersMenu = ({
    group,
    onCancel,
}: AddGroupMembersMenuprops) => {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const { friends, searchTerm, setSearchTerm } = useFriends()
    const dispatch = useDispatch<AppDispatch>()
    const { sendMessage } = useWebSocketEvents()

    const friendsNotInChat = friends.filter(
        (friend) =>
            // Remove any existing group members from the list
            !group.members.map((member) => member.id).includes(friend.id),
    )
    const updateSelectedUsers = (user: User) => {
        const exists = selectedUsers.find((u) => u.id === user.id)
        if (!exists) {
            setSelectedUsers((prev) => [...prev, user])
        } else {
            setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id))
        }
        setSearchTerm('')
    }
    const handleSubmit = () => {
        const users = selectedUsers.map((user) => user.id)
        if (!users || users.length === 0) return
        addUsersToGroup({ groupId: group.id, users }).then((resp) => {
            if ('status' in resp) {
                toast.error(
                    resp?.message ||
                        'An error occurred adding users to the group',
                )
            } else {
                dispatch(updateGroupState(resp))
                sendMessage('onGroupChatUpdate', { group: resp })
                onCancel()
            }
        })
    }

    return (
        <ActionMenu
            menuHeading="Add Friends"
            menuText="Select one or more friends to add to this group."
            onConfirm={handleSubmit}
            onCancel={onCancel}
            confirmText="Add"
            cancelText="Cancel"
            width={30}
        >
            <Toaster />
            <SSearchInputWrapper>
                {selectedUsers.map((recipient) => (
                    <SSelectedFriendWrapper key={recipient.id}>
                        {recipient.username}
                        <div onClick={() => updateSelectedUsers(recipient)}>
                            <IoClose size={26} className="removeFriendIcon" />
                        </div>
                    </SSelectedFriendWrapper>
                ))}
                <input
                    placeholder="Search friends"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
            </SSearchInputWrapper>
            <SFriendsContainer>
                {friendsNotInChat.map((friend) => (
                    <SFriendInfo
                        tabIndex={0}
                        onClick={() => updateSelectedUsers(friend)}
                        key={friend.id}
                    >
                        <div>{friend.username}</div>
                        <div>{friend.email}</div>
                    </SFriendInfo>
                ))}
                {friendsNotInChat.length === 0 && <em>No friends found</em>}
            </SFriendsContainer>
        </ActionMenu>
    )
}

export const SSearchInputWrapper = styled.div`
    background: ${({ theme }) => theme.colors.blueAccent};
    display: flex;
    gap: 0.4rem;
    padding: 0.3rem;
    border-radius: 0.5rem;
    box-sizing: border-box;
    overflow-wrap: break-word;
    overflow: hidden scroll;
    scrollbar-width: none;
    flex-wrap: wrap;
    outline: ${({ theme }) => `1px solid ${theme.colors.blueAccent}`};

    input {
        background: none;
        border: none;
        outline: none;
        font-size: 1.1rem;
        padding: 0.7rem 0.4rem;
    }
    &:is(:hover, :focus-within) {
        outline: ${({ theme }) => `1px solid ${theme.colors.blueStrong}`};
        cursor: text;
    }
`
const SFriendsContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    overflow-y: scroll;
    min-height: 5.5rem;

    em {
        color: ${({ theme }) => theme.colors.text.weak};
        padding: 0 0.5rem;
        font-size: 0.9rem;
    }
`
export const SFriendInfo = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    user-select: none;
    max-width: 45%;
    flex: 1;
    height: fit-content;

    div:last-child {
        font-size: 0.8rem;
        font-weight: 400;
        color: ${({ theme }) => theme.colors.text.weak};
    }

    &:is(:hover, :focus) {
        background: ${({ theme }) => theme.colors.blueAccent};
        cursor: pointer;
    }
`
