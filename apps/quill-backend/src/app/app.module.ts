import { BadRequestException, Module } from '@nestjs/common'
import entities from '../utils/typeorm'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { PassportModule } from '@nestjs/passport'
import { ChatModule } from './chat/chat.module'
import { MessageModule } from './message/message.module'
import { GroupModule } from './group/group.module'
import { FriendModule } from './friend/friend.module'
import { MulterModule } from '@nestjs/platform-express'
import * as path from 'path'
import * as fileSystem from 'fs'

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
        MulterModule.registerAsync({
            useFactory: () => ({
                dest: process.env.FILE_UPLOAD_DESTINATION,
                fileFilter: (_, file, cb) => {
                    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                        // Allow storage of file
                        cb(null, true)
                    } else {
                        // Reject file
                        cb(
                            new BadRequestException(
                                `Unsupported file type ${path.extname(
                                    file.originalname,
                                )}`,
                            ),
                            false,
                        )
                    }
                },
                storage: {
                    // Destination storage path details
                    destination: (_, __, cb) => {
                        const uploadPath = process.env.FILE_UPLOAD_DESTINATION
                        // Create folder if doesn't exist
                        if (!fileSystem.existsSync(uploadPath)) {
                            fileSystem.mkdirSync(uploadPath)
                        }
                        cb(null, uploadPath)
                    },
                    // File modification details
                    filename: (req, file, cb) => {
                        // Calling the callback passing the random name generated with the original extension name
                        cb(
                            null,
                            `${Date.now()}${path.extname(file.originalname)}`,
                        )
                    },
                },
            }),
        }),
        UserModule,
        AuthModule,
        ChatModule,
        MessageModule,
        GroupModule,
        FriendModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
