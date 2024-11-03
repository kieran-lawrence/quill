import { Module } from '@nestjs/common'
import entities from '../utils/typeorm'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { PassportModule } from '@nestjs/passport'
import { ChatModule } from './chat/chat.module'
import { MessageModule } from './message/message.module'
import { GroupModule } from './group/group.module';

@Module({
    imports: [
        PassportModule.register({ session: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities,
            synchronize: true,
        }),
        UserModule,
        AuthModule,
        ChatModule,
        MessageModule,
        GroupModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
