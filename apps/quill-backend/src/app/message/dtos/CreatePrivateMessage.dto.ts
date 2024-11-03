import { IsNotEmpty, IsString } from 'class-validator'

export class CreatePrivateMessageDto {
    @IsNotEmpty()
    @IsString()
    messageContent: string
}
