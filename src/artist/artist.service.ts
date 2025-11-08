import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist } from './schemas/artist.schema';
import { Model } from 'mongoose';

@Injectable()
export class ArtistService {
  constructor(@InjectModel(Artist.name) private artistModel: Model<Artist>) {}

  // create(cat: Cat) {
  //   this.cats.push(cat);
  // }
  //
  // findAll(): Cat[] {
  //   return this.cats;
  // }
}
