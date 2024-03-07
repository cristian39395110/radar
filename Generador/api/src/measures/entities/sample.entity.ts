import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Datum } from './datum.entity';

@Schema({ _id: false })
export class KldSample extends Document {
  @Prop({ required: true, type: Types.Array<Datum> })
  pdat: Datum[];
  @Prop({ type: Datum })
  tdat: Datum;
  @Prop({ type: Boolean })
  isRecommended: boolean;
}
