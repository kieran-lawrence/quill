import { IsOptional, IsString } from 'class-validator'
import { OnlineStatus } from 'types'

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    firstName?: string

    @IsString()
    @IsOptional()
    lastName?: string

    @IsString()
    @IsOptional()
    onlineStatus?: OnlineStatus
}
