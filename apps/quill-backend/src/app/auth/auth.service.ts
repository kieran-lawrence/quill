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
        const user = await this.userService.findUser({ email })
        if (!user) return null
        const isPasswordValid = await compareHash(pass, user.password)
        return isPasswordValid ? user : null
    }
}
