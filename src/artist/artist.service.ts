import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist } from './schemas/artist.schema';
import { Model } from 'mongoose';

@Injectable()
export class ArtistService {
  constructor(@InjectModel(Artist.name) private artistModel: Model<Artist>) {}

  async create(artist: Artist): Promise<Artist> {
    const createdCat = new this.artistModel(artist);
    return createdCat.save();
  }

  async findAll(): Promise<Artist[]> {
    return this.artistModel.find().exec();
  }
}
