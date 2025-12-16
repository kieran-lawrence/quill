import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupChatEntity, GroupMessageEntity } from '@repo/api'
import { UserModule } from '../user/user.module'
import { GroupController } from './group.controller'
import { Services } from '@repo/api'
import { GroupService } from './group.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([GroupChatEntity, GroupMessageEntity]),
        UserModule,
    ],
    controllers: [GroupController],
    providers: [
        {
            provide: Services.GROUP,
            useClass: GroupService,
        },
    ],
    exports: [
        {
            provide: Services.GROUP,
            useClass: GroupService,
        },
    ],
})
export class GroupModule {}
