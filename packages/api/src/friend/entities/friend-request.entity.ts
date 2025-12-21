import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { UserEntity } from '../../user/entities/user.entity'
import { FriendRequestStatus } from 'types'

@Entity({ name: 'friend_request' })
export class FriendRequestEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => UserEntity, { createForeignKeyConstraints: false })
    @JoinColumn()
    requester: UserEntity

    @ManyToOne(() => UserEntity, { createForeignKeyConstraints: false })
    @JoinColumn()
    addressee: UserEntity

    @Column({ default: 'pending' })
    status: FriendRequestStatus

    @CreateDateColumn()
    createdAt: string

    @CreateDateColumn()
    updatedAt: string
}
