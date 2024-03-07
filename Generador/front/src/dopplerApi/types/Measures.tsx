import { Radar } from "./Radars";

export type Measure = {
  _id: string;
  radar: Radar;
  plate?: Plate;
  samples: KldSample[];
  video: string;
  isCompleted: boolean;
  isDiscarded?: boolean;
  isCorrupted?: boolean;
  pic: string;
  outliers?: Outliers;
  createdAt: Date;
  updatedAt: Date;
  date?: string;
};

export type KldSample = Kld7Sample;

type Kld7Sample = {
  pdat: Datum[];
  tdat?: Datum;
  isRecommended?: boolean;
};

type Kld2Sample = {
  sample: Datum;
};

export type Outliers = {
  speed?: boolean;
  step?: boolean;
  moreThanOneCar?: boolean;
};

export type Datum = {
  speed: number;
  date: string;
  timeRef: number;
  distance?: number;
  magnitude?: number;
  angle?: number;
};

type Plate = {
  plate: string;
  security: number;
  _id: string;
};

export type FilterMeasures = {
  plate: boolean;
  radar: string;
  asc: boolean;
};

export type QueryMeasures = {
  time: {
    start?: Date;
    end?: Date;
  };
  plate: boolean;
  neighborhood?: string;
  isDiscarded: boolean;
  isCompleted: boolean;
};
