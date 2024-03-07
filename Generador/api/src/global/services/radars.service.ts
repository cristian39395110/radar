import { CreateRadarDto, UpdateRadarDto } from '../../radar/dtos/radar.dtos';
import { RadarModel } from '../entity/radar.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Radar } from '../entity/radar.entity';

@Injectable()
export class RadarsService {
  private populate = ['neighborhood'];

  constructor(@InjectModel(Radar.name) private radarModel: RadarModel) {}

  findAll() {
    return this.radarModel.find().populate(this.populate).exec();
  }

  findById(id: string) {
    return this.radarModel.findById(id).populate(this.populate).exec();
  }

  findByNeighborhood(neighborhoodId: string) {
    return this.radarModel
      .find()
      .where({
        neighborhood: neighborhoodId,
      })
      .exec();
  }

  async create(payload: CreateRadarDto) {
    const radar = new this.radarModel({ ...payload });
    return radar.save();
  }

  update(id: string, payload: UpdateRadarDto) {
    return this.radarModel.findByIdAndUpdate(id, payload).exec();
  }

  delete(id: string) {
    return this.radarModel.findByIdAndUpdate(id, { isActive: false }).exec();
  }
}
