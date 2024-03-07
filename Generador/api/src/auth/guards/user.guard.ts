import { NeedRadarKey, NEED_RADAR_KEY } from './../decorators/radar.decorator';
import {
  ACCESS_LEVEL_KEY,
  IS_IMAGE_KEY,
  IS_PUBLIC_KEY,
} from './../decorators/user.decorator';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    const needRadarKey = this.reflector.get(
      NEED_RADAR_KEY,
      context.getHandler(),
    );
    const isImage = this.reflector.get(IS_IMAGE_KEY, context.getHandler());

    if (isPublic || needRadarKey || isImage) {
      return true;
    }
    const roles = this.reflector.get(ACCESS_LEVEL_KEY, context.getHandler());
    const user = request.user as {
      roles: string[];
    };
    const hasAccess = user?.roles.some((role) => roles.includes(role));
    if (!hasAccess) {
      throw new UnauthorizedException(
        'No posee los permisos necesarios para usar esta url',
      );
    }
    return true;
  }
}
