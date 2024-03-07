import { Report, ReportModel } from './../entities/report.entity';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import {
  CreateReportDto,
  CreateSrcDto,
  ReportQueryFilter,
  UpdateReportDto,
} from '../dtos/report.dto';
import { ImageService } from '../../measures/services/image/image.service';
import { LeanDocument } from 'mongoose';
import { Measure } from 'src/measures/entities/measure.entity';

@Injectable()
export class ReportsService {
  private populate = ['neighborhood', 'radar'];
  private NO_PLATE = 'XXXXXXX';
  constructor(
    @InjectModel(Report.name) private reportModel: ReportModel,
    private imageService: ImageService,
  ) {}

  findByNeighborhood(neighborhood: string, query?: ReportQueryFilter) {
    const filter = {} as any;
    const key = this.getKeyByMode(query.mode);
    if (query.start && query.end) {
      filter[key] = {
        $gte: query.start,
        $lte: query.end,
      };
    }
    if (query.wasSent === false) {
      filter['$or'] = [{ wasSent: false }, { wasSent: { $exists: false } }];
    }
    return this.reportModel
      .find({
        ...filter,
        neighborhood,
      })
      .populate(['neighborhood', 'radar'])
      .exec();
  }

  findById(id: string, includeMeasure = false) {
    const populate = [...this.populate];
    includeMeasure && populate.push('measure');
    return this.reportModel.findById(id).populate(populate).exec();
  }

  async add(payload: CreateReportDto, acronym: string) {
    try {
      const src = this.parseSrc({
        ...payload.src,
        domain:
          payload.plate === this.NO_PLATE ? undefined : payload.src.domain,
      });
      const actNumber = payload.actNumber.toString().padStart(4, '0');
      const report = new this.reportModel({
        ...payload,
        actNumber: `${acronym}${actNumber}`,
        src,
      });
      const r = await report.save();
      return r.toJSON();
    } catch (e) {
      throw new HttpException(
        'Problema en la base de datos: ' + e.message,
        404,
      );
    }
  }

  async update(id: string, payload: UpdateReportDto, acronym: string) {
    const { src, ...rest } = payload;
    const newReportData: any = {};
    if (payload.actNumber) {
      const actNumber = payload.actNumber.toString().padStart(4, '0');
      newReportData.actNumber = acronym + actNumber;
    }

    if (src) {
      const report = await this.reportModel
        .findById(id)
        .populate(['measure'])
        .exec();
      const measure = report.measure as Measure;
      Object.keys(src).forEach((key) => {
        const name = report.src[key];
        if (src[key] === name) return;
        this.imageService.updateReportImage(
          name,
          measure.video,
          src[key],
          key === 'car' ? 'images' : 'plates',
        );
      });
    }

    return this.reportModel.findByIdAndUpdate(id, {
      ...rest,
      ...newReportData,
    });
  }

  async deleteReport(id: string) {
    return this.reportModel.findByIdAndDelete(id);
  }

  async countByNeighborhood(neighborhood: string, query: ReportQueryFilter) {
    const filter = {} as any;
    const key = this.getKeyByMode(query.mode);
    if (query.start && query.end) {
      filter[key] = {
        $gte: query.start,
        $lte: query.end,
      };
    }
    if (query.wasSent === false) {
      filter['$or'] = [{ wasSent: false }, { wasSent: { $exists: false } }];
    }
    return await this.reportModel
      .find(filter)
      .countDocuments({
        neighborhood,
      })
      .exec();
  }

  async updateWasSent(id: string): Promise<string | null> {
    try {
      await this.reportModel
        .findByIdAndUpdate(id, {
          wasSent: true,
        })
        .exec();
      return id;
    } catch (err) {
      return null;
    }
  }

  async generateResume(neighborhood: string, query: ReportQueryFilter) {
    const reports = await this.findByNeighborhood(neighborhood, query).then(
      (reports) => reports.map((r) => r.toJSON<LeanDocument<Report>>()),
    );
    const resume = reports.map((r) => {
      const { date, actNumber, plate, speed, radar } = r;
      const { location, maxSpeed, model, radarId } = radar;
      return {
        date,
        actNumber,
        plate,
        speed,
        location,
        maxSpeed,
        model,
        radarId,
      };
    });
    return resume;
  }

  private parseSrc(src: CreateSrcDto): CreateSrcDto {
    const srcEntrie = Object.entries(src)
      .filter(([_, value]) => !!value)
      .map(([key, value]) => {
        const { name, image } = this.getNameAndImage(value);
        return [
          key,
          this.imageService.moveToReportFolder(
            name,
            image,
            key === 'car' ? 'images' : 'plates',
          ),
        ];
      });

    return Object.fromEntries(srcEntrie);
  }

  private getNameAndImage(subUrl: string) {
    const result = subUrl.split('/');
    return {
      name: result[2],
      image: result[4],
    };
  }

  private getKeyByMode(mode?: 'measure' | 'generation') {
    if (mode === 'generation') return 'createdAt';
    return 'date';
  }
}
