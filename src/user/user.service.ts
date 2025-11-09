import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User | null> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findUser(filter: FilterQuery<User>): Promise<User | null> {
    return this.userModel.findOne(filter).exec();
  }

  async updateUser(
    filter: FilterQuery<User>,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(filter._id, updateUserDto).exec();
  }
}
