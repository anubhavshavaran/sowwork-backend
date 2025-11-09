import { Module } from '@nestjs/common';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
