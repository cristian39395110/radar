import { Datum } from "../../dopplerApi/types/Measures";

export const findMaxSpeed = (data: Datum[]) => {
  const speeds = data.map((datum) => Math.abs(datum.speed));
  const max = Math.max(...speeds);
  return data.find((datum) => Math.abs(datum.speed) === max) as Datum;
};
