import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { Chat } from './Chat'
import { User } from './User'

@Entity({ name: 'private_message' })
export class PrivateMessage {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    messageContent: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @ManyToOne(() => User, (user) => user.email)
    author: User

    @ManyToOne(() => Chat, (chat) => chat.messages)
    chat: Chat
}
