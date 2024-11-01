import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { Services } from '../../utils/constants'
import { LocalStrategy } from './local.strategy'

@Module({
    imports: [UserModule],
    providers: [
        {
            provide: Services.AUTH,
            useClass: AuthService,
        },
        LocalStrategy,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
