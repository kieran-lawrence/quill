import { IsOptional, IsString } from 'class-validator'

export class EditGroupChatDto {
    @IsString()
    @IsOptional()
    name?: string

    @IsOptional()
    userId?: number

    @IsOptional()
    users?: number[]
}
