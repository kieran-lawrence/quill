import { Inject, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { User } from '../../utils/typeorm'
import { compareHash } from '../../utils/helpers'
import { Services } from '../../utils/constants'

@Injectable()
export class AuthService {
    constructor(
        @Inject(Services.USER) private readonly userService: UserService,
    ) {}

    async validateUser(
        email: string,
        pass: string,
    ): Promise<Omit<User, 'password'> | null> {
        const user = await this.userService.validateUser({ email })
        if (!user) return null
        const userDb = await this.userService.findUser({ id: user.id })
        const isPasswordValid = await compareHash(pass, user.password)
        return isPasswordValid ? userDb : null
    }
}
