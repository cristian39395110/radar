import { V1ParserService } from './services/v1-parser.service';
import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { FindMaxSpeedService } from './services/find-max-speed.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private v1ParserService: V1ParserService,
    private findMaxSpeedService: FindMaxSpeedService,
  ) {}

  @Post()
  async parseCSV(@Body() payload: any) {
    const measures = await this.v1ParserService.parseArray(payload);
    return this.findMaxSpeedService.findMaxSpeed(measures);
  }
}
