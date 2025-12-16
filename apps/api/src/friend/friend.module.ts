import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FriendEntity, Services } from '@repo/api'
import { FriendsController } from './friend.controller'
import { FriendService } from './friend.service'

@Module({
    imports: [TypeOrmModule.forFeature([FriendEntity]), UserModule],
    providers: [
        {
            provide: Services.FRIEND,
            useClass: FriendService,
        },
    ],
    controllers: [FriendsController],
})
export class FriendModule {}
