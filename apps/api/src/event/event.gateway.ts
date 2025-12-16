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
import { Services } from '@repo/api'
import {
    CreateGroupMessageResponse,
    GroupChatEntity,
    OnlineStatus,
    DeleteGroupMessageEventParams,
    DeletePrivateMessageEventParams,
    EditGroupMessageEventParams,
    EditPrivateMessageEventParams,
    NewPrivateMessageEventParams,
} from '@repo/api'
import { UserService } from '../user/user.service'
import { UserEntity } from '@repo/api'
import { ChatService } from '../chat/chat.service'
import { AuthenticatedSocket, ISessionStore } from 'src/util/interfaces'

@WebSocketGateway({
    cors: { origin: ['http://localhost:3000'], credentials: true },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private statusChangeTimeouts: Map<number, NodeJS.Timeout> = new Map()

    constructor(
        @Inject(Services.SESSION_STORE)
        private readonly sessions: ISessionStore,
        @Inject(Services.USER) private userService: UserService,
        @Inject(Services.CHAT) private chatService: ChatService,
    ) {}

    @WebSocketServer() server: Server = new Server()

    private emitStatusChange(user: UserEntity, status: OnlineStatus) {
        // Clear any existing timeout for this user
        const existingTimeout = this.statusChangeTimeouts.get(user.id)
        if (existingTimeout) {
            clearTimeout(existingTimeout)
        }

        // Set new timeout
        const timeout = setTimeout(() => {
            // Emit to all active sessions
            this.sessions.findAllSessions().map((s) => {
                const sessionUser = s.handshake.auth.user
                // Broadcast to all users except current user
                if (sessionUser.id !== user.id) {
                    this.server
                        .to(`private-chat-${sessionUser.id}`)
                        .emit('userUpdated', {
                            ...user,
                            onlineStatus: status,
                        })
                }
            })
            this.statusChangeTimeouts.delete(user.id)
        }, 2000) // 30 seconds

        this.statusChangeTimeouts.set(user.id, timeout)
    }

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
            client.join(`private-chat-${client.user.id}`)
            this.sessions.saveSession(client.user.id, client)
            await this.userService.updateUser({
                user: client.user,
                onlineStatus: 'online',
            })
            this.emitStatusChange(client.user, 'online')
        }
    }

    async handleDisconnect(client: AuthenticatedSocket) {
        if (!client.user) return
        this.sessions.deleteSession(client.user.id)
        await this.userService.updateUser({
            user: client.user,
            onlineStatus: 'offline',
        })
        this.emitStatusChange(client.user, 'offline')
    }

    @SubscribeMessage('onUserStatusChange')
    async userStatusChange(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() { status }: { status: OnlineStatus },
    ) {
        if (!client.user) return
        await this.userService.updateUser({
            user: client.user,
            onlineStatus: status,
        })
        this.emitStatusChange(client.user, status)
    }

    @SubscribeMessage('onGroupChatJoin')
    async groupChatJoin(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() { groupId }: { groupId: number },
    ) {
        if (!client.user) return
        client.join(`group-chat-${groupId}`)
    }

    @SubscribeMessage('onGroupChatLeave')
    async leaveGroupChat(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() { groupId }: { groupId: number },
    ) {
        if (!client.user) return
        client.leave(`group-chat-${groupId}`)
    }

    @SubscribeMessage('onPrivateMessageCreation')
    privateMessageEvent(
        @MessageBody()
        { message, chat, recipientId }: NewPrivateMessageEventParams,
    ) {
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

    @SubscribeMessage('onGroupMessageUpdate')
    groupMessageUpdate(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() { groupId, message }: EditGroupMessageEventParams,
    ) {
        if (!client.user) return
        this.server
            .to(`group-chat-${groupId}`)
            .emit('groupMessageUpdated', { groupId, message })
    }

    @SubscribeMessage('onPrivateMessageUpdate')
    async privateMessageUpdate(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody()
        { message, chatId }: EditPrivateMessageEventParams,
    ) {
        if (!client.user) return
        const { creator, recipient } =
            await this.chatService.getChatById(chatId)
        const recipientId =
            client.user.id === creator.id ? recipient.id : creator.id
        this.server
            .to(`private-chat-${recipientId}`)
            .emit('messageUpdated', { chatId, message })
    }

    @SubscribeMessage('onGroupMessageDeletion')
    groupMessageDeleted(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() { groupId, messageId }: DeleteGroupMessageEventParams,
    ) {
        if (!client.user) return
        this.server
            .to(`group-chat-${groupId}`)
            .emit('groupMessageDeleted', { groupId, messageId })
    }

    @SubscribeMessage('onPrivateMessageDeletion')
    async privateMessageDeleted(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody()
        { chatId, messageId }: DeletePrivateMessageEventParams,
    ) {
        if (!client.user) return
        const { creator, recipient } =
            await this.chatService.getChatById(chatId)
        const recipientId =
            client.user.id === creator.id ? recipient.id : creator.id
        this.server
            .to(`private-chat-${recipientId}`)
            .emit('messageDeleted', { chatId, messageId })
    }

    @SubscribeMessage('onUserUpdated')
    userAvatarUpdated(
        @ConnectedSocket() { user }: AuthenticatedSocket,
        @MessageBody() updatedUser: Partial<UserEntity>,
    ) {
        if (!user) return

        // Emit to all active sessions
        this.sessions.findAllSessions().map((s) => {
            const sessionUser = s.handshake.auth.user
            // Broadcast to all users except current user
            if (sessionUser.id !== user.id) {
                this.server
                    .to(`private-chat-${sessionUser.id}`)
                    .emit('userUpdated', updatedUser)
            }
        })
    }

    @SubscribeMessage('onGroupChatUpdate')
    groupChatUpdated(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() { group }: { group: GroupChatEntity },
    ) {
        if (!client.user) return
        this.server.to(`group-chat-${group.id}`).emit('groupChatUpdated', group)
    }

    @SubscribeMessage('onGroupChatDelete')
    groupChatDeleted(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() { groupId }: { groupId: number },
    ) {
        if (!client.user) return
        this.server
            .to(`group-chat-${groupId}`)
            .emit('groupChatDeleted', groupId)
    }
}
