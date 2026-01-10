import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type DeliverableDocument = HydratedDocument<Deliverable>;

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Deliverable {
    @Prop()
    label: string;
    @Prop()
    description: string;
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    artist: string;
    @Prop()
    isDeleted: boolean;
    @Prop()
    deletedAt: Date;
}

export const DeliverableSchema = SchemaFactory.createForClass(Deliverable);
