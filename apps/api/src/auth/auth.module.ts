import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { Services } from '@repo/api'
import { LocalStrategy } from './local.strategy'
import { SessionSerializer } from './passport.serializer'

@Module({
    imports: [UserModule],
    providers: [
        {
            provide: Services.AUTH,
            useClass: AuthService,
        },
        LocalStrategy,
        SessionSerializer,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
