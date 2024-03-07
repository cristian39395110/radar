import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Neighborhood } from './neighborhood.entity';

@Schema()
export class NeighborhoodApi extends Document {
  @Prop({
    required: true,
    ref: Neighborhood.name,
    type: Types.ObjectId,
    unique: true,
  })
  neighborhood: string;
  @Prop()
  accessin: string;
}

export type NeighborhoodApiModel = Model<NeighborhoodApi>;

export const NeighborhoodApiSchema =
  SchemaFactory.createForClass(NeighborhoodApi);
