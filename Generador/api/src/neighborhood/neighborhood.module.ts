import {
  Neighborhood,
  NeighborhoodSchema,
} from './entities/neighborhood.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NeighborhoodsController } from './controllers/neighborhoods/neighborhoods.controller';
import { NeighborhoodsService } from './services/neighborhoods/neighborhoods.service';
import {
  NeighborhoodApi,
  NeighborhoodApiSchema,
} from './entities/neighborhoodApi.entity';
import { NeighborhoodApiService } from './services/neighborhood-api/neighborhood-api.service';
import { FunctionalUnitService } from './services/functional-unit/functional-unit.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Neighborhood.name,
        schema: NeighborhoodSchema,
      },
      {
        name: NeighborhoodApi.name,
        schema: NeighborhoodApiSchema,
      },
    ]),
  ],
  controllers: [NeighborhoodsController],
  providers: [
    NeighborhoodsService,
    NeighborhoodApiService,
    FunctionalUnitService,
  ],
  exports: [NeighborhoodsService, NeighborhoodApiService],
})
export class NeighborhoodModule {}
