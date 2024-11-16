import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Friend } from '../../utils/typeorm'
import { FriendsController } from './friend.controller'
import { Services } from '../../utils/constants'
import { FriendService } from './friend.service'

@Module({
    imports: [TypeOrmModule.forFeature([Friend]), UserModule],
    providers: [
        {
            provide: Services.FRIEND,
            useClass: FriendService,
        },
    ],
    controllers: [FriendsController],
})
export class FriendModule {}
