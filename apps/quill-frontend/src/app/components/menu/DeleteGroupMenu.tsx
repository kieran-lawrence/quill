import { usePostDeleteGroupChatMutation } from '../../utils/store/groups'
import { NestJSError } from '../../utils/types'
import { ActionMenu } from './ActionMenu'
import toast, { Toaster } from 'react-hot-toast'

type DeleteGroupMenuprops = {
    groupId: number
    onCancel: () => void
}
export const DeleteGroupMenu = ({
    groupId,
    onCancel,
}: DeleteGroupMenuprops) => {
    const [deleteGroup] = usePostDeleteGroupChatMutation()
    const onDeleteGroup = () => {
        deleteGroup(groupId).then((res) => {
            if ('error' in res) {
                const error = res.error as NestJSError
                toast.error(error.data?.message || 'Something went wrong')
            } else {
                toast.success('Group deleted successfully')
                setTimeout(() => {
                    location.reload()
                    onCancel()
                }, 2000)
            }
        })
    }
    return (
        <ActionMenu
            menuHeading="Delete Group"
            menuText="This group and all messages will be permanently deleted. Continue?"
            onConfirm={onDeleteGroup}
            onCancel={onCancel}
            confirmText="Yes"
            cancelText="No"
        >
            <Toaster />
        </ActionMenu>
    )
}
