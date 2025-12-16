import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FriendEntity, UserEntity, Services } from '@repo/api'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { AddFriendParams, DeleteFriendParams } from 'src/util/types'

@Injectable()
export class FriendService {
    constructor(
        @InjectRepository(FriendEntity)
        private readonly friendRepository: Repository<FriendEntity>,
        @Inject(Services.USER) private readonly userService: UserService,
    ) {}

    async addFriend({ user, email }: AddFriendParams): Promise<FriendEntity> {
        const userTwo = await this.userService.findUser({ email })
        if (!userTwo)
            throw new NotFoundException(
                'A user with that email does not exist.',
            )
        const friends = await this.isFriends(user.id, userTwo.id)
        if (friends)
            throw new ConflictException(
                'You are already friends with this user!',
            )
        const newFriend = await this.friendRepository.create({
            userOne: user,
            userTwo,
        })
        return this.friendRepository.save(newFriend)
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
