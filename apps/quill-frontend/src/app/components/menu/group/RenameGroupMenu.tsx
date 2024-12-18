import styled from 'styled-components'
import { ActionMenu } from '../ActionMenu'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { updateGroup } from '../../../utils/api'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../utils/store'
import { updateGroupState } from '../../../utils/store/groups'

type RenameGroupMenuprops = {
    groupId: number
    onCancel: () => void
}
export const RenameGroupMenu = ({
    groupId,
    onCancel,
}: RenameGroupMenuprops) => {
    const [name, setName] = useState('')
    const dispatch = useDispatch<AppDispatch>()

    const onRenameGroup = () => {
        if (!name) return
        updateGroup({
            groupId,
            name,
        }).then((res) => {
            if ('status' in res) {
                const errorMessage = res?.message
                toast.error(
                    errorMessage || 'An error occurred renaming the group.',
                )
            } else {
                toast.success('Group renamed successfully')
                onCancel()
                dispatch(updateGroupState(res))
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
    background: #f9fafc;
    border-radius: 0.5rem;
    outline: none;
    font-size: 1.1rem;
    width: 100%;
    box-sizing: border-box;
`
