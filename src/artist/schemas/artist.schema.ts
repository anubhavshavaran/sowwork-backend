// eslint-disable @typescript-eslint/no-unsafe-call
// eslint-disable @typescript-eslint/no-unsafe-assignment

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema()
export class Artist {
  @Prop()
  name: string;
  @Prop()
  age: number;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
