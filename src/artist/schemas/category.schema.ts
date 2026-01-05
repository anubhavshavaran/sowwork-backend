import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Category {
    @Prop({ required: true })
    name: string;
    @Prop()
    description: string;
    @Prop({ type: Boolean, default: true })
    isActive: boolean;
    @Prop()
    isDeleted: boolean;
    @Prop()
    deletedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
