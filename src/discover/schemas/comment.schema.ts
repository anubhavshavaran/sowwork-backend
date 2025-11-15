import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Comment {
  @Prop({ required: true })
  comment: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post' })
  post: Types.ObjectId;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop()
  deleted_at: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
