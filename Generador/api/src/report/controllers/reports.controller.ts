import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import {
  CreateReportDto,
  ReportQueryFilter,
  SentToAccessinDto,
  UpdateReportDto,
} from '../dtos/report.dto';
import { ReportsService } from '../services/reports.service';
import { AcceptUser, IsImage } from 'src/auth/decorators/user.decorator';
import { NeighborhoodsService } from 'src/neighborhood/services/neighborhoods/neighborhoods.service';
import { MeasuresService } from 'src/measures/services/measures/measures.service';
import { MongoIdPipe } from 'src/common/mongo-id/mongo-id.pipe';
import { ImageService } from 'src/measures/services/image/image.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private neighborhoodsService: NeighborhoodsService,
    private measuresServices: MeasuresService,
    private imageService: ImageService,
  ) {}

  @AcceptUser('admin', 'employer')
  @Get()
  async findAll(@Query() query: ReportQueryFilter) {
    const { neighborhood, ...rest } = query;
    return this.reportsService.findByNeighborhood(neighborhood, rest);
  }

  @AcceptUser('admin', 'employer')
  @Post()
  async createReport(@Body() payload: CreateReportDto) {
    const { actNumber, neighborhood } = payload;
    const { acronym } = await this.neighborhoodsService.update(neighborhood, {
      actNumber: actNumber + 1,
    });
    const register = await this.reportsService.add(payload, acronym);
    this.measuresServices.complete(payload.measure);
    return register;
  }

  @AcceptUser('admin', 'employer')
  @Put('sent')
  async sentToAccessin(@Body() payload: SentToAccessinDto) {
    const promises = payload.ids.map((id) =>
      this.reportsService.updateWasSent(id),
    );
    const results = await Promise.all(promises);

    return results.filter(Boolean);
  }

  @AcceptUser('admin', 'employer')
  @Get('count')
  async count(@Query() query: ReportQueryFilter) {
    const { neighborhood, ...rest } = query;
    return this.reportsService.countByNeighborhood(neighborhood, rest);
  }

  @AcceptUser('admin', 'employer')
  @Get('resumes/:neighborhood')
  async generateResume(
    @Param('neighborhood', MongoIdPipe) neighborhood: string,
    @Query() payload: ReportQueryFilter,
  ) {
    return this.reportsService.generateResume(neighborhood, payload);
  }

  @AcceptUser('admin', 'employer')
  @Get(':id')
  findById(
    @Param('id', MongoIdPipe) id: string,
    @Query('includeMeasure') includeMeasure: boolean,
  ) {
    return this.reportsService.findById(id, includeMeasure);
  }

  @AcceptUser('admin', 'employer')
  @Put(':id')
  async updateById(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateReportDto,
  ) {
    const oldReport = await this.reportsService.findById(id);
    const { acronym } = oldReport.neighborhood;
    return this.reportsService.update(id, payload, acronym);
  }

  @AcceptUser('admin')
  @Delete(':id')
  async deleteById(@Param('id', MongoIdPipe) id: string) {
    return this.reportsService.deleteReport(id);
  }

  @IsImage()
  @Get('/images/:img')
  getImg(@Param('img') img: string, @Res() res) {
    const file = this.imageService.findReportImage(img);
    file.pipe(res);
  }
}
