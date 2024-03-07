import { Sample } from './../dtos/sample.dtos';
import { RawV1 } from './../dtos/rawV1.dtos';
import { Injectable } from '@nestjs/common';

const rawToSample = {
  SpeedMedian: 'speed',
  Angle: 'angle',
  Distance: 'distance',
  Magnitude: 'magnitude',
  Monotonic_ns: 'timeRef',
  Time: 'date',
};

const rawTdatToSample = {
  TDAT_speed: 'speed',
  TDAT_distance: 'distance',
  Monotonic_ns: 'timeRef',
  Time: 'date',
};

@Injectable()
export class V1ParserService {
  private NS_TO_S = 1e-9;

  parseArray(payload: RawV1[]): Sample[] {
    const samples: Sample[] = [];
    let initialTime = -1;
    let lastId = -1;
    payload.forEach((value) => {
      const { id, sample } = this.parse(value);
      if (initialTime == -1) {
        initialTime = sample.pdat[0].timeRef;
      }
      sample.pdat = sample.pdat.map(({ timeRef, ...rest }) => ({
        ...rest,
        timeRef: this.parseTime(timeRef, initialTime),
      }));
      if (sample.tdat) {
        sample.tdat.timeRef = this.parseTime(sample.tdat.timeRef, initialTime);
      }
      if (id != lastId) {
        lastId = id;
        samples.push(sample);
        return;
      }
      samples.at(-1).pdat.push(...sample.pdat);
      if (sample.tdat?.speed) {
        samples.at(-1).tdat = sample.tdat;
      }
    });

    return samples;
  }

  private parseTime(t: number, t0: number) {
    const DIGITS = 1e2;
    const time = (t - t0) * this.NS_TO_S;
    return Math.trunc(time * DIGITS) / DIGITS;
  }

  private parse(raw: RawV1) {
    const entries = Object.entries(raw)
      .filter(([key]) => rawToSample[key])
      .map(([key, value]) => [rawToSample[key], value]);
    const tdatEntries = Object.entries(raw)
      .filter(([key]) => rawTdatToSample[key])
      .map(([key, value]) => [rawTdatToSample[key], value]);

    const sample = {
      pdat: [Object.fromEntries(entries)],
      tdat: Object.fromEntries(tdatEntries),
    };
    if (!sample.tdat?.speed) {
      delete sample.tdat;
    }
    return {
      sample,
      id: raw.PDAT_Sample,
    };
  }
}
