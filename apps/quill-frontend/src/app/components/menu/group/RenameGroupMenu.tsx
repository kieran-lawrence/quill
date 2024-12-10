import styled from 'styled-components'
import { usePostUpdateGroupChatMutation } from '../../../utils/store/groups'
import { ActionMenu } from '../ActionMenu'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { NestJSError } from '../../../utils/types'

type RenameGroupMenuprops = {
    groupId: number
    onCancel: () => void
}
export const RenameGroupMenu = ({
    groupId,
    onCancel,
}: RenameGroupMenuprops) => {
    const [updateGroup] = usePostUpdateGroupChatMutation()
    const [name, setName] = useState('')
    const onRenameGroup = () => {
        if (!name) return
        updateGroup({
            groupId,
            name,
        }).then((res) => {
            if ('error' in res) {
                const error = res.error as NestJSError
                toast.error(error.data?.message || 'Something went wrong')
            } else {
                toast.success('Group renamed successfully')
                setTimeout(() => {
                    location.reload()
                    onCancel()
                }, 2000)
            }
        })
    }
    return (
        <ActionMenu
            menuHeading="Rename Group"
            menuText="Enter the new name for this group"
            onConfirm={onRenameGroup}
            onCancel={onCancel}
            confirmText="Rename"
            cancelText="Cancel"
        >
            <SRenameGroupInput
                type="text"
                value={name}
                placeholder="Group Name"
                onChange={(e) => setName(e.target.value)}
            />
            <Toaster />
        </ActionMenu>
    )
}

const SRenameGroupInput = styled.input`
    padding: 0.4rem 0.8rem;
    border: none;
    background: #f2f2f2;
    border-radius: 0.5rem;
    outline: none;
    font-size: 1.1rem;
    width: 100%;
    box-sizing: border-box;
`
