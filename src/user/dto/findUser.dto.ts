export class FindUserDto {
  _id?: string;
  email?: string;
  phoneNumber?: string;
  userRole?: string;
  loginCode?: {
    code: string;
    expires?: number;
  };
}
