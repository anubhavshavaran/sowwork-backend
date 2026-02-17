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
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'JobRequest' })
  jobRequest: string;
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
    default: JobStatus.PAYMENT_PENDING
  })
  status: string;
  @Prop({ type: Number })
  startTime: number;
  @Prop({ type: Number })
  endTime: number;
  @Prop({ type: Number })
  rehersalStartTime: number;
  @Prop({ type: Number })
  rehersalEndTime: number;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String })
  location: string;
  @Prop([String])
  milestones: Array<string>;
  @Prop()
  isDeleted: boolean;
  @Prop()
  deletedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
