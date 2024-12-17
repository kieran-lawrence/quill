import {
    Body,
    Controller,
    Inject,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { Routes, Services } from '../../utils/constants'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthenticatedUser } from '../../utils/decorators'
import { UserService } from './user.service'
import { User } from '../../utils/typeorm'
import { Express } from 'express'
import 'multer'
import { multerOptions } from '../../utils/helpers'
import { UpdateUserDto } from './dtos/UpdateUser.dto'

@Controller(Routes.USER)
export class UserController {
    constructor(
        @Inject(Services.USER) private readonly userService: UserService,
    ) {}

    @Post('update')
    @UseInterceptors(FileInterceptor('avatar', multerOptions))
    updateUser(
        @AuthenticatedUser() user: User,
        @Body() data: UpdateUserDto,
        @UploadedFile()
        file: Express.Multer.File,
    ) {
        return this.userService.updateUser({ user, ...data, avatar: file })
    }
}
