import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeasuresController } from './controllers/measures.controller';
import { Measure, MeasureSchema } from './entities/measure.entity';
import { MeasuresService } from './services/measures/measures.service';
import { RecordController } from './controllers/record.controller';
import { RecordService } from './services/record/record.service';
import { CsvConverterService } from './services/csv-converter/csv-converter.service';
import { HttpModule } from '@nestjs/axios';
import { ImageService } from './services/image/image.service';
import { OutliersService } from './services/outliers.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Measure.name, schema: MeasureSchema }]),
    HttpModule,
  ],
  providers: [
    MeasuresService,
    RecordService,
    CsvConverterService,
    ImageService,
    OutliersService,
  ],
  controllers: [MeasuresController, RecordController],
  exports: [ImageService, MeasuresService],
})
export class MeasuresModule {}
