import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Src extends Document {
  @Prop({ required: true })
  car: string;

  @Prop({ required: false })
  domain: string;
}
