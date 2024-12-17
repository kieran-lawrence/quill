import { OnlineStatus } from '@quill/data'
import { IsOptional, IsString } from 'class-validator'

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
