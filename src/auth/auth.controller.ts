import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendCodeDto, ValidateCodeDto } from './dto';
import { AuthGuard } from '../guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.authService.sendCode(sendCodeDto);
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  verifyCode(@Body() validateCodeDto: ValidateCodeDto) {
    return this.authService.verifyCode(validateCodeDto);
  }

  @Post('test-guards')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  testGuards(@Request() req: Request) {
    console.log(req['user']);
    return 'test guards';
  }
}
