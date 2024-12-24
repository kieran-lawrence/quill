import { IsOptional, IsString } from 'class-validator'

export class CreatePrivateMessageDto {
    @IsOptional()
    @IsString()
    messageContent?: string
}
