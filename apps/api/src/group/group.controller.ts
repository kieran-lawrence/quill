import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'
import { Routes, Services, UserEntity } from '@repo/api'
import { AuthenticatedGuard } from '../auth/local-auth.guard'
import { GroupService } from './group.service'
import { AuthenticatedUser } from 'src/util/decorators'
import { CreateGroupChatDto, EditGroupChatDto } from '@repo/api'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from 'src/util/helpers'

@Controller(Routes.GROUP)
@UseGuards(AuthenticatedGuard)
export class GroupController {
    constructor(
        @Inject(Services.GROUP) private readonly groupService: GroupService,
    ) {}

    @Get(':id')
    async getById(@Param('id') id: number) {
        return this.groupService.getGroupChatById(id)
    }

    @Delete(':id')
    @UsePipes(ValidationPipe)
    delete(@Param('id') id: number, @AuthenticatedUser() user: UserEntity) {
        return this.groupService.deleteGroupChat({ groupId: id, user })
    }

    @Get()
    async getAll(@AuthenticatedUser() { id }: UserEntity) {
        return this.groupService.getGroupChats(id)
    }

    @Post(':id/update')
    @UseInterceptors(FileInterceptor('avatar', multerOptions))
    update(
        @Param('id') id: number,
        @AuthenticatedUser() user: UserEntity,
        @Body() { name }: EditGroupChatDto,
        @UploadedFile()
        file: Express.Multer.File,
    ) {
        return this.groupService.updateGroup({ id, user, name, file })
    }

    @Post(':id/leave')
    @UsePipes(ValidationPipe)
    leaveGroup(
        @Param('id') groupId: number,
        @Body() { userId }: EditGroupChatDto,
        @AuthenticatedUser() user: UserEntity,
    ) {
        return this.groupService.leaveGroupChat({ groupId, userId, user })
    }

    @Post(':id/members/remove')
    @UsePipes(ValidationPipe)
    removeMember(
        @Param('id') groupId: number,
        @Body() { userId }: EditGroupChatDto,
        @AuthenticatedUser() user: UserEntity,
    ) {
        return this.groupService.removeGroupChatUser({ groupId, userId, user })
    }

    @Post()
    @UsePipes(ValidationPipe)
    async create(
        @AuthenticatedUser() creator: UserEntity,
        @Body() params: CreateGroupChatDto,
    ) {
        return this.groupService.createGroupChat({
            creator,
            ...params,
        })
    }

    @Post(':id/members/add')
    @UsePipes(ValidationPipe)
    addMembers(
        @Param('id') groupId: number,
        @AuthenticatedUser() user: UserEntity,
        @Body() { users }: EditGroupChatDto,
    ) {
        return this.groupService.addGroupChatUsers({ groupId, users, user })
    }
}
