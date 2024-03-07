import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { V1ParserService } from './services/v1-parser.service';
import { FindMaxSpeedService } from './services/find-max-speed.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, V1ParserService, FindMaxSpeedService],
})
export class AppModule {}
