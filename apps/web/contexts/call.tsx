import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
    useRef,
} from 'react'
import { useWebSocketConnection, useWebSocketEvents } from '../utils/hooks' // Adjust path as needed
import Peer, { SignalData } from 'simple-peer'
import { OnCallSignalEventResponse, PrivateCallSocketEvent } from '@repo/api'
import { useMediaStream } from '../utils/hooks/useMediaStream'

type CallContextType = {
    remoteSignal: SignalData | null
    setRemoteSignal: React.Dispatch<React.SetStateAction<SignalData | null>>
    incomingCall: boolean
    setIncomingCall: React.Dispatch<React.SetStateAction<boolean>>
    callActive: boolean
    setCallActive: React.Dispatch<React.SetStateAction<boolean>>
    initiator: boolean
    setInitiator: React.Dispatch<React.SetStateAction<boolean>>
    callChatId: number | null
    setCallChatId: React.Dispatch<React.SetStateAction<number | null>>
    callerId: number | null
    setCallerId: React.Dispatch<React.SetStateAction<number | null>>
    startCall: (chatId: number, userId: number) => void
    sendSignal: (props: PrivateCallSocketEvent) => void
    endCall: () => void
    remoteStream: MediaStream | null
    error: string | null
}
const CallContext = createContext<CallContextType | null>(null)

export const useCall = () => {
    const context = useContext(CallContext)
    if (!context) {
        throw new Error('useCall must be used within a CallProvider')
    }
    return context
}

type Props = { children: ReactNode }

export const CallProvider = ({ children }: Props) => {
    const [remoteSignal, setRemoteSignal] = useState<SignalData | null>(null)
    const [incomingCall, setIncomingCall] = useState(false)
    const [callActive, setCallActive] = useState(false)
    const [pendingCall, setPendingCall] = useState<{
        chatId: number
        userId: number
    } | null>(null)
    const [initiator, setInitiator] = useState(false)
    const [callChatId, setCallChatId] = useState<number | null>(null)
    const [callerId, setCallerId] = useState<number | null>(null)
    const { connected } = useWebSocketConnection()
    const { sendMessage, listenForMessage } = useWebSocketEvents()

    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
    const [error, setError] = useState<string | null>(null)
    const peerRef = useRef<Peer.Instance | null>(null)
    const { mediaStream } = useMediaStream({
        audio: false,
        video: false,
    })

    // Function to handle sending a signal
    const sendSignal = useCallback(
        (props: PrivateCallSocketEvent) => {
            console.log('Sending call signal:', props)
            sendMessage('onCallSignal', props)
        },
        [sendMessage],
    )

    // Manage Peer instance and events
    useEffect(() => {
        if (!mediaStream) {
            console.error('No media stream available yet')
            return
        }

        // Initiator: Outgoing call
        if (initiator && pendingCall) {
            const { chatId, userId } = pendingCall
            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream: mediaStream,
                config: {
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
                },
            })
            peerRef.current = peer

            peer.on('signal', (signal: SignalData) => {
                // Use userId from pendingCall for the first signal
                console.log(
                    `Sending signal of type ${signal.type} to user ID:`,
                    userId,
                )
                sendSignal({
                    signal,
                    toUserId: userId,
                    type: 'privateCall',
                })
            })

            peer.on('stream', (remote: MediaStream) => {
                setRemoteStream(remote)
                console.log('Received remote stream:', remote)
            })

            peer.on('error', (err) => {
                setError(err.message || 'Peer error')
            })

            setPendingCall(null)

            return () => {
                peer.destroy()
                peerRef.current = null
                setRemoteStream(null)
            }
        }

        // Receiver: Incoming call (create peer when remoteSignal is present)
        if (!initiator && incomingCall && remoteSignal) {
            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream: mediaStream,
                config: {
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
                },
            })
            peerRef.current = peer

            peer.on('signal', (signal: SignalData) => {
                // Use callerId (the initiator's userId) for the answer
                if (callerId !== null) {
                    console.log(
                        `Sending answer signal of type ${signal.type} to user ID:`,
                        callerId,
                    )
                    sendSignal({
                        signal,
                        toUserId: callerId,
                        type: 'privateCall',
                    })
                } else {
                    console.error(
                        'Caller ID is null, cannot send answer signal',
                    )
                }
            })

            peer.on('stream', (remote: MediaStream) => {
                setRemoteStream(remote)
                console.log('Received remote stream:', remote)
            })

            peer.on('error', (err) => {
                setError(err.message || 'Peer error')
            })

            // Signal the peer with the offer
            try {
                peer.signal(remoteSignal)
            } catch {
                setError('Failed to signal peer (receiver)')
            }

            return () => {
                peer.destroy()
                peerRef.current = null
                setRemoteStream(null)
            }
        }
    }, [
        mediaStream,
        initiator,
        callChatId,
        callerId,
        sendSignal,
        incomingCall,
        pendingCall,
        remoteSignal,
    ])

    // When remote signal arrives, signal the peer
    useEffect(() => {
        if (remoteSignal && peerRef.current) {
            try {
                peerRef.current.signal(remoteSignal)
            } catch {
                setError('Failed to signal peer')
            }
        }
    }, [remoteSignal])

    const handleOnCallSignal = useCallback(
        (data: OnCallSignalEventResponse) => {
            setRemoteSignal(data.signal)
            setIncomingCall(true)
            setInitiator(false)
            setCallerId(data.userId)
            console.log('Call signal received from user ID:', data.userId)
        },
        [],
    )

    useEffect(() => {
        if (!connected) return
        const cleanup = listenForMessage<{ userId: number }>(
            'callInitiated',
            (data) => {
                setIncomingCall(true)
                setCallerId(data.userId)
                // Optionally, set callActive to false and initiator to false here
                console.log('Incoming call started from user ID:', data.userId)
            },
        )
        return cleanup
    }, [listenForMessage, connected])

    // Listen for incoming call signals
    useEffect(() => {
        if (!connected) return
        const cleanup = listenForMessage<OnCallSignalEventResponse>(
            'callSignalled',
            handleOnCallSignal,
        )
        console.log('Listening for callSignalled events')
        return cleanup
    }, [listenForMessage, handleOnCallSignal, connected])

    /** Starts a call (as the initiator) */
    const startCall = useCallback(
        (chatId: number, userId: number) => {
            setInitiator(true)
            setCallChatId(chatId)
            setCallActive(true)
            setIncomingCall(false)
            setRemoteSignal(null)
            setCallerId(null)
            setPendingCall({ chatId, userId }) // <-- set pending call
            sendMessage('onCallStart', { toUserId: userId })
        },
        [sendMessage],
    )

    // Function to end/reset the call
    const endCall = useCallback(() => {
        setCallActive(false)
        setIncomingCall(false)
        setRemoteSignal(null)
        setInitiator(false)
        setCallChatId(null)
        setCallerId(null)

        if (peerRef.current) {
            peerRef.current.destroy()
            peerRef.current = null
        }
    }, [])

    return (
        <CallContext.Provider
            value={{
                remoteSignal,
                setRemoteSignal,
                incomingCall,
                setIncomingCall,
                callActive,
                setCallActive,
                initiator,
                setInitiator,
                callChatId,
                setCallChatId,
                callerId,
                setCallerId,
                startCall,
                sendSignal,
                endCall,
                remoteStream,
                error,
            }}
        >
            {children}
        </CallContext.Provider>
    )
}
