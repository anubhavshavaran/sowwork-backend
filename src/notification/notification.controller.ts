import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from 'src/guards';
import { CurrentUser } from 'src/auth/decorators';
import { type UserDocument } from 'src/user/schemas';

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) { }

    @Get('get-all')
    @UseGuards(AuthGuard)
    getNotifications(@CurrentUser() user: UserDocument) {
        return this.notificationService.findByUser(user._id);
    }
}
