import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { UserEntity } from '../../user/entities/user.entity'
import { GroupChatEntity } from './group-chat.entity'

@Entity({ name: 'group_message' })
export class GroupMessageEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    messageContent: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string

    @ManyToOne(() => UserEntity, (user) => user.email)
    author: UserEntity

    @ManyToOne(() => GroupChatEntity, (groupChat) => groupChat.messages, {
        onDelete: 'CASCADE',
    })
    groupChat: GroupChatEntity
}
