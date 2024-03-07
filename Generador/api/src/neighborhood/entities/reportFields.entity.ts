import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class ReportFields extends Document {
  @Prop({ type: Boolean })
  date: boolean;
  @Prop({ type: Boolean })
  plate: boolean;
  @Prop({ type: Boolean })
  actNumber: boolean;
  @Prop({ type: Boolean })
  speed: boolean;
  @Prop({ type: Boolean })
  neighborhood: boolean;
  @Prop({ type: Boolean })
  location: boolean;
  @Prop({ type: Boolean })
  src: boolean;
  @Prop({ type: Boolean })
  funtionalUnit: boolean;
  @Prop({ type: Boolean })
  homeowner: boolean;
  @Prop({ type: Boolean })
  id: boolean;
  @Prop({ type: Boolean })
  model: boolean;
  @Prop({ type: Boolean })
  sensorId: boolean;
}
export const ReportFieldsSchema = SchemaFactory.createForClass(ReportFields);
