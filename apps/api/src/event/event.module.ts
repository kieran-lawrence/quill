import { Module } from '@nestjs/common'
import { EventGateway } from './event.gateway'
import { Services } from '@repo/api'
import { SessionStore } from './session.store'
import { GroupModule } from '../group/group.module'
import { UserModule } from '../user/user.module'
import { ChatModule } from '../chat/chat.module'

@Module({
    imports: [ChatModule, GroupModule, UserModule],
    providers: [
        EventGateway,
        {
            provide: Services.SESSION_STORE,
            useClass: SessionStore,
        },
    ],
})
export class EventModule {}
