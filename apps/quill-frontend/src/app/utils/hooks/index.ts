import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/auth'
import { getFriends } from '../api'
import { socketService } from '../services/SocketService'
import { AppDispatch, useAppSelector } from '../store'
import { useDispatch } from 'react-redux'
import { setFriendState, filterFriends } from '../store/friends'

/** A hook that returns all of a users friends, and allows for searching of friends */
export const useFriends = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const dispatch = useDispatch<AppDispatch>()
    const friends = useAppSelector((state) =>
        filterFriends(state.friends, searchTerm),
    )

    useEffect(() => {
        const fetchFriends = async () => {
            getFriends().then((res) => {
                if ('status' in res) {
                    toast.error('Failed to fetch friends')
                    return
                }
                /**
                 * Transforms the server response into a list of users
                 * This is required because the schema for a Friend is {userOne:User,userTwo:User}
                 * so we need to figure out which is not the current user in the Friend object
                 */
                const friendsResponse = res.friends.map((friend) =>
                    friend?.userOne.id === res.userId
                        ? friend?.userTwo
                        : friend?.userOne,
                )
                dispatch(setFriendState(friendsResponse))
            })
        }
        fetchFriends()
    }, [dispatch])

    return {
        friends,
        searchTerm,
        setSearchTerm,
    }
}

/**
 * A custom hook that manages WebSocket connections.
 * Provides functionality to connect to a WebSocket.
 *
 * @returns {Object} An object containing:
 *   - connected: boolean indicating if the WebSocket is currently connected
 *   - error: string | null containing any connection error message
 *
 * @example
 * ```typescript
 *
 * // Establish WebSocket Connection
 * useWebSocketConnection();
 *
 * // Check WebSocket Connection Status
 * const { connected, error } = useWebSocketConnection();
 *  connected ? console.log('Connected') : console.log('Disconnected');
 *  error ? console.error('Error:', error) : null;
 * ```
 */
export const useWebSocketConnection = () => {
    const [connected, setConnected] = useState(false)
    const [error, setError] = useState<string | null>()
    const { user } = useAuth()

    useEffect(() => {
        const socket = socketService.connect(user)
        socket.on('connect', () => {
            setConnected(true)
            setError(null)
        })

        socket.on('disconnect', () => {
            setConnected(false)
        })

        socket.on('error', (err: string) => {
            setError(err)
        })
    }, [user])

    return { connected, error }
}

/**
 * A custom hook that manages WebSocket communication.
 * Provides functionality to send and listen for WebSocket events.
 *
 * @returns {Object} An object containing:
 *   - sendMessage: function to emit events through the WebSocket
 *   - listenForMessage: function to subscribe to WebSocket events
 *
 * @example
 * ```typescript
 * const {sendMessage, listenForMessage } = useWebSocketEvents();
 *
 * // Send a message
 * sendMessage('eventName', { data: 'value' });
 *
 * // Listen for messages
 * useEffect(() => {
 *   const cleanup = listenForMessage<MessageType>('eventName', (data) => {
 *     // Handle received data
 *   });
 *   return cleanup;
 * }, []);
 * ```
 */
export const useWebSocketEvents = () => {
    const sendMessage = useCallback(
        <T extends object>(event: string, data: T) => {
            socketService.emit(event, data)
        },
        [],
    )

    const listenForMessage = useCallback(
        <T>(event: string, callback: (data: T) => void) => {
            const socket = socketService.getSocket()
            if (socket) {
                socket.on(event, callback)
                return () => {
                    socket.off(event, callback)
                }
            }
        },
        [],
    )

    return { sendMessage, listenForMessage }
}
