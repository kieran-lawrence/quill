import { Exclude } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
}
