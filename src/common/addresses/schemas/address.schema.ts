import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import Mongoose from 'mongoose';

class Coordinates {
  @Prop()
  lat: number;
  @Prop()
  lng: number;
}

@Schema({ timestamps: true })
export class Address {
  @Prop({
    type: String,
    required: true,
    enum: ['Artist', 'Customer'],
  })
  ownerType: string;

  @Prop({
    type: Mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'ownerType',
  })
  owner: Mongoose.Schema.Types.ObjectId;

  @Prop({ type: Coordinates, required: true })
  coordinates: Coordinates;
  @Prop({ required: true })
  address_line_1: string;
  @Prop()
  address_line_2: string;
  @Prop()
  landmark: string;
  @Prop({ required: true })
  pinCode: string;
  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  state: string;
  @Prop({ default: false })
  is_deleted: boolean;
  @Prop({ default: null })
  deleted_at: Date;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
