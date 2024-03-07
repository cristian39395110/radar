import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import Strategy from 'passport-headerapikey';

import config from '../../config';

@Injectable()
export class ApikeyStrategy extends PassportStrategy(Strategy, 'apikey') {
  private apikey: string;
  constructor(@Inject(config.KEY) configService: ConfigType<typeof config>) {
    super(
      {
        header: 'x-api-key',
        prefix: 'app',
      },
      false,
    );

    this.apikey = configService.apikey.trim();
  }

  async validate(apikey: string) {
    if (!(this.apikey.trim() === apikey.trim())) {
      throw new UnauthorizedException('Usted no posee una apikey valida');
    }
    return true;
  }
}
