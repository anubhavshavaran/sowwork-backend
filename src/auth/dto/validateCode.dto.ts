import { UserRole } from '../../common/constants';

export class ValidateCodeDto {
  phoneNumber: string;
  otp: string;
  useRole: UserRole;
}
