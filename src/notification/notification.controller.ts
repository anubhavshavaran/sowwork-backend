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

    @Post('create')
    @UseGuards(AuthGuard)
    create(@CurrentUser() user: UserDocument) {
        return this.notificationService.create({
            title: "New Job Request",
            message: "A Customer wants to collaborate with you!",
            user:"6918b336c3e3152e592ede43",
        });
    }
}
