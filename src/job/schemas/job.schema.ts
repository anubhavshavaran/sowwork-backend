import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { JobStatus } from 'src/common/constants';

export type JobDocument = HydratedDocument<Job>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Job {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  artist: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  customer: string;
  @Prop({ type: Number, required: true })
  date: number;
  @Prop({ type: Number, required: true })
  durationInHours: number;
  @Prop({ type: Number, required: true })
  amount: number;
  @Prop({
    type: String,
    enum: JobStatus,
    required: true,
    default: JobStatus.ACTIVE
  })
  status: string;
  @Prop({ type: String })
  ocassionTiming: string;
  @Prop({ type: String })
  rehersalTiming: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String })
  location: string;
  @Prop()
  isDeleted: boolean;
  @Prop()
  deletedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
