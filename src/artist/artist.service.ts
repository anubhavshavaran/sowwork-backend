import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist } from './schemas/artist.schema';
import { Model } from 'mongoose';
import { CreateArtistDto } from './dto/createArtist.dto';

@Injectable()
export class ArtistService {
  // constructor(@InjectModel(Artist.name) private artistModel: Model<Artist>) {}

}
