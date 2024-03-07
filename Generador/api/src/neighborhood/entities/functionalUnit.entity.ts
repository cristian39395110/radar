import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class FunctionalUnit extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, type: [String] })
  plates: string[];
  @Prop({ default: '' })
  homeowner?: string;
}

export const FunctionalUnitSchema =
  SchemaFactory.createForClass(FunctionalUnit);
