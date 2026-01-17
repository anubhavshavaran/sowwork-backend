import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { UserRole, UserStatus } from '../../common/constants';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop({ trim: true, lowercase: true })
  email: string;
  @Prop({ trim: true })
  phoneNumber: string;
  @Prop({
    type: String,
    enum: UserRole,
    required: true,
  })
  userRole: string;
  @Prop({
    type: String,
    enum: UserStatus,
    required: true,
  })
  status: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  category: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Specialization' })
  specialization: string;
  @Prop({ type: Number, max: 2000, min: 500 })
  perHourRate: number;
  @Prop({ type: [Number] })
  embedding: number[];
  @Prop()
  description: string;
  @Prop({ type: Number, default: 0 })
  rating: number;
  @Prop(
    raw({
      url: { type: String },
    }),
  )
  profileImage: Record<string, any>;
  @Prop(
    raw({
      url: { type: String },
    }),
  )
  coverImage: Record<string, any>;
  @Prop(
    raw({
      addressLine: { type: String },
      landmark: { type: String },
      pincode: { type: String },
      city: { type: String },
      state: { type: String },
    }),
  )
  address: Record<string, string>;
  @Prop({ type: Boolean, default: true })
  acceptWork: boolean;
  @Prop(
    raw({
      code: { type: String, default: null },
      expires: { type: Number, default: null },
    }),
  )
  loginCode: Record<string, any>;
  @Prop()
  isDeleted: boolean;
  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('addresses', {
  ref: 'Address',
  localField: '_id',
  foreignField: 'owner',
  justOne: false,
  match: { ownerType: 'Artist' },
});

UserSchema.path('rating').set(() => {
  return 0;
});
