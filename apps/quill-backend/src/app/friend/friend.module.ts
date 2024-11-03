import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Friend } from '../../utils/typeorm'

@Module({
    imports: [TypeOrmModule.forFeature([Friend]), UserModule],
})
export class FriendModule {}
