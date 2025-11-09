import { ImageDto } from './image.dto';

export class UpdateArtistDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profile_image?: ImageDto;
  cover_image?: ImageDto;
  acceptWork?: boolean;

}
