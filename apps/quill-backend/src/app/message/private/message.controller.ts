import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'
import { Routes, Services } from '../../../utils/constants'
import { PrivateMessageService } from './message.service'
import { User } from '../../../utils/typeorm'
import { CreatePrivateMessageDto } from '../dtos/CreatePrivateMessage.dto'
import { EditPrivateMessageDto } from '../dtos/EditPrivateMessage.dto'
import { AuthenticatedUser } from '../../../utils/decorators'
import { AuthenticatedGuard } from '../../auth/local-auth.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from '../../../utils/helpers'

@Controller(Routes.PRIVATE_MESSAGE)
@UseGuards(AuthenticatedGuard)
export class PrivateMessageController {
    constructor(
        @Inject(Services.PRIVATE_MESSAGE)
        private readonly messageService: PrivateMessageService,
    ) {}

    @Post('/update')
    @UsePipes(ValidationPipe)
    editPrivateMessage(
        @AuthenticatedUser() user: User,
        @Body() { messageId, messageContent }: EditPrivateMessageDto,
    ) {
        return this.messageService.editPrivateMessage({
            user,
            id: messageId,
            messageContent,
        })
    }

    @Post()
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('image', multerOptions))
    async createPrivateMessage(
        @AuthenticatedUser() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() { messageContent }: CreatePrivateMessageDto,
        @UploadedFile()
        image: Express.Multer.File,
    ) {
        return this.messageService.createPrivateMessage({
            messageContent,
            chatId: id,
            user,
            image,
        })
    }

    @Get('/search')
    searchGroupMessages(
        @Param('id', ParseIntPipe) id: number,
        @Query('query') query: string,
    ) {
        return this.messageService.searchMessages({ id, query })
    }

    @Get(':id')
    getPrivateMessageById(
        @AuthenticatedUser() user: User,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.messageService.getPrivateMessageById(id)
    }

    @Get()
    getPrivateMessages(
        @AuthenticatedUser() user: User,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.messageService.getPrivateMessages(id)
    }

    @Delete(':id')
    async deletePrivateMessage(
        @AuthenticatedUser() user: User,
        @Param('id', ParseIntPipe) id: number,
    ) {
        await this.messageService.deletePrivateMessage({ user, id })
        return { messageId: id }
    }
}
