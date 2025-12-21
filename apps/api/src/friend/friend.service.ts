import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
    FriendEntity,
    UserEntity,
    Services,
    FriendRequestEntity,
} from '@repo/api'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { AddFriendParams, DeleteFriendParams } from 'src/util/types'

@Injectable()
export class FriendService {
    constructor(
        @InjectRepository(FriendEntity)
        private readonly friendRepository: Repository<FriendEntity>,
        @InjectRepository(FriendRequestEntity)
        private readonly friendRequestRepository: Repository<FriendRequestEntity>,
        @Inject(Services.USER) private readonly userService: UserService,
    ) {}

    async addFriend({
        user,
        email,
    }: AddFriendParams): Promise<FriendRequestEntity> {
        const userTwo = await this.userService.findUser({ email })
        if (!userTwo)
            throw new NotFoundException(
                'A user with that email does not exist.',
            )

        // Check if already friends
        const friends = await this.isFriends(user.id, userTwo.id)
        if (friends)
            throw new ConflictException(
                'You are already friends with this user!',
            )

        // Check for existing pending friend request
        const existingRequest = await this.friendRequestRepository.findOne({
            where: [
                {
                    requester: { id: user.id },
                    addressee: { id: userTwo.id },
                    status: 'pending',
                },
                {
                    requester: { id: userTwo.id },
                    addressee: { id: user.id },
                    status: 'pending',
                },
            ],
        })
        if (existingRequest) {
            throw new ConflictException(
                'A pending friend request already exists between these users.',
            )
        }

        // Create new friend request
        const friendRequest = this.friendRequestRepository.create({
            requester: user,
            addressee: userTwo,
            status: 'pending',
        })
        return this.friendRequestRepository.save(friendRequest)
    }

    async acceptFriendRequest({
        user,
        id,
    }: {
        user: UserEntity
        id: number
    }): Promise<FriendEntity> {
        const friendRequest = await this.friendRequestRepository.findOne({
            where: { id, addressee: { id: user.id }, status: 'pending' },
            relations: ['requester', 'addressee'],
        })
        if (!friendRequest) {
            throw new NotFoundException('Friend request not found.')
        }

        // Create friendship
        const friendship = this.friendRepository.create({
            userOne: friendRequest.requester,
            userTwo: friendRequest.addressee,
        })
        await this.friendRepository.save(friendship)

        // Update friend request status
        friendRequest.status = 'accepted'
        await this.friendRequestRepository.save(friendRequest)

        return friendship
    }

    async rejectFriendRequest({
        user,
        id,
    }: {
        user: UserEntity
        id: number
    }): Promise<FriendRequestEntity> {
        const friendRequest = await this.friendRequestRepository.findOne({
            where: { id, addressee: { id: user.id }, status: 'pending' },
        })
        if (!friendRequest) {
            throw new NotFoundException('Friend request not found.')
        }

        // Update friend request status
        friendRequest.status = 'rejected'
        return this.friendRequestRepository.save(friendRequest)
    }

    async getFriendRequests(user: UserEntity): Promise<FriendRequestEntity[]> {
        return this.friendRequestRepository.find({
            where: { addressee: { id: user.id }, status: 'pending' },
            relations: ['requester', 'addressee'],
        })
    }

    async deleteFriend({ id, friendId }: DeleteFriendParams) {
        const friends = await this.isFriends(id, friendId)
        if (!friends)
            throw new BadRequestException('You are not friends with this user.')
        await this.friendRepository.delete({ id: friends.id })

        return { id: friendId, friendId: friends.id }
    }

    getFriends(user: UserEntity): Promise<FriendEntity[]> {
        return this.friendRepository.find({
            where: [{ userOne: user }, { userTwo: user }],
            relations: ['userOne', 'userTwo'],
        })
    }

    findFriendById(id: number): Promise<FriendEntity> {
        return this.friendRepository.findOne({
            where: { id },
            relations: ['userOne', 'userTwo'],
        })
    }

    isFriends(userOneId: number, userTwoId: number): Promise<FriendEntity> {
        return this.friendRepository.findOne({
            where: [
                {
                    userOne: { id: userOneId },
                    userTwo: { id: userTwoId },
                },
                {
                    userOne: { id: userTwoId },
                    userTwo: { id: userOneId },
                },
            ],
        })
    }
}
