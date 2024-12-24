import { IsOptional, IsString } from 'class-validator'

export class CreateGroupMessageDto {
    @IsString()
    @IsOptional()
    messageContent?: string
}
