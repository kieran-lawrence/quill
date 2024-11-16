import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { User } from '../../utils/typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
    CreateUserParams,
    FindUserParams,
    UpdateUserParams,
} from '../../utils/types'
import { hashPassword } from '../../utils/helpers'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async validateUser({
        id,
        email,
        username,
    }: FindUserParams): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: {
                id: id,
                email: email,
                username: username,
            },
            select: ['id', 'email', 'username', 'password'],
        })
    }
    async findUser({
        id,
        email,
        username,
    }: FindUserParams): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: {
                id: id,
                email: email,
                username: username,
            },
        })
    }
    async createUser(userDetails: CreateUserParams): Promise<Partial<User>> {
        const userExists = await this.findUser({ email: userDetails.email })
        if (userExists)
            throw new ConflictException(
                'A user with this email address already exists.',
            )
        const password = await hashPassword(userDetails.password)
        const newUser = this.userRepository.create({ ...userDetails, password })
        return this.userRepository.save(newUser)
    }
    async updateUser({ user, data, avatar }: UpdateUserParams): Promise<User> {
        const userExists = await this.findUser({ id: user.id })
        if (!user) throw new NotFoundException('Unable to find user')
        if (avatar && avatar.filename) userExists.avatar = avatar.filename
        if (data.firstName) userExists.firstName = data.firstName
        if (data.lastName) userExists.lastName = data.lastName
        if (data.avatar) userExists.avatar = data.avatar
        return this.userRepository.save(userExists)
    }
}
