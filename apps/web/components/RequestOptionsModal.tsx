'use client'

import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { addFriend, updateFriendRequest } from '../utils/api'
import { Modal } from './shared/Modal'
import styled from 'styled-components'
import { QuillButton } from './shared/QuillButton'
import { FriendRequest } from '@repo/api'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../utils/store'
import { updateFriendRequestState } from '../utils/store/friends'

interface Props {
    request: FriendRequest
    onClose: () => void
}

export default function RequestOptionsModal({ request, onClose }: Props) {
    const dispatch = useDispatch<AppDispatch>()

    const handleAccept = () => {
        updateFriendRequest(request.id, 'accepted').then((res) => {
            if ('error' in res) {
                toast.error(
                    `Error: ${res.message || 'Failed to accept friend request'}`,
                )
            } else {
                toast.success('Friend request accepted!')
                onClose()
            }
        })
        dispatch(updateFriendRequestState({ ...request, status: 'accepted' }))
    }
    const handleReject = () => {
        updateFriendRequest(request.id, 'rejected').then((res) => {
            if ('error' in res) {
                toast.error(
                    `Error: ${res.message || 'Failed to decline friend request'}`,
                )
            } else {
                toast.success('Friend request rejected!')
                onClose()
            }
        })
        dispatch(updateFriendRequestState({ ...request, status: 'rejected' }))
    }

    return (
        <Modal
            title={`Friend request from ${request.addressee.firstName} ${request.addressee.lastName}`}
            onClose={onClose}
            modalSize={{ width: 35, height: 25 }}
        >
            <SCurrentRequestsContainer>
                <Toaster />
                <QuillButton
                    style="filled"
                    text="Accept"
                    onClick={handleAccept}
                />
                <QuillButton
                    style="filled"
                    text="Decline"
                    onClick={handleReject}
                />
            </SCurrentRequestsContainer>
        </Modal>
    )
}

const SCurrentRequestsContainer = styled.div`
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
