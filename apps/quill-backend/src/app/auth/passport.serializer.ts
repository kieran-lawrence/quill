import { Inject } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'
import { UserService } from '../user/user.service'
import { Services } from '../../utils/constants'
import { User } from '../../utils/typeorm'

export class SessionSerializer extends PassportSerializer {
    constructor(
        @Inject(Services.USER) private readonly userService: UserService,
    ) {
        super()
    }

    serializeUser(user: User, done: (err, user: User) => void) {
        done(null, user)
    }
    async deserializeUser(user: User, done: (err, user: User) => void) {
        const userDb = await this.userService.findUser({ id: user.id })
        return done(null, userDb)
    }
}
