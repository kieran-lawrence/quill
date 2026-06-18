import { useCall } from '../../contexts/call'
import { Modal } from '../shared/Modal'
import styled from 'styled-components'
import { QuillButton } from '../shared/QuillButton'
import { findFriendById } from '../../utils/store/friends'
import { useAppSelector } from '../../utils/store'
import { useRouter } from 'next/navigation'

interface Props {
    onAccept?: () => void
    onDecline?: () => void
}

export default function IncomingCallModal({ onAccept, onDecline }: Props) {
    const {
        incomingCall,
        callerId,
        setCallActive,
        setIncomingCall,
        endCall,
        callChatId,
    } = useCall()
    const router = useRouter()

    const callerName = useAppSelector((state) =>
        findFriendById(state.friends, callerId ?? 0),
    )

    if (!incomingCall) return null

    const handleAccept = () => {
        setCallActive(true)
        setIncomingCall(false)
        onAccept?.()
        if (callChatId) {
            router.push(`/chats/${callChatId}`)
        }
    }

    const handleDecline = () => {
        endCall()
        onDecline?.()
    }

    return (
        <Modal
            title="Incoming Call"
            onClose={handleDecline}
            modalSize={{ width: 30, height: 30 }}
        >
            <SIncomingCallContent>
                <p>
                    {callerName
                        ? `User ${callerName.firstName} is calling you...`
                        : 'You have an incoming call!'}
                </p>
                <SButtonRow>
                    <QuillButton
                        style="filled"
                        text="Accept"
                        onClick={handleAccept}
                    />
                    <QuillButton
                        style="outlined"
                        text="Decline"
                        onClick={handleDecline}
                    />
                </SButtonRow>
            </SIncomingCallContent>
        </Modal>
    )
}

const SIncomingCallContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    height: 100%;
    font-size: 1.1rem;
`
const SButtonRow = styled.div`
    display: flex;
    gap: 1.5rem;
    width: 100%;
    justify-content: center;
`
