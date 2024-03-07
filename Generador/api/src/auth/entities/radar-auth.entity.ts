import { Radar } from './../../global/entity/radar.entity';
import { randomUUID } from 'crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';

@Schema()
export class RadarAuth extends Document {
  @Prop({ default: randomUUID })
  apikey: string;
  @Prop({ type: Types.ObjectId, ref: Radar.name, require: true })
  radar: string | Radar;
}

export type RadarAuthModel = Model<RadarAuth>;

export const RadarAuthSchema = SchemaFactory.createForClass(RadarAuth);
