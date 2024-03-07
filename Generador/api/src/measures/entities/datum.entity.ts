import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Datum extends Document {
  @Prop({ required: true, type: Number })
  speed: number;
  @Prop({ type: Number })
  distance: number;
  @Prop({ type: Number })
  magnitude: number;
  @Prop({ type: Number })
  angle: number;
  @Prop({ type: Number, required: true }) //Date in ns
  timeRef: number;
  @Prop({ type: Date, required: true }) //Date
  date: Date;
}
