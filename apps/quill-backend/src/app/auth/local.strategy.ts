import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Services } from '../../utils/constants'
import { User } from '../../utils/typeorm'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(Services.AUTH) private readonly authService: AuthService,
    ) {
        super({ usernameField: 'email' })
    }

    async validate(
        email: string,
        password: string,
    ): Promise<Omit<User, 'password'>> {
        const user = await this.authService.validateUser(email, password)
        if (!user) {
            throw new UnauthorizedException(
                'Username or password is incorrect.',
            )
        }
        return user
    }
}
