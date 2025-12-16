import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { UserEntity } from '../../user/entities/user.entity'
import { GroupMessageEntity } from './group-message.entity'

@Entity({ name: 'group_chat' })
export class GroupChatEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    name: string

    @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
    @JoinColumn()
    creator: UserEntity

    @ManyToMany(() => UserEntity, (user) => user.groupChats)
    @JoinTable()
    members: UserEntity[]

    @OneToMany(
        () => GroupMessageEntity,
        (groupMessage) => groupMessage.groupChat,
        {
            cascade: ['insert', 'update', 'remove'],
        },
    )
    @JoinColumn()
    messages: GroupMessageEntity[]

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string

    @OneToOne(() => GroupMessageEntity)
    @JoinColumn({ name: 'last_message_sent' })
    lastMessageSent: GroupMessageEntity

    @UpdateDateColumn({ name: 'updated_at' })
    lastMessageSentAt: string

    @Column({ nullable: true })
    coverImage?: string
}
