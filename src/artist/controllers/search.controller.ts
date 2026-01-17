import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards';
import { SearchDto } from '../dto';
import { SearchService } from '../services/search.service';
import { PostRequestFilterDto } from 'src/common/dto';

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
  
  @Get('get-artist-profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  getArtistProfile(@Query('artistId') artistId: string) {
    return this.searchService.getArtistProfile(artistId);
  }

  @Post('home')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  searchHome(@Body() filter: PostRequestFilterDto) {
    return this.searchService.getRandomArtists(filter);
  }
}
