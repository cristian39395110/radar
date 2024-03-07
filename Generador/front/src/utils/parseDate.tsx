import { formatToArg } from "./formatToArg";

export const parseDateToHour = (date: Date) => {
  return formatToArg(date, "HH:mm:ss");
};

export const parseDate = (date: Date) => {
  return formatToArg(date, "dd/MM/yyyy HH:mm:ss");
};
