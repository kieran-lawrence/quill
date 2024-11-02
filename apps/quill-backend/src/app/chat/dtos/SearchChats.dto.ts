import { IsEmail, IsOptional, IsString } from 'class-validator'

export class SearchChatsDto {
    @IsEmail()
    @IsOptional()
    email: string

    @IsString()
    @IsOptional()
    username: string

    @IsString()
    @IsOptional()
    firstName: string

    @IsString()
    @IsOptional()
    lastName: string
}
