import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { GroupMessage } from '../../../utils/typeorm'
import { Repository } from 'typeorm'
import { Services } from '../../../utils/constants'
import { GroupService } from '../../group/group.service'
import {
    CreateGroupMessageParams,
    EditGroupMessageParams,
    DeleteGroupMessageParams,
} from '../../../utils/types'
import {
    CreateGroupMessageResponse,
    EditGroupMessageResponse,
} from '@quill/data'

@Injectable()
export class GroupMessageService {
    constructor(
        @InjectRepository(GroupMessage)
        private readonly groupMessageRepository: Repository<GroupMessage>,
        @Inject(Services.GROUP)
        private readonly groupService: GroupService,
    ) {}

    async createGroupMessage({
        messageContent,
        groupId,
        user: author,
    }: CreateGroupMessageParams): Promise<CreateGroupMessageResponse> {
        const groupChat = await this.groupService.getGroupChatById(groupId)
        if (!groupChat) throw new BadRequestException('Group chat not found')
        if (!groupChat.members.find((member) => member.id === author.id))
            throw new BadRequestException(
                'You are not a part of this group chat',
            )
        const groupMessage = this.groupMessageRepository.create({
            messageContent,
            groupChat,
            author,
        })
        const savedMessage = await this.groupMessageRepository.save(
            groupMessage,
        )
        groupChat.lastMessageSent = savedMessage
        const updatedChat = await this.groupService.update(groupChat)
        const savedGroupMessage = await this.getGroupMessageById(
            groupMessage.id,
        )
        return { message: savedGroupMessage, chat: updatedChat }
    }
    getGroupMessages(id: number): Promise<GroupMessage[]> {
        return this.groupMessageRepository.find({
            relations: ['author', 'groupChat'],
            where: { groupChat: { id } },
            order: { createdAt: 'DESC' },
        })
    }
    getGroupMessageById(id: number): Promise<GroupMessage> {
        return this.groupMessageRepository.findOne({
            relations: [
                'author',
                'groupChat.creator',
                'groupChat.lastMessageSent',
                'groupChat.members',
            ],
            where: { id },
        })
    }
    async editGroupMessage({
        user,
        id,
        messageContent,
    }: EditGroupMessageParams): Promise<EditGroupMessageResponse> {
        const groupMessage = await this.getGroupMessageById(id)
        if (!groupMessage)
            throw new BadRequestException('Group message not found')
        if (groupMessage.author.id !== user.id)
            throw new BadRequestException(
                'You cannot edit another users message!',
            )
        groupMessage.messageContent = messageContent
        const newGroupMessage = await this.groupMessageRepository.save(
            groupMessage,
        )
        const updatedChat = await this.groupService.getGroupChatById(
            newGroupMessage.groupChat.id,
        )
        return { messageId: id, message: newGroupMessage, updatedChat }
    }
    async deleteGroupMessage({ id, user }: DeleteGroupMessageParams) {
        const groupMessage = await this.getGroupMessageById(id)
        const { groupChat } = groupMessage

        if (!groupMessage)
            throw new BadRequestException('Group message not found')

        if (groupChat.creator.id !== user.id) {
            if (groupMessage.author.id !== user.id)
                throw new BadRequestException(
                    'Only the message author or group owner can delete messages!',
                )
        }

        // Check if the last message sent in this group is the message we are trying to delete
        if (groupChat.lastMessageSent.id !== groupMessage.id) {
            await this.groupMessageRepository.delete({ id: groupMessage.id }) // No foreign key restraints, lets just delete the message
        } else {
            // If the last message sent is the message we are trying to delete, we need to update the last message sent in the group chat

            const group = await this.groupService.getGroupChatById(groupChat.id)

            // If we only have 1 group message, set lastMessageSent to null
            if (group.messages.length <= 1) {
                await this.groupService.update({
                    id: groupChat.id,
                    lastMessageSent: null,
                })
                return this.groupMessageRepository.delete({
                    id: groupMessage.id,
                })
                // If we have at least 2 group messages, set lastMessageSent to the second most recent
            } else {
                // Most recent message is always at index 0, so we need to add 1 to get the next most recent message
                const newLastMessage = group.messages[1]

                await this.groupService.update({
                    id: groupChat.id,
                    lastMessageSent: newLastMessage,
                })
                return this.groupMessageRepository.delete({
                    id: groupMessage.id,
                })
            }
        }
    }
}
