import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators';
import { AuthGuard } from 'src/guards';
import { type UserDocument } from './schemas';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('get-profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  getProfile(@CurrentUser() user: UserDocument) {
    return this.userService.findUser({_id: user?._id}, ['-embedding']);
  }
}
