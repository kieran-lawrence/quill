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

@Controller(Routes.USER)
export class UserController {
    constructor(
        @Inject(Services.USER) private readonly userService: UserService,
    ) {}
    @Post('update')
    @UseInterceptors(FileInterceptor('avatar'))
    updateUser(
        @AuthenticatedUser() user: User,
        @Body() data,
        @UploadedFile() file,
    ) {
        return this.userService.updateUser({ user, data, avatar: file })
    }
}
