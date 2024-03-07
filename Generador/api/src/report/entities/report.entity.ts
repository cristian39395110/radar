import { Src } from './src.entity';
import { Radar } from './../../global/entity/radar.entity';
import { Neighborhood } from './../../neighborhood/entities/neighborhood.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Measure } from 'src/measures/entities/measure.entity';

@Schema({ timestamps: true })
export class Report extends Document {
  @Prop({ required: true, unique: true })
  actNumber: string;
  @Prop({ required: true, type: Date })
  date: Date;
  @Prop({ default: 'XXXXXXX', minlength: 6, maxlength: 7 })
  plate: string;
  @Prop({ required: true, type: Number })
  speed: number;
  @Prop()
  functionalUnit?: string;
  @Prop()
  homeowner?: string;
  @Prop({ required: true, type: String })
  location: number[] | string;
  @Prop({ type: Types.ObjectId, ref: Neighborhood.name })
  neighborhood: Neighborhood;
  @Prop({ type: Types.ObjectId, ref: Radar.name })
  radar: Radar;
  @Prop({ type: Types.ObjectId, ref: Measure.name, unique: true })
  measure: string | Measure;
  @Prop({ type: Src, required: true })
  src: Src;
  @Prop({ type: Boolean, default: false })
  wasSent: boolean;
}

export type ReportModel = Model<Report>;

export const ReportSchema = SchemaFactory.createForClass(Report);
