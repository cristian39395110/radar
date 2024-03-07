import { Measure, Datum } from "../../dopplerApi/types/Measures";

type Point = number | string;

export type GraphDataset = {
  label: string;
  data: { x: Point; y: Point }[];
  backgroundColor?: string;
  borderColor?: string;
};

export type GraphData = {
  datasets: GraphDataset[];
  labels: Point[];
};

export type DataGenerator = (
  data: Datum[],
  field: keyof Datum,
  label: string,
  rects?: Constant[]
) => GraphData;

type Constant = {
  value: number;
  label: string;
};
