import { AcceptUser } from './../../../auth/decorators/user.decorator';
import { UpdateRadarDto } from './../../dtos/radar.dtos';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RadarsService } from '../../../global/services/radars.service';
import { MongoIdPipe } from 'src/common/mongo-id/mongo-id.pipe';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('radars')
export class RadarsController {
  constructor(private radarsService: RadarsService) {}

  @AcceptUser('employer', 'admin')
  @Get()
  getRadars() {
    return this.radarsService.findAll();
  }

  @AcceptUser('admin', 'employer')
  @Get(':id')
  getRadarById(@Param('id', MongoIdPipe) id: string) {
    return this.radarsService.findById(id);
  }

  @AcceptUser('admin', 'developer')
  @Put(':id')
  updateRadar(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateRadarDto,
  ) {
    return this.radarsService.update(id, payload);
  }

  @AcceptUser('admin', 'developer')
  @Delete(':id')
  deleteRadar(@Param('id', MongoIdPipe) id: string) {
    return this.radarsService.delete(id);
  }
}
