import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { NotificationStatus } from 'src/common/constants';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Notification {
    @Prop({ type: String, required: true })
    title: string;
    @Prop({ type: String })
    message: string;
    @Prop({ type: String, enum: NotificationStatus, required: true, default: NotificationStatus.UNSEEN })
    status: string;
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    user: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
