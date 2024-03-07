export class Sample {
  pdat?: Datum[]; //kld2 measure
  tdat?: Datum;
  isRecommended?: boolean;
}

export class Datum {
  speed: number;
  distance: number;
  date?: number;
  timeRef: number;
  magnitude?: number;
  angle?: number;
}
