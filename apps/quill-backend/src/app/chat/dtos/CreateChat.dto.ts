import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateChatDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsOptional()
    message: string
}
