import { UserRole } from '../../common/constants';

export class ValidateCodeDto {
  phoneNumber: string;
  code: string;
  userRole: UserRole;
}
