import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { PrivateMessage } from './PrivateMessage'
import { User } from './User'

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User, { createForeignKeyConstraints: false })
    @JoinColumn()
    creator: User

    @OneToOne(() => User, { createForeignKeyConstraints: false })
    @JoinColumn()
    recipient: User

    @OneToMany(() => PrivateMessage, (message) => message.chat, {
        cascade: ['insert', 'update', 'remove'],
    })
    @JoinColumn()
    messages: PrivateMessage[]

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @OneToOne(() => PrivateMessage)
    @JoinColumn({ name: 'last_message_sent' })
    lastMessageSent: PrivateMessage

    @UpdateDateColumn({ name: 'updated_at' })
    lastMessageSentAt: Date
}
