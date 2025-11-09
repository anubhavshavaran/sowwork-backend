import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist } from './schemas/artist.schema';
import { Model } from 'mongoose';
import { CreateArtistDto } from './dto/createArtist.dto';

@Injectable()
export class ArtistService {
  constructor(@InjectModel(Artist.name) private artistModel: Model<Artist>) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const createdCat = new this.artistModel(createArtistDto);
    return createdCat.save();
  }

  async findAll(): Promise<Artist[]> {
    return this.artistModel.find().exec();
  }

  async findById(id: string): Promise<Artist> {
    const artist = await this.artistModel.findById(id).exec();

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async findByPhone(phoneNumber: string): Promise<Artist> {
    const artist = await this.artistModel.findOne({ phoneNumber }).exec();

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }
}
