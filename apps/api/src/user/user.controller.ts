import {
    Body,
    Controller,
    Inject,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { Routes, Services } from '@repo/api'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthenticatedUser } from 'src/util/decorators'
import { UserService } from './user.service'
import { UserEntity } from '@repo/api'
import { Express } from 'express'
import 'multer'
import { UpdateUserDto } from '@repo/api'
import { multerOptions } from 'src/util/helpers'

@Controller(Routes.USER)
export class UserController {
    constructor(
        @Inject(Services.USER) private readonly userService: UserService,
    ) {}

    @Post('update')
    @UseInterceptors(FileInterceptor('avatar', multerOptions))
    updateUser(
        @AuthenticatedUser() user: UserEntity,
        @Body() data: UpdateUserDto,
        @UploadedFile()
        file: Express.Multer.File,
    ) {
        return this.userService.updateUser({ user, ...data, avatar: file })
    }
}
