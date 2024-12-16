import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'

@Entity()
export class Friend {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User, { createForeignKeyConstraints: false })
    @JoinColumn()
    userOne: User

    @OneToOne(() => User, { createForeignKeyConstraints: false })
    @JoinColumn()
    userTwo: User

    @CreateDateColumn()
    createdAt: string
}
