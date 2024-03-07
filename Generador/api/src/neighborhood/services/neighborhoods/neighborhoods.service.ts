import { NeighborhoodApiService } from '../neighborhood-api/neighborhood-api.service';
import {
  CreateNeighborhoodDto,
  UpdateNeigborhoodDto,
} from './../../dtos/neighborhood.dtos';
import {
  Neighborhood,
  NeighborhoodModel,
} from './../../entities/neighborhood.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NeighborhoodsService {
  constructor(
    @InjectModel(Neighborhood.name)
    private neighborhoodModel: NeighborhoodModel,
    private neighborhoodApiServices: NeighborhoodApiService,
  ) {}

  findAll(isActive = true) {
    return this.neighborhoodModel.find().where({ isActive }).exec();
  }

  findById(id: string) {
    return this.neighborhoodModel.findById(id).exec();
  }

  findByName(name: string | RegExp) {
    if (typeof name === 'string') {
      name = name.toLowerCase();
    }
    return this.neighborhoodModel
      .find()
      .where({
        name,
      })
      .exec();
  }

  async create(payload: CreateNeighborhoodDto) {
    const { tokens, ...rest } = payload;
    const neighborhood = await new this.neighborhoodModel({
      ...rest,
      name: payload.name.toLowerCase(),
    }).save();
    await this.neighborhoodApiServices.add(neighborhood._id, tokens);

    return neighborhood.save();
  }

  update(id: string, payload: UpdateNeigborhoodDto) {
    return this.neighborhoodModel
      .findByIdAndUpdate(id, {
        ...payload,
        name: payload?.name?.toLowerCase(),
      })
      .exec();
  }

  //! para no borrar a los barrios importantes solo se los pone como inactivos
  delete(id: string) {
    return this.neighborhoodModel
      .findByIdAndUpdate(id, {
        isActive: false,
      })
      .exec();
  }

  //! Ojo con la eliminación de barrios
  forceDelete(id: string) {
    return this.neighborhoodModel.findByIdAndDelete(id).exec();
  }

  async addPlatesToWhiteList(id: string, plates: string[]) {
    const neighborhood = await this.neighborhoodModel.findById(id);
    const validPlates = plates
      .filter((plate) => !neighborhood.whiteList.includes(plate))
      .map((plate) => plate.toUpperCase());
    return this.neighborhoodModel.findByIdAndUpdate(id, {
      $push: {
        whiteList: {
          $each: validPlates,
        },
      },
    });
  }

  deletePlatesToWhiteList(id: string, plates: string[]) {
    plates = plates.map((plate) => plate.toUpperCase());
    return this.neighborhoodModel.findByIdAndUpdate(id, {
      $pull: {
        whiteList: { $in: plates },
      },
    });
  }
}
