import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
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
        return this.authService.validateUser({ email, password })
    }
}
