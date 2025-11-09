import { UserRole } from '../../common/constants';

export class SendCodeDto {
  phoneNumber: string;
  userRole: UserRole;
}
