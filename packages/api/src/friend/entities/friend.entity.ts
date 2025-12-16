import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { UserEntity } from '../../user/entities/user.entity'

@Entity({ name: 'friend' })
export class FriendEntity {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
    @JoinColumn()
    userOne: UserEntity

    @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
    @JoinColumn()
    userTwo: UserEntity

    @CreateDateColumn()
    createdAt: string
}
