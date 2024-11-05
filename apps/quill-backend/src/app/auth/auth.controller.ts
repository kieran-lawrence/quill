import {
    Controller,
    Post,
    UseGuards,
    Res,
    UsePipes,
    ValidationPipe,
    Body,
    Inject,
    Get,
    Req,
} from '@nestjs/common'
import { Routes, Services } from '../../utils/constants'
import { AuthenticatedGuard, LocalAuthGuard } from './local-auth.guard'
import { CreateUserDto } from './dtos/CreateUser.dto'
import { UserService } from '../user/user.service'
import { Response } from 'express'

@Controller(Routes.AUTH)
export class AuthController {
    constructor(
        @Inject(Services.USER) private readonly userService: UserService,
    ) {}

    @Post('register')
    @UsePipes(ValidationPipe)
    async register(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Res() res: Response) {
        return res.status(200).send()
    }

    @UseGuards(AuthenticatedGuard)
    @Post('logout')
    async logout(@Res() res: Response) {
        res.status(200).send()
    }

    @Get('status')
    @UseGuards(AuthenticatedGuard)
    authStatus(@Req() req, @Res() res: Response) {
        res.send(req.user)
    }
}
