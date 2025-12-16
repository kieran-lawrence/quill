import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { Services } from '@repo/api'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@repo/api'
import { PassportModule } from '@nestjs/passport'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), PassportModule],
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
