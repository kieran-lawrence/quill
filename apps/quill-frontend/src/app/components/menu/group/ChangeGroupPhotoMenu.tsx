import { useState } from 'react'
import { usePostChangeCoverImageMutation } from '../../../utils/store/groups'
import { GroupChat, NestJSError } from '../../../utils/types'
import { ActionMenu } from '../ActionMenu'
import toast, { Toaster } from 'react-hot-toast'
import { Avatar } from '../../Avatar'
import { GroupUserInitials } from '../../GroupUserInitials'
import { getGroupChatMembers } from '../../../utils/helpers'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'

type ChangeGroupPhotoMenuprops = {
    group: GroupChat
    onCancel: () => void
}
export const ChangeGroupPhotoMenu = ({
    group,
    onCancel,
}: ChangeGroupPhotoMenuprops) => {
    const { register } = useForm<{ avatar?: string }>()
    const [updateGroup] = usePostChangeCoverImageMutation()
    const [coverImage, setCoverImage] = useState('')
    const [file, setFile] = useState<File>()

    const onChangeGroupPhoto = () => {
        const formData = new FormData()
        if (!file) {
            toast.error('Please select a file')
            return
        }
        formData.append('avatar', file)
        updateGroup({ groupId: group.id, formData }).then((res) => {
            if ('error' in res) {
                const error = res.error as NestJSError
                toast.error(error.data?.message || 'Something went wrong')
            } else {
                toast.success('Group updated successfully')
                setTimeout(() => {
                    location.reload()
                    onCancel()
                }, 2000)
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
        border: 2px solid #f28140;
        outline: none;
        margin-right: 1rem;

        &:is(:hover, :focus, :focus-within) {
            background: #f281403a;
            cursor: pointer;
        }
    }
`