import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets'
import { Inject } from '@nestjs/common'
import { Server } from 'socket.io'
import { AuthenticatedSocket, ISessionStore } from '../../utils/interfaces'
import { Services } from '../../utils/constants'

@WebSocketGateway({
    cors: { origin: ['http://localhost:3000'], credentials: true },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(Services.SESSION_STORE)
        private readonly sessions: ISessionStore,
    ) {}

    @WebSocketServer() server: Server = new Server()

    handleConnection(client: AuthenticatedSocket) {
        this.server.use((socket: AuthenticatedSocket, next) => {
            const user = socket.handshake.auth.user
            if (!user) {
                return next(new Error('invalid username'))
            }
            socket.user = user
            next()
        })

        if (client.user) {
            client.join(`private-chat-${client.user.id}`)
            this.sessions.saveSession(client.user.id, client)
        }
    }

    handleDisconnect(client: AuthenticatedSocket) {
        if (client.user) this.sessions.deleteSession(client.user.id)
    }
}
