import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Plate extends Document {
  @Prop({ required: true })
  plate: string;
  @Prop({ required: true, type: Number, min: 0, max: 100 })
  security: number;
}
