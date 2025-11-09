import { ImageDto } from './image.dto';

export class FindArtistDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profile_image?: ImageDto;
  cover_image?: ImageDto;
  acceptWork?: boolean;
}
