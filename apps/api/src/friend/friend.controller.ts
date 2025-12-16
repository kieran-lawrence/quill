import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'
import { AuthenticatedUser } from 'src/util/decorators'
import { FriendService } from './friend.service'
import { UserEntity, AddFriendDto, Routes, Services } from '@repo/api'
import { AuthenticatedGuard } from '../auth/local-auth.guard'

@Controller(Routes.FRIEND)
@UseGuards(AuthenticatedGuard)
export class FriendsController {
    constructor(
        @Inject(Services.FRIEND) private readonly friendService: FriendService,
    ) {}

    @Post()
    @UsePipes(ValidationPipe)
    add(
        @AuthenticatedUser() user: UserEntity,
        @Body() { email }: AddFriendDto,
    ) {
        return this.friendService.addFriend({ user, email })
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.friendService.findFriendById(id)
    }

    @Get()
    async getAll(@AuthenticatedUser() user: UserEntity) {
        const friends = await this.friendService.getFriends(user)
        return {
            friends,
            userId: user.id,
        }
    }

    @Delete(':id')
    delete(
        @AuthenticatedUser() { id }: UserEntity,
        @Param('id', ParseIntPipe) friendId: number,
    ) {
        return this.friendService.deleteFriend({ id, friendId })
    }
}
