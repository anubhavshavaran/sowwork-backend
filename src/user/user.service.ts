import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateResult } from 'mongoose';
import { User, UserDocument } from './schemas';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument | null> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findUser(filterQuery: FilterQuery<User>): Promise<UserDocument | null> {
    return this.userModel.findOne(filterQuery).exec();
  }

  async updateUser(
    filterQuery: FilterQuery<User>,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.userModel.updateOne(filterQuery, updateUserDto).exec();
  }
}
