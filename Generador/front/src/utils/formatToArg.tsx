import { format, utcToZonedTime } from "date-fns-tz";

const MIN_TO_MILISECONDS = 60000;

export const formatToArg = (date: Date | string, fmt: string) => {
  return format(utcToZonedTime(date, "UTC"), fmt, { timeZone: "UTC" });
};

export const parseDateToCorrectFormat = (date: string): Date => {
  const parsedDate = new Date(date);
  return new Date(
    parsedDate.getTime() - parsedDate.getTimezoneOffset() * MIN_TO_MILISECONDS
  );
};
