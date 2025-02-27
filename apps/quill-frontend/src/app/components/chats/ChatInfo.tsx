'use client'

import styled from 'styled-components'
import { GroupChat } from '@quill/data'
import { useAuth } from '../../contexts/auth'
import { GroupUserInitials } from '../GroupUserInitials'
import { Avatar } from '../Avatar'
import { isChatCreator } from '../../utils/helpers'
import { useState } from 'react'
import { RenameGroupMenu } from '../menu/group/RenameGroupMenu'
import { DeleteGroupMenu } from '../menu/group/DeleteGroupMenu'
import { ChangeGroupPhotoMenu } from '../menu/group/ChangeGroupPhotoMenu'
import { OnlineStatus } from '../OnlineStatus'
import { useRouter } from 'next/navigation'
import { ContextMenu } from '../menu/ContextMenu'
import { leaveGroupChat, removeUserFromGroup } from '../../utils/api'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../utils/store'
import { updateGroupState } from '../../utils/store/groups'
import { useWebSocketEvents } from '../../utils/hooks'
import { IoAdd } from 'react-icons/io5'
import { AddGroupMembersMenu } from '../menu/group/AddGroupMembersMenu'

type Props = {
    isVisible: boolean
    chat: GroupChat
}
type ActionProps = {
    isRenaming: boolean
    isDeleting: boolean
    isChangingPhoto: boolean
    isAddingMembers: boolean
}

