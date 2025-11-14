import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserRole, UserStatus } from '../common/constants';
import { ConfigService } from '@nestjs/config';
import { SendCodeDto, ValidateCodeDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../user/schemas';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private generateRandomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendCode(sendCodeDto: SendCodeDto) {
    const user = await this.userService.findUser(sendCodeDto);
    const code = this.generateRandomCode();
    const expires =
      Date.now() +
      1000 * 60 * Number(this.configService.get('CODE_EXPIRATION_TIME_MIN'));

    if (!user) {
      if (sendCodeDto.userRole === UserRole.USER_ROLE_CUSTOMER) {
        await this.userService.createUser({
          ...sendCodeDto,
          firstName: 'User',
          status: UserStatus.STATUS_ACTIVE,
          loginCode: {
            code,
            expires,
          },
        });
      } else {
        throw new NotFoundException('User not found with this phone number.');
      }
    } else {
      if ((user.status as UserStatus) === UserStatus.STATUS_INACTIVE)
        throw new ForbiddenException(
          'Account is inactive, please contact admin.',
        );

      if ((user.status as UserStatus) === UserStatus.STATUS_DELETED)
        throw new ForbiddenException(
          'Account is deleted, please contact admin.',
        );

      await this.userService.updateUser(sendCodeDto, {
        loginCode: {
          code,
          expires,
        },
      });
    }

    return {
      code,
    };
  }

  async verifyCode(validateCodeDto: ValidateCodeDto) {
    const user: UserDocument | null = await this.userService.findUser({
      phoneNumber: validateCodeDto.phoneNumber,
      userRole: validateCodeDto.userRole,
    });
    const now = Date.now();

    if (!user) {
      throw new UnauthorizedException('Credentials invalid.');
    } else {
      if (user.loginCode.expires < now) {
        throw new ForbiddenException('Code expired.');
      } else {
        if ((user.status as UserStatus) === UserStatus.STATUS_INACTIVE)
          throw new ForbiddenException(
            'Account is inactive, please contact admin.',
          );

        if ((user.status as UserStatus) === UserStatus.STATUS_DELETED)
          throw new ForbiddenException(
            'Account is deleted, please contact admin.',
          );

        const payload = { _id: user._id, userRole: user.userRole };
        const accessToken = await this.jwtService.signAsync(payload);

        return {
          accessToken,
        };
      }
    }
  }
}
