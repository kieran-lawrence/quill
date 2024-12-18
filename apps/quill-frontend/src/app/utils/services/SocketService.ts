import { User } from '@quill/data'
import { io, Socket } from 'socket.io-client'

class SocketService {
    private static instance: SocketService
    private socket: Socket | null = null

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService()
        }
        return SocketService.instance
    }

    connect(user: Partial<User> | undefined) {
        if (!this.socket) {
            this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URI, {
                withCredentials: true,
            })
            this.socket.auth = { user }
        }
        return this.socket
    }

    getSocket() {
        return this.socket
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    emit<T>(event: string, data: T) {
        this.socket?.emit(event, data)
    }
}

export const socketService = SocketService.getInstance()
