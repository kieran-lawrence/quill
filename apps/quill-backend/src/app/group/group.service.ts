import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { Services } from '../../utils/constants'
import { UserService } from '../user/user.service'
import { Repository } from 'typeorm'
import { GroupChat, GroupMessage } from '../../utils/typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import {
    CreateGroupChatParams,
    DeleteGroupChatParams,
    ModifyGroupChatMemberParams,
    UpdateGroupChatParams,
} from '../../utils/types'

@Injectable()
export class GroupService {
    constructor(
        @Inject(Services.USER) private readonly userService: UserService,
        @InjectRepository(GroupChat)
        private readonly groupChatRepository: Repository<GroupChat>,
        @InjectRepository(GroupMessage)
        private readonly groupMessageRepository: Repository<GroupMessage>,
    ) {}
    async createGroupChat(params: CreateGroupChatParams): Promise<GroupChat> {
        const { name, creator, message: messageContent } = params
        const membersPromise = params.members.map((member) =>
            this.userService.findUser({ email: member }),
        )
        const members = await Promise.all(membersPromise)
        members.push(creator)
        const groupChat = this.groupChatRepository.create({
            name,
            creator,
            members,
        })
        const savedChat = await this.groupChatRepository.save(groupChat)
        if (messageContent) {
            const groupMessage = this.groupMessageRepository.create({
                messageContent,
                groupChat,
                author: creator,
            })
            const savedMessage = await this.groupMessageRepository.save(
                groupMessage,
            )
            await this.update({
                id: savedChat.id,
                lastMessageSent: savedMessage,
            })
        }

        return this.getGroupChatById(savedChat.id)
    }
    getGroupChats(id: number): Promise<GroupChat[]> {
        return this.groupChatRepository
            .createQueryBuilder('groupChat')
            .leftJoinAndSelect('groupChat.members', 'member')
            .leftJoinAndSelect('groupChat.messages', 'messages')
            .where('member.id IN (:members)', { members: id })
            .leftJoinAndSelect('groupChat.members', 'members')
            .leftJoinAndSelect('groupChat.lastMessageSent', 'lastMessageSent')
            .leftJoinAndSelect('groupChat.creator', 'creator')
            .orderBy('groupChat.lastMessageSentAt', 'DESC')
            .getMany()
    }
    getGroupChatById(id: number): Promise<GroupChat> {
        return this.groupChatRepository
            .createQueryBuilder('groupChat')
            .where('groupChat.id = :id', { id })
            .leftJoinAndSelect('groupChat.creator', 'creator')
            .leftJoinAndSelect('groupChat.members', 'members')
            .leftJoinAndSelect('groupChat.messages', 'messages')
            .leftJoinAndSelect('messages.author', 'author')
            .orderBy('messages.createdAt', 'DESC')
            .getOne()
    }
    save(chat: GroupChat): Promise<GroupChat> {
        return this.groupChatRepository.save(chat)
    }
    async update({
        id,
        lastMessageSent,
    }: Partial<GroupChat>): Promise<GroupChat> {
        await this.groupChatRepository.update(id, { lastMessageSent })
        return this.getGroupChatById(id)
    }

    async updateGroup({
        id,
        user,
        name,
        file,
    }: UpdateGroupChatParams): Promise<GroupChat> {
        const group = await this.getGroupChatById(id)
        if (!group) throw new BadRequestException('Group not found')
        if (group.creator.id !== user.id)
            throw new UnauthorizedException(
                'Only the group creator can update the group',
            )
        if (name) group.name = name
        if (file) group.coverImage = file.filename
        return this.groupChatRepository.save(group)
    }

    async removeGroupChatUser({
        groupId,
        userId,
        user,
    }: ModifyGroupChatMemberParams): Promise<GroupChat> {
        const groupChat = await this.getGroupChatById(groupId)
        if (!groupChat) throw new BadRequestException('Group not found')
        const userToRemove = await this.userService.findUser({ id: userId })
        if (!userToRemove) throw new BadRequestException('User not found')
        if (groupChat.creator.id === userToRemove.id)
            throw new BadRequestException(
                'You cannot remove the group creator from the group',
            )
        if (groupChat.creator.id !== user.id)
            throw new BadRequestException(
                'Only the group owner can remove other members',
            )
        if (groupChat.members.length <= 2)
            throw new BadRequestException(
                'Group minimum size has been reached.',
            )
        const updatedMembers = groupChat.members.filter(
            (member) => member.id !== userToRemove.id,
        )
        groupChat.members = updatedMembers
        return this.groupChatRepository.save(groupChat)
    }

    async addGroupChatUsers({
        groupId,
        users,
        user,
    }: ModifyGroupChatMemberParams): Promise<GroupChat> {
        const groupChat = await this.getGroupChatById(groupId)
        if (groupChat.creator.id !== user.id)
            throw new BadRequestException(
                'Only the group owner can add members',
            )
        const userPromise = users.map((user) => {
            if (groupChat.members.find((member) => member.id === user))
                throw new BadRequestException(
                    `User ${user} is already in this group`,
                )
            return this.userService.findUser({ id: user })
        })
        ;(await Promise.all(userPromise)).map((user) =>
            groupChat.members.push(user),
        )
        return this.groupChatRepository.save(groupChat)
    }

    async deleteGroupChat({ groupId, user }: DeleteGroupChatParams) {
        const groupChat = await this.getGroupChatById(groupId)
        if (!groupChat) throw new BadRequestException('Group not found')
        if (groupChat.creator.id !== user.id)
            throw new UnauthorizedException(
                'Only the group owner can delete the group',
            )
        await this.groupChatRepository.update(groupId, {
            lastMessageSent: null,
        })

        return this.groupChatRepository.delete(groupId)
    }
}
