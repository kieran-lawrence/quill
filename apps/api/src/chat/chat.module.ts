import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatEntity, PrivateMessageEntity, Services } from '@repo/api'
import { ChatService } from './chat.service'
import { UserModule } from '../user/user.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatEntity, PrivateMessageEntity]),
        UserModule,
    ],
    controllers: [ChatController],
    providers: [
        {
            provide: Services.CHAT,
            useClass: ChatService,
        },
    ],
    exports: [
        {
            provide: Services.CHAT,
            useClass: ChatService,
        },
    ],
})
export class ChatModule {}
