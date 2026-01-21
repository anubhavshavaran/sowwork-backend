import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { CreateUserDto } from './dto';
import { User, UserDocument } from './schemas';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument | null> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findUser(filterQuery: FilterQuery<User>, select: string[] = []): Promise<UserDocument | null> {
    let query = this.userModel.findOne(filterQuery);
    if (select.length > 0) {
      query = query.select(select);
    }
    return query.exec();
  }

  async updateUser(
    filterQuery: FilterQuery<User>,
    updateUserDto: UpdateQuery<User>,
  ): Promise<UserDocument | null> {
    return this.userModel.findOneAndUpdate(filterQuery, updateUserDto, { new: true }).exec();
  }
}
