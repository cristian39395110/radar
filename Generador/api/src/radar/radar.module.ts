
import { NeighborhoodModule } from './../neighborhood/neighborhood.module';
import { Module } from '@nestjs/common';
import { RadarsController } from './controllers/radars/radars.controller';

@Module({
  imports: [NeighborhoodModule],
  controllers: [RadarsController],
})
export class RadarModule {}
