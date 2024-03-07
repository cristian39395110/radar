import { KldSample, Measure } from "../../dopplerApi/types/Measures";
import { parseDate } from "../../utils/parseDate";

export const MEASURE_STATUS_MESSAGES = [
  "Falta el análisis de la red",
  "Completado",
  "Descartado",
  "Aun no fue analizado",
  "Corrupto",
] as const;

export type MeasureStatusMessage = (typeof MEASURE_STATUS_MESSAGES)[number];

export const measuresToRows = (measures: Measure[]) => {
  return measures.map(
    ({
      _id,
      radar,
      plate,
      isCompleted,
      isDiscarded,
      isCorrupted,
      createdAt,
      date,
      samples,
    }) => ({
      id: _id,
      radar: radar.radarId,
      plate: plate?.plate,
      createdAt: parseDate(selectCreatedDate(createdAt, samples[0], date)),
      status: booleanToStatus(
        isDiscarded,
        isCompleted,
        isCorrupted,
        plate?.plate
      ),
    })
  );
};

const booleanToStatus = (
  isDiscarded?: boolean,
  isCompleted?: boolean,
  isCorrupted?: boolean,
  plate?: string
): MeasureStatusMessage => {
  if (isCorrupted) {
    return MEASURE_STATUS_MESSAGES[4];
  }
  if (!plate) {
    return MEASURE_STATUS_MESSAGES[0];
  }
  if (isCompleted) {
    return MEASURE_STATUS_MESSAGES[1];
  }
  if (isDiscarded) {
    return MEASURE_STATUS_MESSAGES[2];
  }

  return MEASURE_STATUS_MESSAGES[3];
};

const selectCreatedDate = (
  createdAt: Date,
  sample: KldSample,
  date?: string
): Date => {
  if (date) return new Date(date);
  if (!sample) return createdAt;
  const sampleDate = sample.pdat[0].date;
  if (typeof sampleDate === "string") return new Date(sampleDate);
  return sampleDate;
};
