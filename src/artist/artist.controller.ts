import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators';
import { AddressDto, ArtistDescriptionDto } from 'src/user/dto';
import { AuthGuard } from 'src/guards';
import { type UserDocument } from 'src/user/schemas';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) { }

  @Post('onboarding/basic-data')
  @HttpCode(HttpStatus.CREATED)
  onboarding(@Body() artistData: CreateArtistDto) {
    return this.artistService.onboarding(artistData);
  }

  @Post('onboarding/address')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  addAddress(@CurrentUser() user: UserDocument, @Body() artistData: AddressDto) {
    return this.artistService.addAddress(user?._id, artistData);
  }

  @Post('onboarding/description')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  addDescription(@CurrentUser() user: UserDocument, @Body() artistData: ArtistDescriptionDto) {
    return this.artistService.addDescription(user?._id, artistData);
  }
}
