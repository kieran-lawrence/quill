import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    ParseIntPipe,
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

    @Get('/search')
    @UsePipes(ValidationPipe)
    async search(
        @AuthenticatedUser() userOne: User,
        @Query() { email, username }: SearchChatsDto,
    ) {
        return this.chatsService.searchChatsQuery({
            userOneId: userOne.id,
            userTwo: { email, username },
        })
    }

    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number) {
        console.log(id)
        return this.chatsService.getChatById(id)
    }

    @Get()
    async getAll(@AuthenticatedUser() { id }: User) {
        return this.chatsService.getChatsByUserId(id)
    }
}
