import { useState, useEffect, useCallback, useRef } from 'react'
import { User } from '@quill/data'
import { useGetFriendsQuery } from '../store/friend'
import toast from 'react-hot-toast'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../../contexts/auth'

/** A hook that returns all of a users friends, and allows for searching of friends */
export const useFriends = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const { data, error, isLoading } = useGetFriendsQuery()

    error && toast.error('Failed to fetch friends')
    /** If there is no `searchTerm`, returns all users friends, else returns friends filtered by `searchTerm` */
    const filteredFriends = data
        ? data.reduce<User[]>((filtered, friend) => {
              if (
                  friend.username
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  friend.email
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  friend.firstName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  friend.lastName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
              ) {
                  filtered.push(friend)
              }
              return filtered
          }, [])
        : []

    /** Searches users friends based on search query */
    const filterFriends = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }
    return {
        friends: filteredFriends,
        searchTerm,
        setSearchTerm,
        filterFriends,
        error,
        isLoading,
    }
}

export const useWebSocket = () => {
    const { user } = useAuth()
    const [error, setError] = useState<string | null>()
    const [connected, setConnected] = useState(false)

    // Reference to avoid recreating the socket instance on each render
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        // Initialize WebSocket connection
        if (!socketRef.current) {
            socketRef.current = io('http://localhost:3001', {
                withCredentials: true,
            })
        }
        socketRef.current.connect()
        socketRef.current.auth = { user }
        socketRef.current.on('connect', () => {
            setConnected(true)
            setError(null)
        })

        socketRef.current.on('disconnect', () => {
            setConnected(false)
        })

        socketRef.current.on('error', (err: string) => {
            setError(err)
        })

        // Clean up WebSocket connection on component unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
        }
    }, [user])

    // Sends messages to the WebSocket server
    const sendMessage = useCallback(
        <T extends object>(event: string, data: T) => {
            if (socketRef.current) {
                socketRef.current.emit(event, data)
            }
        },
        [],
    )
    // Listens for messages from the WebSocket server
    const listenForMessage = useCallback(
        <T>(event: string, cb: (data: T) => void) => {
            if (socketRef.current) {
                socketRef.current.on(event, cb)

                // Clean up the event listener on unmount
                return () => {
                    if (socketRef.current) {
                        socketRef.current.off(event, cb)
                    }
                }
            }
        },
        [],
    )

    return {
        connected,
        error,
        sendMessage,
        listenForMessage,
    }
}
