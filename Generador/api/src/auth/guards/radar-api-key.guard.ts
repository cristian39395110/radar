import { NEED_RADAR_KEY } from './../decorators/radar.decorator';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RadarApiKeyGuard extends AuthGuard('radar') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const needRadarKey = this.reflector.get(
      NEED_RADAR_KEY,
      context.getHandler(),
    );
    if (!needRadarKey) {
      return true;
    }
    return super.canActivate(context);
  }
}
