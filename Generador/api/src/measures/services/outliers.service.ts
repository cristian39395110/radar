import { Injectable } from '@nestjs/common';
import { CreateOutlierDto } from '../dtos/outliers.dto';
import { CreateKldSample } from '../dtos/sample.dtos';
import { KldSample } from '../entities/sample.entity';

type OutliersOptions = {
  maxStep?: number;
};

type Sample = CreateKldSample | KldSample;

@Injectable()
export class OutliersService {
  find(measures: Sample[], options?: OutliersOptions): CreateOutlierDto {
    return {
      speed: this.diferentSpeeds(measures),
      step: this.step(measures, options?.maxStep),
    };
  }

  diferentSpeeds(measures: Sample[]): boolean {
    const speeds = this.mapSpeeds(measures);
    const min = Math.min(...speeds);
    const max = Math.max(...speeds);
    return Math.abs(max - min) > Math.abs(max);
  }

  step(measures: Sample[], maxStep = 0.5): boolean {
    return this.mapSpeeds(measures)
      .map((speed) => Math.abs(speed))
      .some((speed, i, array) => {
        if (i === 0) return;
        const speedsAns = array[i - 1];
        const isOutlier = Math.abs(speed / speedsAns - 1) > maxStep;
        return isOutlier;
      });
  }

  private mapSpeeds(measures: Sample[]) {
    return measures.flatMap((x) => x.pdat.map((y) => y.speed));
  }
}
