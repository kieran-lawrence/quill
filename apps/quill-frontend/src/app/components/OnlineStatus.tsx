import styled from 'styled-components'
import { useAppSelector } from '../utils/store'
import { findFriendById } from '../utils/store/friends'
import { OnlineStatus as Status } from '@quill/data'

type Props = {
    userId: number
    overrideStatus?: Status
}
export const OnlineStatus = ({ userId, overrideStatus }: Props) => {
    const status = useAppSelector((state) =>
        findFriendById(state.friends, userId),
    )?.onlineStatus

    if (overrideStatus) return <SOnlineStatus $status={overrideStatus} />
    if (!status) return null
    return <SOnlineStatus $status={status} />
}

const SOnlineStatus = styled.div<{ $status: Status }>`
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    box-sizing: border-box;
    background: ${({ $status, theme }) =>
        $status === 'offline'
            ? theme.colors.userStatus.offline.background
            : theme.colors.userStatus[$status]};
    border: ${({ $status, theme }) =>
        $status === 'offline'
            ? `2px solid ${theme.colors.userStatus.offline.border}`
            : `2px solid ${theme.colors.userStatus[$status]}`};
    transition: background-color 0.2s;
`
