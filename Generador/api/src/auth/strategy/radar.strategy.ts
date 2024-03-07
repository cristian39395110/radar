import { UnauthorizedException, Injectable } from '@nestjs/common';
import { RadarAuthService } from './../services/radar-auth.service';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';

@Injectable()
export class RadarStrategy extends PassportStrategy(Strategy, 'radar') {
  constructor(private radarAuthService: RadarAuthService) {
    super(
      {
        header: 'Authorization',
        prefix: 'radar',
      },
      false,
    );
  }

  async validate(apikey: string) {
    const radarAuth = await this.radarAuthService.findByApikey(apikey.trim());
    if (!radarAuth) {
      throw new UnauthorizedException('Apikey invalida');
    }
    return radarAuth.radar;
  }
}
