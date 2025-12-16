import { Inject } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'
import { UserService } from '../user/user.service'
import { UserEntity, Services } from '@repo/api'

export class SessionSerializer extends PassportSerializer {
    constructor(
        @Inject(Services.USER) private readonly userService: UserService,
    ) {
        super()
    }

    serializeUser(user: UserEntity, done: (err, user: UserEntity) => void) {
        done(null, user)
    }
    async deserializeUser(
        user: UserEntity,
        done: (err, user: UserEntity) => void,
    ) {
        const userDb = await this.userService.findUser({ id: user.id })
        return done(null, userDb)
    }
}
