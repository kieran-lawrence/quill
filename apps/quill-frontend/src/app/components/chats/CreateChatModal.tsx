import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { IoClose } from 'react-icons/io5'
import { useGetFriendsQuery } from '../../utils/store/friend'
import { User } from '../../utils/types'
import { QuillButton } from '../shared/QuillButton'
import { useFriends } from '../../utils/hooks'
import { useForm } from 'react-hook-form'
import { usePostCreateChatMutation } from '../../utils/store/chats'
import { usePostCreateGroupChatMutation } from '../../utils/store/groups'

type Props = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    onCreateChat: () => void
    onCreateGroupChat: () => void
}
export const CreateChatModal = ({
    setShowModal,
    onCreateChat,
    onCreateGroupChat,
}: Props) => {
    const formRef = useRef<HTMLDivElement>(null)
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const { friends, filterFriends, searchTerm, setSearchTerm } = useFriends()
    const [createChat, { error: chatError }] = usePostCreateChatMutation()
    const [createGroupChat, { error: groupError }] =
        usePostCreateGroupChatMutation()

    /** Toggles selected users which appear in the search input */
    const updateSelectedUsers = (user: User) => {
        const exists = selectedUsers.find((u) => u.id === user.id)
        if (!exists) {
            // User is not selected, add them to selected users
            setSelectedUsers((prev) => [...prev, user])
        } else {
            // User is selected, remove them from selected users
            setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id))
        }
        setSearchTerm('')
    }

    /** Hides the modal when user clicks on ref element but not its contents */
    const handleOverlayClick = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        const { current } = formRef
        if (current === e.target) setShowModal(false)
    }

    /** Effect to hide the modal when escape key is pressed */
    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) =>
            e.key === 'Escape' && setShowModal(false)
        document.addEventListener('keydown', handleKeydown)
        return () => document.removeEventListener('keydown', handleKeydown)
    }, [formRef, setShowModal])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const users = selectedUsers.map((recipient) => recipient.email)
        try {
            if (users.length > 1) {
                createGroupChat({ members: users }).then(() => {
                    setShowModal(false)
                    onCreateGroupChat()
                })
                // dispatch(postNewGroupChatThunk({members}))
                // .unwrap().then(({ data }) => {
                //     setShowCreateChatModal(false);
                //     navigate(`/groups/${data.id}`);
                // }).catch((err) => console.log(err));
            } else {
                createChat({ email: users[0] }).then(() => {
                    setShowModal(false)
                    onCreateChat()
                })
                // dispatch(postNewChatThunk({email:members[0]}))
                // .unwrap().then(({ data }) => {
                //     setShowCreateChatModal(false);
                //     navigate(`/chats/${data.id}`);
                // }).catch((err) => console.log(err));
            }
        } catch (err) {
            console.log(err)
        }
        setSelectedUsers([])
    }
    return (
        <SCreateChatModal ref={formRef} onClick={handleOverlayClick}>
            <SCreateChatForm onSubmit={handleSubmit}>
                <SCreateChatHeader>
                    <h2>Create New Chat</h2>
                    <IoClose
                        size={26}
                        onClick={() => setShowModal(false)}
                        className="closeIcon"
                    />
                </SCreateChatHeader>
                <SFriendWrapper>
                    <h3>Select Friends</h3>
                    <SSearchInputWrapper>
                        {selectedUsers &&
                            selectedUsers.map((recipient) => (
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
                            onChange={filterFriends}
                            value={searchTerm}
                        />
                    </SSearchInputWrapper>
                    <h4>Friends:</h4>
                    {friends &&
                        friends.map((friend) => (
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
                </SFriendWrapper>
                <QuillButton type="filled" text="Create Chat" />
            </SCreateChatForm>
        </SCreateChatModal>
    )
}
const SCreateChatModal = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #0000008e;
    display: grid;
    place-items: center;
`
const SCreateChatForm = styled.form`
    width: 40%;
    height: 50%;
    background: #f4e7d8;
    box-shadow: 0 0 0.3rem #000000b2;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2rem;
    gap: 2rem;
    box-sizing: border-box;
`
const SCreateChatHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    .closeIcon {
        padding: 0.2rem;
        background: #00000011;
        border-radius: 0.5rem;
        transition: all 0.2s;
        cursor: pointer;
        &:hover {
            background: #00000022;
        }
    }
`
const SFriendWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;

    h3 {
        font-weight: 600;
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
        background: #f2f2f2;
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
        font-weight: 300;
        color: #8c8c8c;
    }
`
export const SSearchInputWrapper = styled.div`
    background: #f2f2f2;
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
    outline: 1px solid #f28140;

    input {
        background: none;
        border: none;
        outline: none;
        font-size: 1.1rem;
        padding: 0.7rem 0.4rem;
    }
    &:is(:hover, :focus-within) {
        cursor: text;
    }
`
export const SSelectedFriendWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 0.4rem;
    border-radius: 0.5rem;
    background: #f28140;
    color: #fff;
    font-size: 1rem;
    padding: 0.5rem 0.8rem;
    box-sizing: border-box;

    div {
        display: grid;
        place-items: center;
    }
    .removeFriendIcon {
        background: #00000011;
        border-radius: 0.5rem;
        transition: all 0.2s;
        cursor: pointer;

        &:hover {
            background: #00000022;
        }
    }
`
