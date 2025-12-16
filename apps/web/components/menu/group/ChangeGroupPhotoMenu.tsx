import { useState } from 'react'
import { GroupChat } from '@repo/api'
import { ActionMenu } from '../ActionMenu'
import toast, { Toaster } from 'react-hot-toast'
import { Avatar } from '../../Avatar'
import { GroupUserInitials } from '../../GroupUserInitials'
import { getGroupChatMembers } from '../../../utils/helpers'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import { updateGroupCoverImage } from '../../../utils/api'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../utils/store'
import { updateGroupState } from '../../../utils/store/groups'
import { useWebSocketEvents } from '../../../utils/hooks'

type ChangeGroupPhotoMenuprops = {
    group: GroupChat
    onCancel: () => void
}
export const ChangeGroupPhotoMenu = ({
    group,
    onCancel,
}: ChangeGroupPhotoMenuprops) => {
    const { register } = useForm<{ avatar?: string }>()
    const dispatch = useDispatch<AppDispatch>()
    const [coverImage, setCoverImage] = useState(
        group.coverImage ? `/images/${group.coverImage}` : '',
    )
    const [file, setFile] = useState<File>()
    const { sendMessage } = useWebSocketEvents()

    const onChangeGroupPhoto = () => {
        const formData = new FormData()
        if (!file) {
            toast.error('Please select a file')
            return
        }
        formData.append('avatar', file)
        updateGroupCoverImage({ groupId: group.id, formData }).then((res) => {
            if ('status' in res) {
                const errorMessage = res?.message
                toast.error(
                    errorMessage ||
                        'An error occurred updating the group photo.',
                )
            } else {
                toast.success('Group photo updated successfully')
                onCancel()
                dispatch(updateGroupState(res))
                sendMessage('onGroupChatUpdate', { group: res })
            }
        })
    }
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target
        if (files && files.length) {
            const uploadedFile = files.item(0)
            if (uploadedFile) {
                setCoverImage(URL.createObjectURL(uploadedFile))
                setFile(uploadedFile)
            }
        }
    }

    return (
        <ActionMenu
            menuHeading="Change Group Photo"
            menuText="Select a cover image for this group"
            onConfirm={onChangeGroupPhoto}
            onCancel={onCancel}
            confirmText="Submit"
            cancelText="Cancel"
        >
            {coverImage ? (
                <Avatar imgSrc={coverImage} />
            ) : (
                <GroupUserInitials
                    text={group.name || getGroupChatMembers(group)}
                />
            )}
            <SFileUploadInput
                type="file"
                {...register('avatar', {
                    onChange: (e) => {
                        handleFileUpload(e)
                    },
                })}
            />

            <Toaster />
        </ActionMenu>
    )
}

const SFileUploadInput = styled.input`
    outline: none;

    &::file-selector-button {
        border-radius: 0.5rem;
        padding: 0 1rem;
        height: 2.5rem;
        cursor: pointer;
        background-color: transparent;
        border: ${({ theme }) => `2px solid ${theme.colors.blueStrong}`};
        outline: none;
        margin-right: 1rem;

        &:is(:hover, :focus, :focus-within) {
            background: ${({ theme }) => theme.colors.blueStrong};
            color: ${({ theme }) => theme.colors.text.light};
            cursor: pointer;
        }
    }
`
