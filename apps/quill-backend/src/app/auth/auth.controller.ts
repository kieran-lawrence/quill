import {
    Controller,
    Post,
    UseGuards,
    Req,
    UsePipes,
    ValidationPipe,
    Body,
    Inject,
} from '@nestjs/common'
import { Routes, Services } from '../../utils/constants'
import { AuthenticatedGuard, LocalAuthGuard } from './local-auth.guard'
import { CreateUserDto } from './dtos/CreateUser.dto'
import { UserService } from '../user/user.service'

@Controller(Routes.AUTH)
export class AuthController {
    constructor(
        @Inject(Services.USER) private readonly userService: UserService,
    ) {}

    @Post('register')
    @UsePipes(ValidationPipe)
    async userRegister(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req) {
        return req.user
    }

    @UseGuards(AuthenticatedGuard)
    @Post('logout')
    async logout(@Req() req) {
        return req.logout()
    }
}
