import { Exclude } from 'class-transformer'
import { GroupChatEntity } from '../../group/entities/group-chat.entity'
import { PrivateMessageEntity } from '../../message/entities/private-message.entity'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { OnlineStatus } from 'types'

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column()
    username: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ select: false })
    @Exclude()
    password: string

    @Column({ nullable: true })
    avatar?: string

    @OneToMany(() => PrivateMessageEntity, (message) => message.author)
    @JoinColumn()
    messages: PrivateMessageEntity[]

    @ManyToMany(() => GroupChatEntity, (groupChat) => groupChat.members)
    groupChats: GroupChatEntity[]

    @Column({
        type: 'enum',
        enum: ['online', 'offline', 'away', 'busy'],
        default: 'offline',
    })
    onlineStatus: OnlineStatus
}
