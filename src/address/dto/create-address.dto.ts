class CoordinatesDto {
  lat: number;
  lng: number;
}

export class CreateAddressDto {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  coordinates?: CoordinatesDto;
}
