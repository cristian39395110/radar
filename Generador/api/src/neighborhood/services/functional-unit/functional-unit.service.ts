import { Inject, Injectable } from '@nestjs/common';
import fs from 'fs';
import { CreateFunctionalUnit } from 'src/neighborhood/dtos/functional-units.dto';
import {
  Neighborhood,
  NeighborhoodModel,
} from 'src/neighborhood/entities/neighborhood.entity';

import * as csvToJson from 'convert-csv-to-json';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FunctionalUnitService {
  constructor(
    @InjectModel(Neighborhood.name)
    private neighborhoodModel: NeighborhoodModel,
  ) {}

  async updateFunctionalUnits(
    neighborhoodId: string,
    functionalUnits: CreateFunctionalUnit[],
  ) {
    console.log(functionalUnits);
    const result = await this.neighborhoodModel
      .findByIdAndUpdate(
        neighborhoodId,
        {
          functionalUnits: functionalUnits.map((x) => ({
            ...x,
            plates: x.plates.map((p) => p.toUpperCase()),
          })),
        },
        { new: true },
      )
      .exec();

    return result.functionalUnits?.length;
  }

  async updateFuctionalUnitsByCSV(
    neighborhoodId: string,
    file: Express.Multer.File,
  ) {
    const data = file.buffer.toString();
    fs.writeFileSync('../fu-temp.csv', data);
    const rawJson = csvToJson
      .fieldDelimiter(',')
      .formatValueByType()
      .getJsonFromCsv('../fu-temp.csv') as Array<{
      unidadFuncinal: string;
      dueño?: string;
      patente: string;
    }>;

    const rawFunctionalUnits: {
      [key: string]: { plates: string[]; homeowner?: string };
    } = rawJson.reduce((groups, value) => {
      if (Object.keys(groups).includes(value.unidadFuncinal)) {
        groups[value.unidadFuncinal].plates.push(value.patente);
        return groups;
      }
      groups[value.unidadFuncinal] = {
        plates: [value.patente],
        homeowner: value.dueño,
      };
      return groups;
    }, {});

    const functionalUnits: CreateFunctionalUnit[] = Object.entries(
      rawFunctionalUnits,
    ).map(([name, values]) => ({
      name,
      ...values,
    }));

    return this.updateFunctionalUnits(neighborhoodId, functionalUnits);
  }
}
