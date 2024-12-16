import { User } from './typeorm'
import { Socket } from 'socket.io'

export interface AuthenticatedSocket extends Socket {
    user?: User
}

export interface ISessionStore {
    findSession(id: number): Socket
    saveSession(id: number, socket: Socket)
    findAllSessions(): Socket[]
    deleteSession(id: number)
}
