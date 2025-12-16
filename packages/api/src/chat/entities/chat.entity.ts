import { PrivateMessageEntity } from '../../message/entities/private-message.entity'
import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ name: 'chat' })
export class ChatEntity {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
    @JoinColumn()
    creator: UserEntity

    @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
    @JoinColumn()
    recipient: UserEntity

    @OneToMany(() => PrivateMessageEntity, (message) => message.chat, {
        cascade: ['insert', 'update', 'remove'],
    })
    @JoinColumn()
    messages: PrivateMessageEntity[]

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string

    @OneToOne(() => PrivateMessageEntity)
    @JoinColumn({ name: 'last_message_sent' })
    lastMessageSent: PrivateMessageEntity

    @UpdateDateColumn({ name: 'updated_at' })
    lastMessageSentAt: string
}
