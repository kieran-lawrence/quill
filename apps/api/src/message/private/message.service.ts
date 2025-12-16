import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PrivateMessageEntity, Services } from '@repo/api'
import { Repository } from 'typeorm'
import { ChatService } from '../../chat/chat.service'
import {
    CreatePrivateMessageParams,
    DeletePrivateMessageParams,
    EditPrivateMessageParams,
    SearchChatParams,
} from 'src/util/types'
import {
    CreatePrivateMessageResponse,
    EditPrivateMessageResponse,
} from '@repo/api'

@Injectable()
export class PrivateMessageService {
    constructor(
        @InjectRepository(PrivateMessageEntity)
        private readonly messageRepository: Repository<PrivateMessageEntity>,
        @Inject(Services.CHAT) private readonly chatService: ChatService,
    ) {}

    async createPrivateMessage({
        messageContent,
        chatId,
        user: author,
        image,
    }: CreatePrivateMessageParams): Promise<CreatePrivateMessageResponse> {
        if (!messageContent && !image)
            throw new BadRequestException(
                'Message content or image is required',
            )
        const chat = await this.chatService.getChatOnly(chatId)
        if (!chat) throw new BadRequestException('Chat not found')
        const { creator, recipient } = chat
        if (creator.id !== author.id && recipient.id !== author.id)
            throw new UnauthorizedException('You are not a part of this chat!')
        const privateMessage = this.messageRepository.create({
            messageContent: image ? image.filename : messageContent,
            chat,
            author,
        })
        const savedMessage = await this.messageRepository.save(privateMessage)
        chat.lastMessageSent = savedMessage
        await this.chatService.update(chat)
        return { message: privateMessage, chat }
    }
    getPrivateMessages(id: number): Promise<PrivateMessageEntity[]> {
        return this.messageRepository.find({
            relations: ['author', 'chat'],
            where: { chat: { id } },
            order: { createdAt: 'DESC' },
        })
    }
    getPrivateMessageById(id: number): Promise<PrivateMessageEntity> {
        return this.messageRepository.findOne({
            relations: ['author', 'chat.lastMessageSent'],
            where: { id },
        })
    }
    async editPrivateMessage({
        user,
        id,
        messageContent,
    }: EditPrivateMessageParams): Promise<EditPrivateMessageResponse> {
        const message = await this.getPrivateMessageById(id)
        if (!message) throw new BadRequestException('Message not found!')
        if (message.author.id !== user.id)
            throw new BadRequestException(
                'You cannot edit another users message!',
            )
        message.messageContent = messageContent
        const newMessage = await this.messageRepository.save(message)
        const updatedChat = await this.chatService.getChatById(
            newMessage.chat.id,
        )
        return { messageId: id, message: newMessage, updatedChat }
    }
    async deletePrivateMessage({ id, user }: DeletePrivateMessageParams) {
        const message = await this.getPrivateMessageById(id)
        const { chat } = message
        if (!message) throw new BadRequestException('Message not found!')
        if (message.author.id !== user.id)
            throw new BadRequestException(
                'You cannot delete another users message!',
            )

        if (chat.lastMessageSent.id !== id) {
            await this.messageRepository.delete(id)
        } else {
            const chatToUpdate = await this.chatService.getChatById(chat.id)
            if (chatToUpdate.messages.length <= 1) {
                await this.chatService.update({
                    id: chat.id,
                    lastMessageSent: null,
                })
                return this.messageRepository.delete({ id })
            } else {
                const newLastMessage = chatToUpdate.messages[1]
                await this.chatService.update({
                    id: chat.id,
                    lastMessageSent: newLastMessage,
                })
                return this.messageRepository.delete({ id })
            }
        }
    }
    async searchMessages({ id, query }: SearchChatParams) {
        return this.messageRepository
            .createQueryBuilder('privateMessage')
            .leftJoinAndSelect('privateMessage.author', 'author')
            .where('LOWER(privateMessage.messageContent) LIKE :query', {
                query: `%${query.toLowerCase()}%`,
            })
            .andWhere('privateMessage.chat = :id', { id })
            .orderBy('privateMessage.createdAt', 'DESC')
            .getMany()
    }
}
