import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Address, AddressDocument } from './schemas';
import { CreateAddressDto, UpdateAddressDto } from './dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
  ) {}

  async create(userId: string, createAddressDto: CreateAddressDto) {
    return this.addressModel.create({
      ...createAddressDto,
      user: new Types.ObjectId(userId),
      isDeleted: false,
    });
  }

  async findAll(userId: string) {
    return this.addressModel
      .find({ user: new Types.ObjectId(userId), isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const address = await this.addressModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: { $ne: true },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const updatedAddress = await this.addressModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: { $ne: true } },
      { $set: updateAddressDto },
      { new: true },
    );

    if (!updatedAddress) {
      throw new NotFoundException('Address not found or unauthorized');
    }
    return updatedAddress;
  }

  async remove(id: string) {
    const deletedAddress = await this.addressModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!deletedAddress) {
      throw new NotFoundException('Address not found or unauthorized');
    }
    return true;
  }
}
