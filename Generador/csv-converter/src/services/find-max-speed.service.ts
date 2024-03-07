import { Injectable } from '@nestjs/common';
import { Sample } from 'src/dtos/sample.dtos';

@Injectable()
export class FindMaxSpeedService {
  findMaxSpeed(measures: Sample[], margin = 1): Sample[] {
    const tEnd = measures.at(-1).pdat[0].timeRef;
    let index = -1;
    let maxSpeed = 0;
    measures.forEach((measure, i) => {
      const { pdat } = measure;
      const ti = pdat[0].timeRef;
      const speeds = pdat.map((x) => Math.abs(x.speed));
      if (ti > tEnd - margin || ti < margin) {
        return;
      }
      if (Math.max(maxSpeed, ...speeds) === maxSpeed) {
        return;
      }
      index = i;
      maxSpeed = Math.max(...speeds);
    });

    if (index != -1) {
      measures[index].isRecommended = true;
    }

    return measures;
  }
}
