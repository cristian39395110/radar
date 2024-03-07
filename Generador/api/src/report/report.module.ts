import { Report, ReportSchema } from './entities/report.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { MeasuresModule } from 'src/measures/measures.module';
import { NeighborhoodModule } from 'src/neighborhood/neighborhood.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Report.name,
        schema: ReportSchema,
      },
    ]),
    MeasuresModule,
    NeighborhoodModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportModule {}
