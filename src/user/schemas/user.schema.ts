import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
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
  lastName: number;
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
  @Prop()
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
