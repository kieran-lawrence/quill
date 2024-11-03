import { ArrayNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateGroupChatDto {
    @IsString()
    @IsOptional()
    name: string

    @IsString({ each: true })
    @ArrayNotEmpty()
    members: string[]

    @IsString()
    @IsOptional()
    message: string
}
