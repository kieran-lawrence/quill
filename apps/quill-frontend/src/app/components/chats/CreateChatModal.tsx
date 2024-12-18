import { useState } from 'react'
import styled from 'styled-components'
import { User } from '@quill/data'
import { QuillButton } from '../shared/QuillButton'
import { useFriends } from '../../utils/hooks'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../utils/store'
import { addChatToState } from '../../utils/store/chats'
import { createChat, createGroup } from '../../utils/api'
import { addGroupToState } from '../../utils/store/groups'
import { Modal } from '../shared/Modal'
import { IoClose } from 'react-icons/io5'

type Props = {
    onClose: () => void
}

export const CreateChatModal = ({ onClose }: Props) => {
    const dispatch = useDispatch<AppDispatch>()
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const { friends, searchTerm, setSearchTerm } = useFriends()

    const updateSelectedUsers = (user: User) => {
        const exists = selectedUsers.find((u) => u.id === user.id)
        if (!exists) {
            setSelectedUsers((prev) => [...prev, user])
        } else {
            setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id))
        }
        setSearchTerm('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const users = selectedUsers.map((recipient) => recipient.email)

        if (users.length > 1) {
            createGroup({ members: users }).then((resp) => {
                if ('status' in resp) {
                    toast.error(
                        resp?.message || 'An error occurred creating the chat',
                    )
                } else {
                    onClose()
                    dispatch(addGroupToState(resp))
                }
            })
        } else {
            createChat({ email: users[0] }).then((resp) => {
                if ('status' in resp) {
                    toast.error(
                        resp?.message || 'An error occurred creating the chat',
                    )
                } else {
                    onClose()
                    dispatch(addChatToState(resp))
                }
            })
        }

        setSelectedUsers([])
    }

    return (
        <Modal title="Create New Chat" onClose={onClose}>
            <SCreateChatForm onSubmit={handleSubmit}>
                <Toaster />
                <SFriendWrapper>
                    <h3>Select Friends</h3>
                    <SSearchInputWrapper>
                        {selectedUsers.map((recipient) => (
                            <SSelectedFriendWrapper key={recipient.id}>
                                {recipient.username}
                                <div
                                    onClick={() =>
                                        updateSelectedUsers(recipient)
                                    }
                                >
                                    <IoClose
                                        size={26}
                                        className="removeFriendIcon"
                                    />
                                </div>
                            </SSelectedFriendWrapper>
                        ))}
                        <input
                            placeholder="Search friends"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                        />
                    </SSearchInputWrapper>
                    <h4>Friends:</h4>
                    <SFriendsContainer>
                        {friends.map((friend) => (
                            <SFriendsList
                                onClick={() => updateSelectedUsers(friend)}
                                key={friend.id}
                            >
                                <SFriendInfo tabIndex={0}>
                                    <div>{friend.username}</div>
                                    <div>{friend.email}</div>
                                </SFriendInfo>
                            </SFriendsList>
                        ))}
                    </SFriendsContainer>
                </SFriendWrapper>
                <QuillButton type="filled" text="Create Chat" />
            </SCreateChatForm>
        </Modal>
    )
}

const SCreateChatForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    overflow-y: scroll;
    padding: 0.1rem;
`

const SFriendsContainer = styled.div`
    overflow-y: auto;
    max-height: 200px;
`

const SFriendWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;

    h3 {
        font-weight: 500;
        padding-bottom: 0.4rem;
    }
    h4 {
        font-weight: 500;
        font-size: 1.2rem;
        padding-bottom: 0.2rem;
    }
`
export const SFriendsList = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0rem 0.5rem;
    border-radius: 0.5rem;

    &:is(:hover, :focus-within) {
        background: ${({ theme }) => theme.colors.blueWeak};
        cursor: pointer;
    }
`
export const SFriendInfo = styled.section`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    gap: 1rem;
    font-size: 1.1rem;
    user-select: none;
    padding: 0.5rem 0;
    cursor: pointer;
    outline: none;

    div:last-child {
        font-size: 0.9rem;
        font-weight: 400;
        color: ${({ theme }) => theme.colors.text.weak};
    }
`
export const SSearchInputWrapper = styled.div`
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    display: flex;
    gap: 0.4rem;
    padding: 0.3rem;
    border-radius: 0.5rem;
    box-sizing: border-box;
    overflow-wrap: break-word;
    overflow: hidden scroll;
    scrollbar-width: none;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    outline: ${({ theme }) => `1px solid ${theme.colors.backgroundSecondary}`};

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
export const SSelectedFriendWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 0.4rem;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.colors.blueStrong};
    color: ${({ theme }) => theme.colors.text.light};
    font-size: 1rem;
    padding: 0.5rem 0.8rem;
    box-sizing: border-box;

    div {
        display: grid;
        place-items: center;
    }
    .removeFriendIcon {
        background: ${({ theme }) => theme.colors.shadow};
        border-radius: 0.5rem;
        transition: all 0.2s;
        cursor: pointer;

        &:hover {
            opacity: 0.8;
        }
    }
`
