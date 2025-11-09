import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Artist {
  @Prop()
  firstName: string;
  @Prop()
  lastName: number;
  @Prop({ trim: true, unique: true, lowercase: true })
  email: string;
  @Prop({ trim: true, unique: true })
  phoneNumber: string;
  @Prop(
    raw({
      url: { type: String },
    }),
  )
  profile_image: Record<string, any>;
  @Prop(
    raw({
      url: { type: String },
    }),
  )
  cover_image: Record<string, any>;
  @Prop({ type: Boolean, default: true })
  acceptWork: boolean;
  @Prop(
    raw({
      code: { type: String, default: null },
      expires: { type: Date, default: null },
    }),
  )
  login_code: Record<string, any>;
  @Prop()
  is_deleted: boolean;
  @Prop()
  deleted_at: Date;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);

ArtistSchema.virtual('addresses', {
  ref: 'Address',
  localField: '_id',
  foreignField: 'owner',
  justOne: false,
  match: { ownerType: 'Artist' },
});
