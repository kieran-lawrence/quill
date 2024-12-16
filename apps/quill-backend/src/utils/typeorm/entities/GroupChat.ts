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
import { User } from './User'
import { GroupMessage } from './GroupMessage'

@Entity()
export class GroupChat {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    name: string

    @OneToOne(() => User, { createForeignKeyConstraints: false })
    @JoinColumn()
    creator: User

    @ManyToMany(() => User, (user) => user.groupChats)
    @JoinTable()
    members: User[]

    @OneToMany(() => GroupMessage, (groupMessage) => groupMessage.groupChat, {
        cascade: ['insert', 'update', 'remove'],
    })
    @JoinColumn()
    messages: GroupMessage[]

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string

    @OneToOne(() => GroupMessage)
    @JoinColumn({ name: 'last_message_sent' })
    lastMessageSent: GroupMessage

    @UpdateDateColumn({ name: 'updated_at' })
    lastMessageSentAt: string

    @Column({ nullable: true })
    coverImage?: string
}
