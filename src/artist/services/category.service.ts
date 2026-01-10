import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateResult } from 'mongoose';
import { Category, CategoryDocument, Specialization } from '../schemas';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Specialization.name) private specializationModel: Model<Specialization>,
) {}

  async findCategory(filterQuery: FilterQuery<Category>): Promise<CategoryDocument | null> {
    return this.categoryModel.findOne(filterQuery).exec();
  }

  async findSpecialization(filterQuery: FilterQuery<Specialization>): Promise<Specialization | null> {
    return this.specializationModel.findOne(filterQuery).exec();
  }
}
