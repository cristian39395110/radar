import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { ReportFields, ReportFieldsSchema } from './reportFields.entity';
import { FunctionalUnit, FunctionalUnitSchema } from './functionalUnit.entity';

@Schema()
export class Neighborhood extends Document {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ required: true, unique: true })
  acronym: string;
  @Prop({ default: 1, type: Number })
  actNumber: number;
  @Prop({ type: Boolean, default: false })
  sendToApi: boolean;
  @Prop({ type: ReportFieldsSchema })
  reportFields: ReportFields;
  @Prop({ type: Boolean, default: true })
  isActive: boolean;
  @Prop({ default: 'doppler' })
  template: string;
  @Prop({ type: [String], default: [] })
  whiteList: string[];
  @Prop({ type: [FunctionalUnitSchema], default: [] })
  functionalUnits: FunctionalUnit[];
}

export type NeighborhoodModel = Model<Neighborhood>;

export const NeighborhoodSchema = SchemaFactory.createForClass(Neighborhood);
