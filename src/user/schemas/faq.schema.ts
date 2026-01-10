import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type FaqDocument = HydratedDocument<Faq>;

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Faq {
    @Prop()
    question: string;
    @Prop()
    answer: string;
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    artist: string;
    @Prop()
    isDeleted: boolean;
    @Prop()
    deletedAt: Date;
}

export const FaqSchema = SchemaFactory.createForClass(Faq);
