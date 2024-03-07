import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Role } from '../decorators/user.decorator';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true })
  fullName: string;
  @Prop({ required: true, type: [String], default: ['employer'] })
  roles: Role[];
  @Prop({ required: true })
  password: string;
}

export type UserModel = Model<User>;

export const UserSchema = SchemaFactory.createForClass(User);
 