export const ChatInfo = ({ isVisible, chat }: Props) => {
    const { user } = useAuth()
    const isCreator = isChatCreator(chat, user)
    const router = useRouter()
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [points, setPoints] = useState({ x: 0, y: 0 })
    const [selectedUser, setSelectedUser] = useState<number | null>(null)
    const dispatch = useDispatch<AppDispatch>()
    const { sendMessage } = useWebSocketEvents()
    const [editing, setEditing] = useState<ActionProps>({
        isRenaming: false,
        isDeleting: false,
        isChangingPhoto: false,
        isAddingMembers: false,
    })

    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        setShowContextMenu(true)
        setPoints({ x: e.clientX, y: e.clientY })
    }

    const handleRemoveFromGroup = () => {
        if (!selectedUser) return
        removeUserFromGroup({ groupId: chat.id, userId: selectedUser }).then(
            (res) => {
                if ('error' in res) {
                    const errorMessage = res?.message
                    toast.error(
                        errorMessage ||
                            'An error occurred removing this user from the group.',
                    )
                } else {
                    setShowContextMenu(false)
                    setSelectedUser(null)
                    dispatch(updateGroupState(res))
                    sendMessage('onGroupChatUpdate', { group: res })
                }
            },
        )
    }

    const handleGroupChatLeave = () => {
        if (!user) return
        leaveGroupChat({
            groupId: chat.id,
            userId: user.id,
        }).then((res) => {
            if ('error' in res) {
                const errorMessage = res?.message
                toast.error(
                    errorMessage ||
                        'Unable to leave group. Please try again later.',
                )
            } else {
                setShowContextMenu(false)
                dispatch(updateGroupState(res))
                sendMessage('onGroupChatUpdate', { group: res })
                router.push('/chats')
            }
        })
    }

    return (
        <>
            {editing.isRenaming && (
                <RenameGroupMenu
                    groupId={chat.id}
                    onCancel={() =>
                        setEditing({ ...editing, isRenaming: false })
                    }
                />
            )}
            {editing.isDeleting && (
                <DeleteGroupMenu
                    groupId={chat.id}
                    onCancel={() => {
                        setEditing({ ...editing, isDeleting: false })
                        router.replace('/chats')
                    }}
                />
            )}
            {editing.isChangingPhoto && (
                <ChangeGroupPhotoMenu
                    group={chat}
                    onCancel={() =>
                        setEditing({ ...editing, isChangingPhoto: false })
                    }
                />
            )}
            {editing.isAddingMembers && (
                <AddGroupMembersMenu
                    group={chat}
                    onCancel={() =>
                        setEditing({ ...editing, isAddingMembers: false })
                    }
                />
            )}
            <Toaster />
            <SChatInfo $isVisible={isVisible}>
                <SChatActions $isVisible={isVisible}>
                    <h3>Chat Actions</h3>
                    <ul className="actionsList">
                        {isCreator && (
                            <li
                                onClick={() =>
                                    setEditing({ ...editing, isRenaming: true })
                                }
                            >
                                Rename Group
                            </li>
                        )}
                        {isCreator && (
                            <li
                                onClick={() =>
                                    setEditing({ ...editing, isDeleting: true })
                                }
                            >
                                Delete Group
                            </li>
                        )}
                        {isCreator && (
                            <li
                                onClick={() =>
                                    setEditing({
                                        ...editing,
                                        isChangingPhoto: true,
                                    })
                                }
                            >
                                Change Cover Photo
                            </li>
                        )}
                        {!isCreator && user && (
                            <li onClick={handleGroupChatLeave}>Leave</li>
                        )}
                    </ul>
                </SChatActions>
                <SChatMembers $isVisible={isVisible}>
                    <SChatMemberActions>
                        <h3>{chat.members.length} members</h3>
                        <IoAdd
                            size={24}
                            className="addMemberIcon"
                            onClick={() =>
                                setEditing({
                                    ...editing,
                                    isAddingMembers: true,
                                })
                            }
                        />
                    </SChatMemberActions>
                    {showContextMenu && (
                        <ContextMenu
                            points={points}
                            width={13}
                            handleClose={() => setShowContextMenu(false)}
                        >
                            <ul>
                                {isCreator && (
                                    <li onClick={handleRemoveFromGroup}>
                                        Remove from Group
                                    </li>
                                )}
                            </ul>
                        </ContextMenu>
                    )}
                    {chat.members.map((member) => (
                        <SMemberWrapper
                            key={member.id}
                            onContextMenu={(e) => {
                                // Only show context menu if the user is not the creator
                                if (member.id === chat.creator.id) return
                                onContextMenu(e)
                                setSelectedUser(member.id)
                            }}
                        >
                            {member.avatar ? (
                                <Avatar
                                    imgSrc={`/images/${member.avatar}`}
                                    size="3.5rem"
                                />
                            ) : (
                                <GroupUserInitials
                                    text={`${member.firstName} ${member.lastName}`}
                                    size="3.5rem"
                                />
                            )}

                            <div className="memberInfo">
                                {`${member.firstName} ${member.lastName}`}
                                <OnlineStatus
                                    userId={member.id}
                                    overrideStatus={member.onlineStatus}
                                />
                                <p>
                                    {member.id === chat.creator.id && 'admin'}
                                </p>
                                <p>{member.id === user?.id && '(you)'}</p>
                            </div>
                        </SMemberWrapper>
                    ))}
                </SChatMembers>
            </SChatInfo>
        </>
    )
}
const SChatInfo = styled.aside<{ $isVisible: boolean }>`
    margin-left: ${(props) => (props.$isVisible ? '0.5rem' : '0')};
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0.5rem;
    border-radius: 0.5rem;
    width: ${(props) => (props.$isVisible ? '18vw' : '0')};
    transition: all 0.2s;
    h3 {
        font-size: 1.1rem;
    }
`
const SChatActions = styled.div<{ $isVisible: boolean }>`
    opacity: ${(props) => (props.$isVisible ? '1' : '0')};
    padding: 1rem;
    display: flex;
    flex-direction: column;
    height: 50%;
    border-radius: 0.5rem;
    box-sizing: border-box;
    background: ${({ theme }) => theme.colors.backgroundPrimary};
    transition: all 0.2s;

    h3 {
        margin-bottom: 1rem;
        font-weight: 500;
    }
    .actionsList {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        li {
            margin: 0;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            &:is(:hover, :focus) {
                cursor: pointer;
                background: ${({ theme }) => theme.colors.blueAccent};
            }
        }
    }
`
const SChatMembers = styled.div<{ $isVisible: boolean }>`
    opacity: ${(props) => (props.$isVisible ? '1' : '0')};
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    border-radius: 0.5rem;
    box-sizing: border-box;
    background: ${({ theme }) => theme.colors.blueAccent};
    transition: all 0.2s;
    gap: 0.5rem;

    h3 {
        font-weight: 500;
    }
`
const SChatMemberActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    .addMemberIcon {
        cursor: pointer;
        transition: all 0.2s;
        color: ${({ theme }) => theme.colors.blueStrong};

        &:hover {
            color: ${({ theme }) => theme.colors.orangeStrong};
        }
    }
`
const SMemberWrapper = styled.address`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-style: normal;
    font-weight: 500;
    transition: all 0.2s;
    border-radius: 0.5rem;
    box-sizing: border-box;
    user-select: none;

    .memberInfo {
        display: flex;
        align-items: center;
        column-gap: 0.5rem;
        flex-wrap: wrap;
    }

    p {
        font-size: 0.9rem;
        color: ${({ theme }) => theme.colors.blueStrong};
        font-weight: 400;
    }

    &:hover {
        cursor: pointer;
        background: ${({ theme }) => theme.colors.blueWeak};
    }
`
