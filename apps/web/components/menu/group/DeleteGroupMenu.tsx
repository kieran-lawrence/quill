import { useDispatch } from 'react-redux'
import { deleteGroup } from '../../../utils/api'
import { ActionMenu } from '../ActionMenu'
import toast, { Toaster } from 'react-hot-toast'
import { AppDispatch } from '../../../utils/store'
import { deleteGroupState } from '../../../utils/store/groups'
import { useWebSocketEvents } from '../../../utils/hooks'

type DeleteGroupMenuprops = {
    groupId: number
    onCancel: () => void
}
export const DeleteGroupMenu = ({
    groupId,
    onCancel,
}: DeleteGroupMenuprops) => {
    const dispatch = useDispatch<AppDispatch>()
    const { sendMessage } = useWebSocketEvents()

    const onDeleteGroup = () => {
        deleteGroup(groupId).then((resp) => {
            if ('status' in resp) {
                const errorMessage = resp?.message
                toast.error(
                    errorMessage || 'An error occurred deleting this group.',
                )
            } else {
                toast.success('Group deleted successfully')
                sendMessage('onGroupChatDelete', { groupId })
                dispatch(deleteGroupState(groupId))
                onCancel()
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
