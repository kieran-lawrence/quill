import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class EditGroupMessageDto {
    @IsNumber()
    @IsNotEmpty()
    messageId: number

    @IsString()
    @IsNotEmpty()
    messageContent: string
}
