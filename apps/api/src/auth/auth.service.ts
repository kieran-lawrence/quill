import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { Services } from '@repo/api'
import { compareHash } from 'src/util/helpers'
import { ValidateUserParams } from 'src/util/types'

@Injectable()
export class AuthService {
    constructor(
        @Inject(Services.USER) private readonly userService: UserService,
    ) {}

    async validateUser(params: ValidateUserParams) {
        const user = await this.userService.validateUser({
            email: params.email,
        })
        if (!user)
            throw new UnauthorizedException(
                'Username or password is incorrect.',
            )
        const isPasswordValid = await compareHash(
            params.password,
            user.password,
        )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user
        return isPasswordValid ? result : null
    }
}
