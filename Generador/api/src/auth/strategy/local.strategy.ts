import { UserService } from './../services/user.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UnauthorizedException, Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private userService: UserService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.userService.validate({
      username,
      password,
    });
    if (!user) {
      throw new UnauthorizedException('Datos incorrectos');
    }
    return user;
  }
}
