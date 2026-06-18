import Peer, { SignalData } from 'simple-peer'
import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook to manage a simple-peer WebRTC connection for audio/video calls.
 * Handles peer creation, signaling, and remote stream events.
 *
 * @param {object} params
 * @param {boolean} params.initiator - true if this user is starting the call
 * @param {MediaStream | null} params.stream - local media stream
 * @param {(signal: SignalData) => void} params.onSignal - callback to send signal data to remote peer
 * @param {SignalData | null} params.remoteSignal - signal data received from remote peer
 * @returns {object} { peer, remoteStream, error }
 */
export const useSimplePeer = ({
    initiator,
    stream,
    onSignal,
    remoteSignal,
}: {
    initiator: boolean
    stream: MediaStream | null
    onSignal: (signal: SignalData) => void
    remoteSignal: SignalData | null
}) => {
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
    const [error, setError] = useState<string | null>(null)
    const peerRef = useRef<Peer.Instance | null>(null)

    useEffect(() => {
        if (!stream) return
        const peer = new Peer({
            initiator,
            trickle: false,
            stream,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' }, // default STUN
                    // For production, add a TURN server for reliability:
                    // { urls: 'turn:your.turn.server:3478', username: 'user', credential: 'pass' }
                ],
            },
        })
        peerRef.current = peer

        peer.on('signal', (data: SignalData) => {
            onSignal(data)
        })

        peer.on('stream', (remote: MediaStream) => {
            setRemoteStream(remote)
        })

        peer.on('error', (err) => {
            setError(err.message || 'Peer error')
        })

        return () => {
            peer.destroy()
            peerRef.current = null
        }
        // Only re-run if stream or initiator changes
    }, [initiator, stream, onSignal])

    // When remote signal arrives, signal the peer
    useEffect(() => {
        if (remoteSignal && peerRef.current) {
            peerRef.current.signal(remoteSignal)
        }
    }, [remoteSignal])

    return { peer: peerRef.current, remoteStream, error }
}
