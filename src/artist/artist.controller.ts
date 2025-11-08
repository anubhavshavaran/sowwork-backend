import { Controller, Get, Post } from '@nestjs/common';
import { ArtistService } from './artist.service';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  async create() {
    return this.artistService.create({
      name: 'test',
      age: 10,
    });
  }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }
}
