import { IS_IMAGE_KEY, IS_PUBLIC_KEY } from './../decorators/user.decorator';
import { NEED_RADAR_KEY } from './../decorators/radar.decorator';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const needRadarApiKey = this.reflector.get(
      NEED_RADAR_KEY,
      context.getHandler(),
    );
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    const isImage = this.reflector.get(IS_IMAGE_KEY, context.getHandler());
    if (isPublic || needRadarApiKey || isImage) {
      return true;
    }
    return super.canActivate(context);
  }
}
