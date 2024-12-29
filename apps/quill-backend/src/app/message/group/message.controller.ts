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
import { GroupMessageService } from './message.service'
import { AuthenticatedUser } from '../../../utils/decorators'
import { User } from '../../../utils/typeorm'
import { EditGroupMessageDto } from '../dtos/EditGroupMessage.dto'
import { CreateGroupMessageDto } from '../dtos/CreateGroupMessage.dto'
import { AuthenticatedGuard } from '../../auth/local-auth.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from '../../../utils/helpers'

@Controller(Routes.GROUP_MESSAGE)
@UseGuards(AuthenticatedGuard)
export class GroupMessageController {
    constructor(
        @Inject(Services.GROUP_MESSAGE)
        private readonly groupMessageService: GroupMessageService,
    ) {}

    @Post('/update')
    @UsePipes(ValidationPipe)
    editGroupMessage(
        @AuthenticatedUser() user: User,
        @Body() { messageId, messageContent }: EditGroupMessageDto,
    ) {
        return this.groupMessageService.editGroupMessage({
            user,
            id: messageId,
            messageContent,
        })
    }

    @Post()
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('image', multerOptions))
    createGroupMessage(
        @AuthenticatedUser() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() { messageContent }: CreateGroupMessageDto,
        @UploadedFile()
        image: Express.Multer.File,
    ) {
        return this.groupMessageService.createGroupMessage({
            messageContent,
            groupId: id,
            user,
            image,
        })
    }

    @Get('/search')
    searchGroupMessages(
        @Param('id', ParseIntPipe) id: number,
        @Query('query') query: string,
    ) {
        return this.groupMessageService.searchGroupMessages({ id, query })
    }

    @Get(':id')
    getGroupMessageById(
        @AuthenticatedUser() user: User,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.groupMessageService.getGroupMessageById(id)
    }

    @Get()
    getGroupMessages(
        @AuthenticatedUser() user: User,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.groupMessageService.getGroupMessages(id)
    }

    @Delete(':id')
    async deleteGroupMessage(
        @AuthenticatedUser() user: User,
        @Param('id', ParseIntPipe) id: number,
    ) {
        await this.groupMessageService.deleteGroupMessage({ user, id })
        return { messageId: id }
    }
}
