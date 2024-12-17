import { Exclude } from 'class-transformer'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { PrivateMessage } from './PrivateMessage'
import { GroupChat } from './GroupChat'
import { OnlineStatus } from '@quill/data'

@Entity()
export class User {
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

    @OneToMany(() => PrivateMessage, (message) => message.author)
    @JoinColumn()
    messages: PrivateMessage[]

    @ManyToMany(() => GroupChat, (groupChat) => groupChat.members)
    groupChats: GroupChat[]

    @Column({
        type: 'enum',
        enum: ['online', 'offline', 'away', 'busy'],
        default: 'offline',
    })
    onlineStatus: OnlineStatus
}
