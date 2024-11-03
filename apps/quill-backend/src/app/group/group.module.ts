import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupChat, GroupMessage } from '../../utils/typeorm'
import { UserModule } from '../user/user.module'
import { GroupController } from './group.controller'
import { Services } from '../../utils/constants'
import { GroupService } from './group.service'

@Module({
    imports: [TypeOrmModule.forFeature([GroupChat, GroupMessage]), UserModule],
    controllers: [GroupController],
    providers: [
        {
            provide: Services.GROUP,
            useClass: GroupService,
        },
    ],
})
export class GroupModule {}
