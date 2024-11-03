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
import { AuthenticatedUser } from '../../utils/decorators'
import { User } from '../../utils/typeorm'
import { FriendService } from './friend.service'
import { AddFriendDto } from './dtos/AddFriend.dto'
import { Routes, Services } from '../../utils/constants'
import { AuthenticatedGuard } from '../auth/local-auth.guard'

@Controller(Routes.FRIEND)
@UseGuards(AuthenticatedGuard)
export class FriendsController {
    constructor(
        @Inject(Services.FRIEND) private readonly friendService: FriendService,
    ) {}

    @Post()
    @UsePipes(ValidationPipe)
    add(@AuthenticatedUser() user: User, @Body() { email }: AddFriendDto) {
        return this.friendService.addFriend({ user, email })
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.friendService.findFriendById(id)
    }

    @Get()
    getAll(@AuthenticatedUser() user: User) {
        return this.friendService.getFriends(user)
    }

    @Delete(':id')
    delete(
        @AuthenticatedUser() { id }: User,
        @Param('id', ParseIntPipe) friendId: number,
    ) {
        return this.friendService.deleteFriend({ id, friendId })
    }
}
