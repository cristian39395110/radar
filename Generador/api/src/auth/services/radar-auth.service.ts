import { Radar } from './../../global/entity/radar.entity';
import { randomUUID } from 'crypto';
import { CreateRadarDto } from './../../radar/dtos/radar.dtos';
import { RadarsService } from './../../global/services/radars.service';
import { RadarAuth, RadarAuthModel } from './../entities/radar-auth.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RadarAuthService {
  constructor(
    @InjectModel(RadarAuth.name) private radarAuthModel: RadarAuthModel,
    private radarsService: RadarsService,
  ) {}

  async findAll(loadRadar = false) {
    const radarApikeys = await this.radarAuthModel.find().exec();
    if (!loadRadar) return radarApikeys;

    const radarsPromises = radarApikeys.map(async ({ apikey, radar: id }) => {
      const radar = await this.radarsService.findById(id as string);

      return {
        ...radar.toJSON(),
        apikey,
      };
    });

    const results = await Promise.allSettled(radarsPromises);

    return results
      .filter((r) => r.status === 'fulfilled')
      .map(({ value }: any) => value);
  }

  async findByApikey(apikey: string) {
    const radarAuth = await this.radarAuthModel
      .findOne({ apikey })
      .populate('radar')
      .exec();
    if (!radarAuth) return false;
    const { isActive } = radarAuth?.radar as Radar;
    return isActive && radarAuth;
  }

  async create(payload: CreateRadarDto) {
    const radar = await this.radarsService.create(payload);
    const radarAuth = new this.radarAuthModel({ radar: radar._id });
    const { apikey } = await radarAuth.save();
    return {
      ...radar.toJSON(),
      apikey,
    };
  }

  updateApiKey(radarId: string) {
    const apikey = randomUUID();
    return this.radarAuthModel
      .findOneAndUpdate({ radar: radarId }, { apikey }, { new: true })
      .exec();
  }

  async findApiKey(radarId: string) {
    const { apikey } = await this.radarAuthModel.findOne({
      radar: radarId,
    });
    return apikey;
  }
}
