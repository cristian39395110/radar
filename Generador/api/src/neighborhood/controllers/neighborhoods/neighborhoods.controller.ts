import { NeighborhoodApiService } from './../../services/neighborhood-api/neighborhood-api.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MongoIdPipe } from '../../../common/mongo-id/mongo-id.pipe';
import { AcceptUser } from './../../../auth/decorators/user.decorator';
import {
  CreateNeighborhoodDto,
  FindNeighborhoodDto,
  UpdateNeigborhoodDto,
  UpdateWhiteListDto,
} from './../../dtos/neighborhood.dtos';
import { NeighborhoodsService } from './../../services/neighborhoods/neighborhoods.service';
import { FunctionalUnitService } from 'src/neighborhood/services/functional-unit/functional-unit.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFunctionalUnit } from 'src/neighborhood/dtos/functional-units.dto';

@ApiTags('Neighborhoods', 'Admin')
@Controller('neighborhoods')
export class NeighborhoodsController {
  constructor(
    private neighborhoodsService: NeighborhoodsService,
    private neighborhoodApiService: NeighborhoodApiService,
    private functionalUnitService: FunctionalUnitService,
  ) {}

  @AcceptUser('admin', 'employer', 'developer')
  @Get()
  async getNeighborhoods(
    @Query() { isActive, t: includeTokens }: FindNeighborhoodDto,
  ) {
    const neighborhoods = await this.neighborhoodsService.findAll(isActive);
    if (!includeTokens) return neighborhoods;
    const neighborhoodsWithTokensPromises = neighborhoods.map(async (n) => {
      const neighborhood = n.toJSON();
      const tokens = await this.neighborhoodApiService.find(
        String(neighborhood._id),
      );
      console.log(tokens);
      return {
        ...neighborhood,
        tokens,
      };
    });
    return Promise.all(neighborhoodsWithTokensPromises);
  }

  @AcceptUser('admin', 'developer')
  @Post('')
  async addNeighborhood(@Body() payload: CreateNeighborhoodDto) {
    try {
      const { name, tokens, ...rest } = payload;
      const { _id } = await this.neighborhoodsService.create({
        name: name.toLowerCase(),
        ...rest,
      });
      if (tokens) {
        await this.neighborhoodApiService.add(_id, tokens);
      }
      return _id;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  @AcceptUser('admin', 'employer', 'developer')
  @Get(':id')
  async getNeighborhoodById(
    @Param('id', MongoIdPipe) id: string,
    @Query('t') includeTokens = false,
  ) {
    const neighborhood = (
      await this.neighborhoodsService.findById(id)
    ).toJSON();
    if (includeTokens) {
      const tokens = await this.neighborhoodApiService.find(id);
      return {
        ...neighborhood,
        tokens,
      };
    }
    return neighborhood;
  }

  @AcceptUser('admin', 'developer')
  @Put(':id')
  async updateNeighborhood(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateNeigborhoodDto,
  ) {
    const { tokens, ...rest } = payload;
    await this.neighborhoodApiService.update(id, tokens);
    return this.neighborhoodsService.update(id, rest);
  }

  @AcceptUser('admin', 'developer')
  @Delete(':id')
  deleteNeighborhood(@Param('id', MongoIdPipe) id: string) {
    return this.neighborhoodsService.delete(id);
  }

  @AcceptUser('admin')
  @Delete(':id/force')
  forceDeleteNeighborhood(@Param('id') id: string) {
    return this.neighborhoodsService.forceDelete(id);
  }

  @AcceptUser('admin')
  @Post(':id/homeowners')
  updateHomeowners(
    @Param('id', MongoIdPipe) id: string,
    @Body('data') functionalUnits: CreateFunctionalUnit[],
  ) {
    return this.functionalUnitService.updateFunctionalUnits(
      id,
      functionalUnits,
    );
  }

  @AcceptUser('admin')
  @UseInterceptors(FileInterceptor('homeowners'))
  @Post(':id/homeowners/csv')
  async updateHomeownersWithCSV(
    @Param('id', MongoIdPipe) id: string,
    @UploadedFile() file,
  ) {
    return this.functionalUnitService.updateFuctionalUnitsByCSV(id, file);
  }

  @AcceptUser('admin', 'developer')
  @Put(':id/white-list')
  async updateWhiteList(
    @Param('id') id: string,
    @Body() payload: UpdateWhiteListDto,
  ) {
    return this.neighborhoodsService.addPlatesToWhiteList(id, payload.plates);
  }

  @AcceptUser('admin', 'developer')
  @Delete(':id/white-list')
  async deletePlatesList(
    @Param('id') id: string,
    @Body() payload: UpdateWhiteListDto,
  ) {
    return this.neighborhoodsService.deletePlatesToWhiteList(
      id,
      payload.plates,
    );
  }
}
