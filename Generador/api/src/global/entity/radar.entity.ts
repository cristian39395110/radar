import { Neighborhood } from '../../neighborhood/entities/neighborhood.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';

@Schema()
export class Radar extends Document {
  @Prop({ required: true, unique: false })
  model: string;
  @Prop({ required: true })
  radarId: string;
  @Prop({ required: true })
  sensorId: string;
  @Prop({ type: Types.ObjectId, ref: Neighborhood.name, required: true })
  neighborhood: string;
  @Prop({ type: Boolean, default: true })
  isActive: boolean;
  @Prop({ required: true, type: String })
  location: string | number[];
  @Prop({ required: true, type: Number })
  maxSpeed: number;
}

export type RadarModel = Model<Radar>;

export const RadarSchema = SchemaFactory.createForClass(Radar);
