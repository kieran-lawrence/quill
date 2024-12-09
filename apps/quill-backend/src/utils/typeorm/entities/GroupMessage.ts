import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { GroupChat } from './GroupChat'
import { User } from './User'

@Entity({ name: 'group_message' })
export class GroupMessage {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    messageContent: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: number

    @ManyToOne(() => User, (user) => user.email)
    author: User

    @ManyToOne(() => GroupChat, (groupChat) => groupChat.messages, {
        onDelete: 'CASCADE',
    })
    groupChat: GroupChat
}
