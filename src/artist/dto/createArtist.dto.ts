export class CreateArtistDto {
  type?: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phoneNumber: string;
  profile_image?: {
    url: string;
  };
  cover_image?: {
    url: string;
  };
  acceptWork?: boolean;
}
