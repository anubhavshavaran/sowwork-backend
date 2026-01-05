import { AddressDto } from './address.dto';
import { ImageDto } from './image.dto';

export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  acceptWork?: boolean;
  profile_image?: ImageDto;
  cover_image?: ImageDto;
  loginCode?: {
    code: string;
    expires: number;
  };
  address?: AddressDto;
  category?: string;
  specialization?: string;
  perHourRate?: number;
  description?: string;
}
