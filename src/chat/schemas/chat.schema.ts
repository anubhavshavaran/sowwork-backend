import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Chat {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true,
  })
  chatRoom: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ default: null })
  message: string;

  @Prop(
    raw({
      type: { type: String, enum: ['IMAGE', 'VIDEO', 'DOCUMENT'] },
      url: { type: String },
    }),
  )
  document: Record<string, any>;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
