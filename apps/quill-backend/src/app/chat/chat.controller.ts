import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'
import { Routes, Services } from '../../utils/constants'
import { AuthenticatedGuard } from '../auth/local-auth.guard'
import { ChatService } from './chat.service'
import { AuthenticatedUser } from '../../utils/decorators'
import { User } from '../../utils/typeorm'
import { SearchChatsDto } from './dtos/SearchChats.dto'
import { CreateChatDto } from './dtos/CreateChat.dto'

@Controller(Routes.CHAT)
@UseGuards(AuthenticatedGuard)
export class ChatController {
    constructor(
        @Inject(Services.CHAT) private readonly chatsService: ChatService,
    ) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(
        @AuthenticatedUser() user: User,
        @Body() { email, message }: CreateChatDto,
    ) {
        return this.chatsService.createChat({ user, email, message })
    }

    @Get()
    async getAll(@AuthenticatedUser() { id }: User) {
        return this.chatsService.getChats(id)
    }

    @Get(':id')
    async getById(@Param('id') id: number) {
        return this.chatsService.getChatById(id)
    }

    @Post('/search')
    async search(
        @AuthenticatedUser() userOne: User,
        @Query() userTwo: SearchChatsDto,
    ) {
        return this.chatsService.findChat({ userOne, userTwo })
    }
}
