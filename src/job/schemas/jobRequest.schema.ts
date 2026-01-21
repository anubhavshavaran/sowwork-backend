import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Status } from 'src/common/constants';

export type JobRequestDocument = HydratedDocument<JobRequest>;

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class JobRequest {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    artist: string;
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    customer: string;
    @Prop({ type: Number, required: true })
    date: number;
    @Prop({ type: Number, required: true })
    durationInHours: number;
    @Prop({
        type: String,
        enum: Status,
        required: true,
    })
    status: string;
    @Prop({ type: Number, required: true })
    expiresAt: number;
    @Prop()
    isDeleted: boolean;
    @Prop()
    deletedAt: Date;
}

export const JobRequestSchema = SchemaFactory.createForClass(JobRequest);
