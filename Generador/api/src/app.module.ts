import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NeighborhoodModule } from './neighborhood/neighborhood.module';
import { DatabaseModule } from './database/database.module';
import { RadarModule } from './radar/radar.module';
import { MeasuresModule } from './measures/measures.module';
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global/global.module';
import { ReportModule } from './report/report.module';

import * as Joi from 'joi';

import config from './config';

const validationSchema = Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_DB_NAME: Joi.string().required(),
  SECRET: Joi.string().required(),
  API_KEY: Joi.string().required(),
});

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema,
    }),
    NeighborhoodModule,
    RadarModule,
    MeasuresModule,
    AuthModule,
    GlobalModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
