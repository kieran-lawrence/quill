import { ChatEntity } from '../../chat/entities/chat.entity'
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ name: 'private_message' })
export class PrivateMessageEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    messageContent: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string

    @ManyToOne(() => UserEntity, (user) => user.email)
    author: UserEntity

    @ManyToOne(() => ChatEntity, (chat) => chat.messages)
    chat: ChatEntity
}
