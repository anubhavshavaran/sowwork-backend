import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Status } from '../../common/constants';

export type PostDocument = HydratedDocument<Post>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Post {
  @Prop(
    raw({
      url: { type: String },
    }),
  )
  image: Record<string, string>;
  @Prop({ type: { type: String, enum: Status, default: Status.STATUS_ACTIVE } })
  status: Status;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
  @Prop({ type: String })
  caption: string;
  @Prop({ type: Boolean, default: false })
  postOnPortfolio: boolean;
  @Prop({ type: Boolean, default: false })
  postOnFeed: boolean;
  @Prop()
  isDeleted: boolean;
  @Prop()
  deletedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
