import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ChatEntity, PrivateMessageEntity } from '@repo/api'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { Services } from '@repo/api'
import {
    CreateChatParams,
    SearchChatsParams,
    UpdateChatParams,
} from 'src/util/types'

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private readonly chatRepository: Repository<ChatEntity>,
        @Inject(Services.USER) private readonly userService: UserService,
        @InjectRepository(PrivateMessageEntity)
        private readonly messageRepository: Repository<PrivateMessageEntity>,
    ) {}

    async createChat(params: CreateChatParams): Promise<ChatEntity> {
        const { user: creator, email, message: messageContent } = params
        const recipient = await this.userService.findUser({ email })
        const author = await this.userService.findUser({ id: creator.id })
        if (!recipient)
            throw new BadRequestException(
                'A recipient with this email does not exist',
            )

        const exists = await this.getChatByUserId(creator.id, recipient.id)
        if (exists) throw new ConflictException('This chat already exists')
        const chat = this.chatRepository.create({ creator, recipient })
        const savedChat = await this.save(chat)
        if (messageContent) {
            const privateMessage = this.messageRepository.create({
                messageContent,
                chat,
                author,
            })
            const savedMessage =
                await this.messageRepository.save(privateMessage)
            await this.update({
                id: savedChat.id,
                lastMessageSent: savedMessage,
            })
        }
        return savedChat
    }
    /** Gets all chats that the user is part of */
    async getChatsByUserId(id: number): Promise<ChatEntity[]> {
        return this.chatRepository
            .createQueryBuilder('chat')
            .leftJoinAndSelect('chat.creator', 'creator')
            .leftJoinAndSelect('chat.recipient', 'recipient')
            .leftJoinAndSelect('chat.messages', 'messages')
            .leftJoinAndSelect('messages.author', 'author')
            .where('creator.id = :id', { id })
            .orWhere('recipient.id = :id', { id })
            .leftJoinAndSelect('chat.lastMessageSent', 'lastMessageSent')
            .orderBy('messages.createdAt', 'DESC')
            .getMany()
    }
    /** Gets a single chat between two users */
    async getChatByUserId(userOneId, userTwoId): Promise<ChatEntity> {
        return this.chatRepository.findOne({
            where: [
                {
                    creator: { id: userOneId },
                    recipient: { id: userTwoId },
                },
                {
                    creator: { id: userTwoId },
                    recipient: { id: userOneId },
                },
            ],
        })
    }
    /** Gets any chats matching the query that the user is a part of */
    async searchChatsQuery({
        userOneId,
        userTwo,
    }: SearchChatsParams): Promise<ChatEntity[]> {
        return this.chatRepository
            .createQueryBuilder('chat')
            .leftJoinAndSelect('chat.creator', 'creator')
            .leftJoinAndSelect('chat.recipient', 'recipient')
            .leftJoinAndSelect('chat.messages', 'messages')
            .where('creator.id = :id', { id: userOneId })
            .orWhere('recipient.id = :id', { id: userOneId })
            .orWhere('creator.username = :username', {
                username: userTwo.username,
            })
            .orWhere('recipient.username = :username', {
                username: userTwo.username,
            })
            .orWhere('creator.email = :email', { email: userTwo.email })
            .orWhere('recipient.email = :email', { email: userTwo.email })
            .leftJoinAndSelect('chat.lastMessageSent', 'lastMessageSent')
            .orderBy('chat.lastMessageSentAt', 'DESC')
            .getMany()
    }
    /** Gets a single chat based on its ID */
    async getChatById(id: number): Promise<ChatEntity> {
        return this.chatRepository
            .createQueryBuilder('chat')
            .where('chat.id = :id', { id })
            .leftJoinAndSelect('chat.creator', 'creator')
            .leftJoinAndSelect('chat.recipient', 'recipient')
            .leftJoinAndSelect('chat.messages', 'messages')
            .leftJoinAndSelect('messages.author', 'author')
            .orderBy('messages.createdAt', 'DESC')
            .getOne()
    }
    /** Get the chat without all the relations */
    async getChatOnly(id: number): Promise<ChatEntity> {
        return this.chatRepository.findOne({
            where: [{ id }],
            relations: ['creator', 'recipient'],
        })
    }
    async save(chat: ChatEntity): Promise<ChatEntity> {
        return this.chatRepository.save(chat)
    }
    async update({ id, lastMessageSent }: UpdateChatParams) {
        return this.chatRepository.update(id, { lastMessageSent })
    }
}
