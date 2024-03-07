import { DOPPLER_URL } from "./doppler";

export const toReportImage = (image: string) =>
  `${DOPPLER_URL}/reports/images/${image}`;
