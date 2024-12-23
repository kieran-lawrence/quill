'use client'

import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { addFriend } from '../utils/api'
import { Modal } from './shared/Modal'
import styled from 'styled-components'
import { QuillButton } from './shared/QuillButton'

interface Props {
    onClose: () => void
}

export default function AddFriendModal({ onClose }: Props) {
    const [email, setEmail] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            return toast.error('Please enter a valid email address')
        }

        addFriend({ email }).then((res) => {
            if ('error' in res) {
                toast.error(
                    `Error: ${res.message || 'Failed to send friend request'}`,
                )
            } else {
                toast.success('Friend request sent!')
                onClose()
                setEmail('')
            }
        })
    }

    return (
        <Modal
            title="Add Friend"
            onClose={onClose}
            modalSize={{ width: 35, height: 25 }}
        >
            <SAddFriendForm onSubmit={handleSubmit}>
                <Toaster />
                <label htmlFor="email">
                    You can add friends with their Quill Email Address.
                </label>
                <SSearchInputWrapper>
                    <input
                        id="email"
                        placeholder="Email (eg. john.doe@quill.com)"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <QuillButton style="filled" text="Send Friend Request" />
                </SSearchInputWrapper>
            </SAddFriendForm>
        </Modal>
    )
}

const SAddFriendForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    gap: 1rem;
    overflow-y: scroll;
    padding: 0.1rem;
`
export const SSearchInputWrapper = styled.div`
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    display: flex;
    padding: 0.3rem;
    border-radius: 0.8rem;
    box-sizing: border-box;
    margin-bottom: 1rem;
    outline: ${({ theme }) => `1px solid ${theme.colors.blueAccent}`};

    input {
        background: none;
        border: none;
        outline: none;
        font-size: 1rem;
        padding: 0.7rem 0.4rem;
        flex: 1;
    }
    &:is(:hover, :focus-within) {
        outline: ${({ theme }) => `1px solid ${theme.colors.blueStrong}`};
        cursor: text;
    }
`
