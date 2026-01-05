import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type SpecializationDocument = HydratedDocument<Specialization>;

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Specialization {
    @Prop({ required: true })
    name: string;
    @Prop()
    description: string;
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
    category: string;
    @Prop({ type: Boolean, default: true })
    isActive: boolean;
    @Prop()
    isDeleted: boolean;
    @Prop()
    deletedAt: Date;
}

export const SpecializationSchema = SchemaFactory.createForClass(Specialization);
