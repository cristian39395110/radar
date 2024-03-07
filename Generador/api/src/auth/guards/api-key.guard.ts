import { NEED_RADAR_KEY } from './../decorators/radar.decorator';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_IMAGE_KEY } from '../decorators/user.decorator';

export class ApiKeyGuard extends AuthGuard('apikey') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const needRadarKey = this.reflector.get(
      NEED_RADAR_KEY,
      context.getHandler(),
    );
    const isImage = this.reflector.get(IS_IMAGE_KEY, context.getHandler());
    return isImage || needRadarKey || super.canActivate(context);
  }
}
