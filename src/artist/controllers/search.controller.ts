import { Body, Controller, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards';
import { SearchDto } from '../dto';
import { SearchService } from '../services/search.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
  ) { }

  @Post('artists')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  search(@Body() search: SearchDto) {
    return this.searchService.searchArtists(search);
  }
  
  @Post('get-artist-profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  testEmbed(@Query('artistId') artistId: string) {
    return this.searchService.getArtistProfile(artistId);
  }
}
