import { UserRole, UserStatus } from '../../common/constants';

export class CreateUserDto {
  firstName: string;
  lastName?: string;
  email?: string;
  phoneNumber: string;
  userRole: UserRole;
  status: UserStatus;
  loginCode?: {
    code: string;
    expires: number;
  };
}
