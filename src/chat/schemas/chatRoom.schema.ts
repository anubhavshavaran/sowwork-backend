import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import * as crypto from 'crypto';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class ChatRoom {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  artist: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  customer: Types.ObjectId;

  @Prop({
    type: String,
    default: () => `room_${crypto.randomBytes(6).toString('hex')}`,
  })
  roomId: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
