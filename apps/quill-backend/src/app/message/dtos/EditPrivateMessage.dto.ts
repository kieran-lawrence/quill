import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class EditPrivateMessageDto {
    @IsNumber()
    @IsNotEmpty()
    messageId: number

    @IsString()
    @IsNotEmpty()
    messageContent: string
}
