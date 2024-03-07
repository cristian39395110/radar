import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AcceptUser, IsPublic } from 'src/auth/decorators/user.decorator';
import { MongoIdPipe } from 'src/common/mongo-id/mongo-id.pipe';
import { MeasuresService } from 'src/measures/services/measures/measures.service';
import { NeedRadarKey } from '../../auth/decorators/radar.decorator';
import { AddPlateDto, CreateMeasureDto } from '../dtos/measure.dtos';
import { CsvConverterService } from '../services/csv-converter/csv-converter.service';
import { RecordService } from '../services/record/record.service';
import { FilterMeasureDto } from './../dtos/measure.dtos';
import { ImageService } from '../services/image/image.service';
import { Measure } from '../entities/measure.entity';
import { OutliersService } from '../services/outliers.service';

@ApiTags('Measures', 'Admin')
@Controller('measures')
export class MeasuresController {
  constructor(
    private measuresService: MeasuresService,
    private recordService: RecordService,
    private csvConverterService: CsvConverterService,
    private imageService: ImageService,
    private outliersService: OutliersService,
  ) {}

  @AcceptUser('admin', 'employer', 'developer')
  @Get()
  async getMeasures(@Query('query') query: string) {
    return this.measuresService.findAll(JSON.parse(query));
  }

  @ApiTags('Radar')
  @NeedRadarKey()
  @Post()
  addMeasure(@Body() payload: CreateMeasureDto) {
    return this.measuresService.add(payload);
  }

  @AcceptUser('admin', 'employer', 'developer')
  @Get(':neighborhood/ids')
  async findIds(@Param('neighborhood', MongoIdPipe) neighborhoodId: string) {
    return this.measuresService.getIdsByNeighborhood(neighborhoodId);
  }

  @AcceptUser('admin', 'employer', 'developer')
  @Get(':neighborhood/count')
  async getCounterByNeighborhood(
    @Param('neighborhood', MongoIdPipe) neighborhoodId: string,
  ) {
    return this.measuresService.countByNeighbourhood(neighborhoodId);
  }

  @IsPublic()
  @Get('/videos')
  async getVideosId(@Query() query: FilterMeasureDto): Promise<string[]> {
    const measures = await this.measuresService
      .findAll({ ...query, plate: false })
      .then((r) => r.map((x) => x.toJSON<Measure>()));
    return measures.map((x) => x.video);
  }

  @AcceptUser('admin', 'employer', 'developer')
  @Get('/byneighborhood')
  async getMeasureByNeighborhood(@Query('neighborhood') neighborhood: string) {
    return this.measuresService.findByNeighborhood(neighborhood);
  }

  @ApiTags('Radar')
  @NeedRadarKey()
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'video',
        maxCount: 1,
      },
      {
        name: 'csv',
        maxCount: 1,
      },
    ]),
  )
  @Post('/csv')
  async addMeasureWithCsv(@Req() req, @UploadedFiles() files) {
    const video = files.video[0];
    const csv = files.csv[0];
    const radar = req.user;
    const videoId = this.recordService.save(video);
    const samples = await this.csvConverterService.convert(csv);
    if (samples.length === 0) {
      await this.measuresService.addCorrupted(radar._id, new Date(), videoId);
      return false;
    }
    const outliers = this.outliersService.find(samples);
    await this.measuresService.add({
      radar: radar._id,
      samples,
      outliers,
      video: videoId,
      date: samples[0].pdat[0].date,
    });
    return true;
  }

  @NeedRadarKey()
  @Post('/corrupted')
  async addCorruptedMeasure(@Body('date') date: string, @Req() req) {
    const radar = req.user;
    const parsedDate = new Date(date);
    const r = await this.measuresService.addCorrupted(radar._id, parsedDate);
    console.log(r);
    console.log(r);
    return true;
  }

  @AcceptUser('admin', 'employer')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'plate',
        maxCount: 1,
      },
      {
        name: 'car',
        maxCount: 1,
      },
    ]),
  )
  @Put('/csv/:id')
  updateImage(@Param('id') id: string, @UploadedFiles() files) {
    if (files.plate) {
      const plate = files.plate[0];
      return this.imageService.addPic(id, plate, 'plates');
    }
    if (files.car) {
      const car = files.car[0];
      return this.imageService.addPic(id, car, 'images');
    }
  }

  @IsPublic()
  @Put('/:video_id/plate')
  async updatePlate(
    @Param('video_id') videoId: string,
    @Body() payload: AddPlateDto,
  ) {
    await this.measuresService.addPlate(videoId, payload);
    return { id: videoId };
  }

  @AcceptUser('admin', 'employer', 'developer')
  @Get(':id')
  getMeasureById(@Param('id', MongoIdPipe) id: string) {
    return this.measuresService.findByid(id);
  }

  @AcceptUser('admin', 'employer', 'developer')
  @Put(':id/discard')
  updateDiscard(@Param('id', MongoIdPipe) id: string) {
    return this.measuresService.discard(id);
  }

  @AcceptUser('admin', 'employer', 'developer')
  @Put(':id/completed')
  updateCompleted(@Param('id', MongoIdPipe) id: string) {
    return this.measuresService.complete(id);
  }

  @AcceptUser('admin')
  @Delete(':id')
  async deleteMeasure(@Param('id', MongoIdPipe) id: string) {
    const isDeleted = await this.delete(id);
    if (!isDeleted) {
      throw new InternalServerErrorException(
        'No fue posible eliminar la medición',
      );
    }
    return {
      id,
      deleted: true,
    };
  }

  private async delete(id: string) {
    const measure = (await this.measuresService.findByid(id)).toJSON<Measure>();
    const { video } = measure;
    const videoIsDeleted = await this.recordService.delete(video);
    const imagesAreDeleted = await this.imageService.delete(video);
    if (videoIsDeleted && imagesAreDeleted) {
      await this.measuresService.delete(id);
      return true;
    }
    return false;
  }
}
