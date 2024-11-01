import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { Services } from '../../utils/constants'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../utils/typeorm'
import { PassportModule } from '@nestjs/passport'
@Module({
    imports: [TypeOrmModule.forFeature([User]), PassportModule],
    providers: [
        {
            provide: Services.USER,
            useClass: UserService,
        },
    ],
    controllers: [UserController],
    exports: [
        {
            provide: Services.USER,
            useClass: UserService,
        },
    ],
})
export class UserModule {}
