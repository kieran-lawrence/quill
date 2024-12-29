import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../contexts/auth'
import { socketService } from '../services/SocketService'
import { useAppSelector } from '../store'
import { filterFriends } from '../store/friends'

/** A hook that returns all of a users friends, and allows for searching of friends */
export const useFriends = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const friends = useAppSelector((state) =>
        filterFriends(state.friends, searchTerm),
    )
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

type DebouncedFunction = (value: string) => void

/**
 * A custom hook that debounces a function call.
 * It delays the execution of the provided callback function until after a specified delay has elapsed
 * since the last time the debounced function was invoked.
 *
 * @param {T} callback - The function to be debounced.
 * @param {number} delay - The delay in milliseconds to wait before invoking the callback.
 * @returns {Function} A function to set the debounced value.
 *
 * @example
 * ```typescript
 * // The function you want to debounce
 * const myFunction = () => {
 *     // Perform some action
 * }
 *
 * // Call the hook with the function and delay
 * const debouncedFunction = useDebounce(myFunction, 500)

 * ```
 */
export const useDebounce = <T extends DebouncedFunction>(
    callback: T,
    delay: number,
) => {
    const [debouncedValue, setDebouncedValue] = useState<string>('')

    useEffect(() => {
        const timeout = setTimeout(() => {
            callback(debouncedValue)
        }, delay)

        return () => clearTimeout(timeout)
    }, [debouncedValue, callback, delay])

    return setDebouncedValue
}
