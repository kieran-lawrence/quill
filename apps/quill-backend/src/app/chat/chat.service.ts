import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Chat, PrivateMessage } from '../../utils/typeorm'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { Services } from '../../utils/constants'
import {
    CreateChatParams,
    FindChatParams,
    UpdateChatParams,
} from '../../utils/types'

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        @Inject(Services.USER) private readonly userService: UserService,
        @InjectRepository(PrivateMessage)
        private readonly messageRepository: Repository<PrivateMessage>,
    ) {}

    async createChat(params: CreateChatParams): Promise<Chat> {
        const { user: creator, email, message: messageContent } = params
        const recipient = await this.userService.findUser({ email })
        const author = await this.userService.findUser({ id: creator.id })
        if (!recipient)
            throw new BadRequestException(
                'A recipient with this email does not exist',
            )

        const exists = await this.findChat({
            userOne: creator,
            userTwo: recipient,
        })
        if (exists) throw new ConflictException('This chat already exists')
        const chat = this.chatRepository.create({ creator, recipient })
        const savedChat = await this.save(chat)
        if (messageContent) {
            const privateMessage = this.messageRepository.create({
                messageContent,
                chat,
                author,
            })
            const savedMessage = await this.messageRepository.save(
                privateMessage,
            )
            await this.update({
                id: savedChat.id,
                lastMessageSent: savedMessage,
            })
        }
        return savedChat
    }
    async getChats(id: number): Promise<Chat[]> {
        return this.chatRepository
            .createQueryBuilder('chat')
            .leftJoinAndSelect('chat.creator', 'creator')
            .leftJoinAndSelect('chat.recipient', 'recipient')
            .leftJoinAndSelect('chat.messages', 'messages')
            .where('creator.id = :id', { id })
            .orWhere('recipient.id = :id', { id })
            .leftJoinAndSelect('chat.lastMessageSent', 'lastMessageSent')
            .orderBy('chat.lastMessageSentAt', 'DESC')
            .getMany()
    }
    async getChatById(id: number): Promise<Chat> {
        return this.chatRepository.findOne({
            where: [{ id }],
            relations: [
                'creator',
                'recipient',
                'messages',
                'messages.author',
                'lastMessageSent',
            ],
        })
    }
    async findChat({ userOne, userTwo }: FindChatParams): Promise<Chat | null> {
        return this.chatRepository.findOne({
            where: [
                {
                    creator: {
                        id: userOne.id,
                        email: userOne.email,
                        username: userOne.username,
                        firstName: userOne.firstName,
                        lastName: userOne.lastName,
                    },
                    recipient: {
                        id: userTwo.id,
                        email: userTwo.email,
                        username: userTwo.username,
                        firstName: userTwo.firstName,
                        lastName: userTwo.lastName,
                    },
                },
                {
                    creator: {
                        id: userTwo.id,
                        email: userTwo.email,
                        username: userTwo.username,
                        firstName: userTwo.firstName,
                        lastName: userTwo.lastName,
                    },
                    recipient: {
                        id: userOne.id,
                        email: userOne.email,
                        username: userOne.username,
                        firstName: userOne.firstName,
                        lastName: userOne.lastName,
                    },
                },
            ],
        })
    }
    async save(chat: Chat): Promise<Chat> {
        return this.chatRepository.save(chat)
    }
    async update({ id, lastMessageSent }: UpdateChatParams) {
        return this.chatRepository.update(id, { lastMessageSent })
    }
}
