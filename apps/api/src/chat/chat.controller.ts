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
import { Routes, Services } from '@repo/api'
import { AuthenticatedGuard } from '../auth/local-auth.guard'
import { ChatService } from './chat.service'
import { AuthenticatedUser } from 'src/util/decorators'
import { UserEntity, SearchChatsDto, CreateChatDto } from '@repo/api'

@Controller(Routes.CHAT)
@UseGuards(AuthenticatedGuard)
export class ChatController {
    constructor(
        @Inject(Services.CHAT) private readonly chatsService: ChatService,
    ) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(
        @AuthenticatedUser() user: UserEntity,
        @Body() { email, message }: CreateChatDto,
    ) {
        return this.chatsService.createChat({ user, email, message })
    }

    @Get('/search')
    @UsePipes(ValidationPipe)
    async search(
        @AuthenticatedUser() userOne: UserEntity,
        @Query() { email, username }: SearchChatsDto,
    ) {
        return this.chatsService.searchChatsQuery({
            userOneId: userOne.id,
            userTwo: { email, username },
        })
    }

    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number) {
        return this.chatsService.getChatById(id)
    }

    @Get()
    async getAll(@AuthenticatedUser() { id }: UserEntity) {
        return this.chatsService.getChatsByUserId(id)
    }
}
