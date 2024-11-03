import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Friend, User } from '../../utils/typeorm'
import { Repository } from 'typeorm'
import { Services } from '../../utils/constants'
import { UserService } from '../user/user.service'
import { AddFriendParams, DeleteFriendParams } from '../../utils/types'

@Injectable()
export class FriendService {
    constructor(
        @InjectRepository(Friend)
        private readonly friendRepository: Repository<Friend>,
        @Inject(Services.USER) private readonly userService: UserService,
    ) {}

    async addFriend({ user, email }: AddFriendParams): Promise<Friend> {
        const userTwo = await this.userService.findUser({ email })
        if (!userTwo) throw new NotFoundException('User does not exist')
        const friends = await this.isFriends(user.id, userTwo.id)
        if (friends) throw new ConflictException('Already friends')
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

    getFriends(user: User): Promise<Friend[]> {
        return this.friendRepository.find({
            where: [{ userOne: user }, { userTwo: user }],
            relations: ['userOne', 'userTwo'],
        })
    }

    findFriendById(id: number): Promise<Friend> {
        return this.friendRepository.findOne({
            where: { id },
            relations: ['userOne', 'userTwo'],
        })
    }

    isFriends(userOneId: number, userTwoId: number): Promise<Friend> {
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
