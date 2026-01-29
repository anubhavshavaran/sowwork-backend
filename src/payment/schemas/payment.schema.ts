import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Payment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  artist: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  customer: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Job' })
  job: string;
  @Prop({ type: Number, required: true })
  amount: number;
  @Prop()
  isDeleted: boolean;
  @Prop()
  deletedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
