import { RadarsService } from './../../../global/services/radars.service';
import {
  CreateMeasureDto,
  AddPlateDto,
  FilterMeasureDto,
} from './../../dtos/measure.dtos';
import { Measure, MeasureModel } from './../../entities/measure.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

@ApiSecurity('employer')
@Injectable()
export class MeasuresService {
  private populate = ['radar'];
  constructor(
    @InjectModel(Measure.name) private measureModel: MeasureModel,
    private radarsService: RadarsService,
  ) {}

  async findAll(filters?: FilterMeasureDto) {
    const where: any = {};

    if (filters.radars) {
      where.radar = {
        $in: filters.radars,
      };
    }

    if (filters.time) {
      where.createdAt = {
        $gte: new Date(filters.time.start),
        $lte: new Date(filters.time.end),
      };
    }

    if (filters.neighborhood) {
      const radars = await this.radarsService.findByNeighborhood(
        filters.neighborhood,
      );
      const ids = radars.map(({ _id }) => _id as string);
      where.radar = {
        $in: ids,
      };
    }
    return await this.measureModel
      .find()
      .where({
        plate: {
          $exists: filters.plate,
        },
        isDiscarded: {
          $in: [false, filters.isDiscarded],
        },
        isCompleted: {
          $in: [false, filters.isCompleted],
        },
        isCorrupted: {
          $in: [false, filters.isCorrupted, true],
        },
        ...where,
      })
      .populate(this.populate)
      .exec();
  }

  async getIdsByNeighborhood(neighborhoodId: string): Promise<Array<string>> {
    const measures = await this.findByNeighborhood(neighborhoodId);
    return measures
      .map((m) => {
        const _id = m._id;
        const baseDate = m.date;
        const firstSampleDate = m.samples[0].pdat[0].date;
        const date = baseDate || firstSampleDate;
        return {
          _id,
          date: typeof date === 'string' ? new Date(date) : date,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ _id }) => _id);
  }

  async findByNeighborhood(neighborhood: string) {
    const radars = await this.radarsService.findByNeighborhood(neighborhood);
    const ids = radars.map(({ _id }) => _id as string);
    return this.measureModel
      .where({
        radar: {
          $in: ids,
        },
        plate: {
          $exists: true,
        },
        isDiscarded: {
          $ne: true,
        },
        isCorrupted: {
          $ne: true,
        },
        isCompleted: false,
      })
      .populate(this.populate)
      .exec();
  }

  findBySensor(sensor: string) {
    return this.measureModel.find().where({ sensor }).exec();
  }

  findByid(id: string) {
    return this.measureModel
      .findById(id)
      .populate({
        path: 'radar',
        populate: {
          path: 'neighborhood',
        },
      })
      .exec();
  }

  findDoesNotPlate() {
    return this.measureModel.find().where({ plate: undefined }).exec();
  }

  async countByNeighbourhood(neighbourhood: string, isCompleted = false) {
    const radars = await this.radarsService.findByNeighborhood(neighbourhood);
    return this.measureModel
      .countDocuments({
        isCompleted,
        radar: {
          $in: radars.map((r) => r._id),
        },
        plate: {
          $exists: true,
        },
        isDiscarded: {
          $ne: true,
        },
      })
      .exec();
  }

  add(payload: CreateMeasureDto) {
    const measure = new this.measureModel({ isCompleted: false, ...payload });
    return measure.save();
  }

  addCorrupted(radar: string, date: Date, video?: string) {
    const measure = new this.measureModel({
      isDiscarded: true,
      isCorrupted: true,
      samples: [],
      video: video || randomUUID(),
      radar,
      date,
    });
    return measure.save();
  }

  async addPlate(videoId: string, payload: AddPlateDto) {
    const { pic, moreThanOneCar, ...plate } = payload;
    const measure = await this.measureModel
      .findOne({ videoId: videoId })
      .exec();
    //TODO: habria que solucionar el problema del tipeo
    const radar = await this.radarsService.findById(measure.radar);
    const neighborhood = radar.neighborhood as any;
    const isInWhiteList = neighborhood.whiteList.includes(plate.plate);
    return this.measureModel
      .findOneAndUpdate(
        { video: videoId },
        {
          plate,
          pic,
          'outliers.moreThanOneCar': moreThanOneCar,
          isDiscarded: isInWhiteList,
        },
        { new: true },
      )
      .exec();
  }

  complete(id: string) {
    return this.measureModel
      .findByIdAndUpdate(id, { isCompleted: true }, { new: true })
      .exec();
  }

  discard(id: string) {
    return this.measureModel
      .findByIdAndUpdate(
        id,
        {
          isDiscarded: true,
        },
        { new: true },
      )
      .exec();
  }

  async delete(id: string) {
    return this.measureModel.findByIdAndDelete(id);
  }
}
