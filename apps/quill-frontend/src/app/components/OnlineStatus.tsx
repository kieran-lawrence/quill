import styled from 'styled-components'
import { useAppSelector } from '../utils/store'
import { findFriendById } from '../utils/store/friends'

type StatusColour = {
    backgroundColour: string
    borderColour: string
}
export const OnlineStatus = ({ userId }: { userId: number }) => {
    const status = useAppSelector((state) =>
        findFriendById(state.friends, userId),
    )?.onlineStatus

    const colour: StatusColour =
        status === 'online'
            ? { backgroundColour: '#28c469', borderColour: '2px solid #28c469' }
            : status === 'away'
            ? { backgroundColour: '#eba604', borderColour: '2px solid #eba604' }
            : status === 'busy'
            ? { backgroundColour: '#E74C3C', borderColour: '2px solid #E74C3C' }
            : {
                  backgroundColour: 'transparent',
                  borderColour: '2px solid #859293',
              }

    return <SOnlineStatus $status={colour} />
}

const SOnlineStatus = styled.div<{ $status: StatusColour }>`
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: ${({ $status }) => $status.backgroundColour};
    border: ${({ $status }) => $status.borderColour};
    transition: background-color 0.2s;
`
