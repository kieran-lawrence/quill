import { Module } from '@nestjs/common'
import { GroupMessageService } from './group/message.service'
import { GroupMessageController } from './group/message.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupMessage, PrivateMessage } from '../../utils/typeorm'
import { ChatModule } from '../chat/chat.module'
import { GroupModule } from '../group/group.module'
import { Services } from '../../utils/constants'
import { PrivateMessageController } from './private/message.controller'
import { PrivateMessageService } from './private/message.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([PrivateMessage, GroupMessage]),
        ChatModule,
        GroupModule,
    ],
    controllers: [GroupMessageController, PrivateMessageController],
    providers: [
        {
            provide: Services.GROUP_MESSAGE,
            useClass: GroupMessageService,
        },
        {
            provide: Services.PRIVATE_MESSAGE,
            useClass: PrivateMessageService,
        },
    ],
})
export class MessageModule {}
