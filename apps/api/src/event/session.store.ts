import { Injectable } from '@nestjs/common'
import { AuthenticatedSocket, ISessionStore } from 'src/util/interfaces'
import { Socket } from 'socket.io'

@Injectable()
export class SessionStore implements ISessionStore {
    private readonly sessions: Map<number, AuthenticatedSocket> = new Map()

    findSession(id: number): Socket {
        return this.sessions.get(id)
    }
    saveSession(id: number, socket: Socket) {
        this.sessions.set(id, socket)
    }
    findAllSessions(): Socket[] {
        return [...this.sessions.values()]
    }
    deleteSession(id: number) {
        this.sessions.delete(id)
    }
}
