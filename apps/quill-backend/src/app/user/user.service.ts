import { ConflictException, Injectable } from '@nestjs/common'
import { User } from '../../utils/typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserParams, FindUserParams } from '../../utils/types'
import { hashPassword } from '../../utils/helpers'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

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
            select: {
                email: true,
                password: true,
            },
            cache: true,
        })
    }
    async createUser(userDetails: CreateUserParams) {
        const userExists = await this.findUser({ email: userDetails.email })
        if (userExists)
            throw new ConflictException(
                'A user with this email address already exists.',
            )
        const password = await hashPassword(userDetails.password)
        const newUser = this.userRepository.create({ ...userDetails, password })
        return this.userRepository.save(newUser)
    }
}
