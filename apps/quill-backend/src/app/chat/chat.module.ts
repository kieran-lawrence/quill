import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Chat, PrivateMessage } from '../../utils/typeorm'
import { Services } from '../../utils/constants'
import { ChatService } from './chat.service'
import { UserModule } from '../user/user.module'

@Module({
    imports: [TypeOrmModule.forFeature([Chat, PrivateMessage]), UserModule],
    controllers: [ChatController],
    providers: [
        {
            provide: Services.CHAT,
            useClass: ChatService,
        },
    ],
})
export class ChatModule {}
