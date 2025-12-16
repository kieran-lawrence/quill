import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserEntity, Services } from '@repo/api'

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
    ): Promise<Omit<UserEntity, 'password'>> {
        return this.authService.validateUser({ email, password })
    }
}
