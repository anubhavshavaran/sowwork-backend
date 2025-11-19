import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AddressDocument = HydratedDocument<Address>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Address {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
  @Prop({ type: String })
  name: string;
  @Prop(
    raw({
      lat: { type: Number },
      lng: { type: Number },
    }),
  )
  coordinates: Record<string, number>;
  @Prop({ type: String, required: true })
  addressLine1: string;
  @Prop({ type: String })
  addressLine2: string;
  @Prop({ type: String, required: true })
  city: string;
  @Prop({ type: String, required: true })
  state: string;
  @Prop()
  isDeleted: boolean;
  @Prop()
  deletedAt: Date;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
