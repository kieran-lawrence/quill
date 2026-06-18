import { User } from '@repo/api'
import { io, Socket } from 'socket.io-client'

class SocketService {
    private static instance: SocketService
    private socket: Socket | null = null
    private currentUserId: number | null = null

    private constructor() {}

    static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService()
        }
        return SocketService.instance
    }

    connect(user: User | undefined) {
        if (!user) {
            console.warn('[SocketService] No user provided to connect.')
            return null
        }
        if (this.socket && this.currentUserId === user.id) {
            // Already connected as this user
            return this.socket
        }
        if (this.socket) {
            this.disconnect()
        }
        this.currentUserId = user.id
        this.socket = io(process.env.NEXT_PUBLIC_API_URI, {
            withCredentials: true,
            auth: { user },
        })
        this.socket.on('connect_error', (err) => {
            console.error('[SocketService] Connection error:', err)
        })
        return this.socket
    }

    getSocket() {
        if (!this.socket) {
            console.warn(
                '[SocketService] getSocket called but socket is not initialized!',
            )
        }
        return this.socket
    }

    on(event: string, callback: (...args: any[]) => void) {
        this.socket?.on(event, callback)
    }

    off(event: string, callback: (...args: any[]) => void) {
        this.socket?.off(event, callback)
    }

    emit<T>(event: string, data: T) {
        if (!this.socket) {
            console.warn(
                '[SocketService] emit called but socket is not initialized!',
                event,
                data,
            )
        } else {
            this.socket.emit(event, data)
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
            this.currentUserId = null
        }
    }
}

export const socketService = SocketService.getInstance()
