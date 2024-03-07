import { KldSample } from './sample.entity';
import { Plate } from './plate.entity';
import { Radar } from '../../global/entity/radar.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Outliers } from './outliers.entity';

@Schema({ timestamps: true })
export class Measure extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: Radar.name })
  radar: string;
  @Prop({ required: false, type: Plate })
  plate: Plate;
  @Prop({ required: true, type: Types.Array<KldSample> })
  samples: KldSample[];
  @Prop({ required: true, type: String, unique: true })
  video: string;
  @Prop({ default: false, type: Boolean })
  isCompleted: boolean;
  @Prop({ default: false, type: Boolean })
  isDiscarded: boolean;
  @Prop({ default: false, type: Boolean })
  isCorrupted: boolean;
  @Prop({ default: undefined, type: String })
  pic: string;
  @Prop({ default: undefined, type: Outliers })
  outliers: Outliers;
  @Prop({ default: false, type: Boolean })
  moreThanOneCar: boolean;
  @Prop({ type: Date })
  date: Date;
}

export type MeasureModel = Model<Measure>;

export const MeasureSchema = SchemaFactory.createForClass(Measure);
