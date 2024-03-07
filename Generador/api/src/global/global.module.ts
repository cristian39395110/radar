import { RadarsService } from './services/radars.service';
import { Radar, RadarSchema } from './entity/radar.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Radar.name,
        schema: RadarSchema,
      },
    ]),
  ],
  providers: [RadarsService],
  exports: [RadarsService],
})
export class GlobalModule {}
