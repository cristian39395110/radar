import {
  NeighborhoodApi,
  NeighborhoodApiModel,
} from './../../entities/neighborhoodApi.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateNeighborhoodApiDto } from 'src/neighborhood/dtos/neighborhood-api.dtos';

@Injectable()
export class NeighborhoodApiService {
  constructor(
    @InjectModel(NeighborhoodApi.name)
    private neighborhoodApiModel: NeighborhoodApiModel,
  ) {}

  add(neighborhood: string, payload: CreateNeighborhoodApiDto) {
    console.log('add', neighborhood);
    const tokens = new this.neighborhoodApiModel({
      neighborhood,
      ...payload,
    });
    return tokens.save();
  }

  find(neighborhood: string) {
    return this.neighborhoodApiModel
      .findOne({ neighborhood })
      .exec()
      .then((v) => {
        const { _id, neighborhood, __v, ...rest } = v.toJSON();
        return rest;
      })
      .catch(() => {
        return null;
      });
  }

  async update(neighborhood: string, payload: CreateNeighborhoodApiDto) {
    const r = await this.neighborhoodApiModel.findOne({ neighborhood });
    console.log(r);
    if (!r) {
      return this.add(neighborhood, payload);
    }
    return r.update(payload).exec();
  }

  async updateOrCreate(
    neighborhood: string,
    payload: CreateNeighborhoodApiDto,
  ) {
    const tokens = await this.neighborhoodApiModel
      .findOne({ neighborhood })
      .exec();
    if (!tokens) return this.add(neighborhood, payload);
    return this.update(neighborhood, payload);
  }
}
