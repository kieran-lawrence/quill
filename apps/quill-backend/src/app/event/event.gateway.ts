import {
    WebSocketGateway,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets'
import { Inject } from '@nestjs/common'
import { Server } from 'socket.io'
import { AuthenticatedSocket, ISessionStore } from '../../utils/interfaces'
import { Services } from '../../utils/constants'
import { CreateGroupMessageResponse } from '@quill/data'
import { NewPrivateMessageEventParams } from '@quill/socket'
import { UserService } from '../user/user.service'

@WebSocketGateway({
    cors: { origin: ['http://localhost:3000'], credentials: true },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(Services.SESSION_STORE)
        private readonly sessions: ISessionStore,
        @Inject(Services.USER) private userService: UserService,
    ) {}

    @WebSocketServer() server: Server = new Server()

    async handleConnection(client: AuthenticatedSocket) {
        this.server.use((socket: AuthenticatedSocket, next) => {
            const user = socket.handshake.auth.user
            if (!user) {
                return next(new Error('invalid username'))
            }
            socket.user = user
            next()
        })

        if (client.user) {
            console.log(
                `User: ${client.user.firstName} connected to room: private-chat-${client.user.id}`,
            )
            client.join(`private-chat-${client.user.id}`)
            this.sessions.saveSession(client.user.id, client)
            await this.userService.updateUser({
                user: client.user,
                onlineStatus: 'online',
            })
        }
    }

    async handleDisconnect(client: AuthenticatedSocket) {
        if (!client.user) return
        this.sessions.deleteSession(client.user.id)
        await this.userService.updateUser({
            user: client.user,
            onlineStatus: 'offline',
        })
    }

    @SubscribeMessage('onGroupChatJoin')
    async groupChatJoin(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() { chatId }: { chatId: number },
    ) {
        if (!client.user) return
        client.join(`group-chat-${chatId}`)
    }

    @SubscribeMessage('onPrivateMessageCreation')
    privateMessageEvent(
        @MessageBody()
        { message, chat, recipientId }: NewPrivateMessageEventParams,
    ) {
        console.log(`Sending message to room: private-chat-${recipientId}`)
        this.server
            .to(`private-chat-${recipientId}`)
            .emit('messageReceived', { message, chat })
    }

    @SubscribeMessage('onGroupMessageCreation')
    groupMessageEvent(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() { chat, message }: CreateGroupMessageResponse,
    ) {
        if (!client.user) return
        this.server
            .to(`group-chat-${chat.id}`)
            .emit('groupMessageReceived', { message, chat })
    }
}
