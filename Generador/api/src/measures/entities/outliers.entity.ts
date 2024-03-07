import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Outliers extends Document {
  @Prop({ default: false, type: Boolean })
  step?: boolean;
  @Prop({ default: false, type: Boolean })
  speed?: boolean;
  @Prop({ default: false, type: Boolean })
  moreThanOneCar?: boolean;
}
