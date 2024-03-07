import { RadarStrategy } from './strategy/radar.strategy';
import { JwtGuard } from './guards/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { RadarAuth, RadarAuthSchema } from './entities/radar-auth.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigType } from '@nestjs/config';
import { LocalStrategy } from './strategy/local.strategy';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './services/user.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RadarAuthService } from './services/radar-auth.service';

import config from '../config';
import { ApikeyStrategy } from './strategy/apikey.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: RadarAuth.name,
        schema: RadarAuthSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.secret,
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
      inject: [config.KEY],
    }),
    PassportModule,
  ],
  providers: [
    UserService,
    LocalStrategy,
    JwtStrategy,
    RadarStrategy,
    RadarAuthService,
    ApikeyStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
