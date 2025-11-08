import { Module } from '@nestjs/common';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
  ],
  controllers: [],
  providers: [],
})
export class ArtistModule {}
