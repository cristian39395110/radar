import { CreateKldSample } from './../../dtos/sample.dtos';
import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';

import * as csvToJson from 'convert-csv-to-json';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CsvConverterService {
  constructor(private httpService: HttpService) {}

  async convert(file: Express.Multer.File): Promise<CreateKldSample[]> {
    const textFile = file.buffer.toString();
    const { 5: trigger } = textFile.split('\r\n');
    const csv = textFile.split(`${trigger}\r\n`).at(-1);
    writeFileSync('../temp.csv', csv);

    const rawJson = csvToJson
      .fieldDelimiter(',')
      .formatValueByType()
      .getJsonFromCsv('../temp.csv') as Array<any>;

    if (rawJson.length === 0) {
      return [];
    }

    const { data } = await this.httpService.axiosRef.post<CreateKldSample[]>(
      'http://csv-converter:8000',
      rawJson,
    );

    return data;
  }
}
