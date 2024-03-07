import { Report } from "../../dopplerApi/types/Report";
import { formatToArg } from "../../utils/formatToArg";

const keyToNames: any = {
  date: "fecha",
  time: "hora",
  actNumber: "número de acta",
  location: "ubicación",
  plate: "patente",
  maxSpeed: "velocidad máx permitida",
  speed: "velocidad máx registrada",
  homeowner: "Propietario",
  funcionalUnit: "Unidad funcional",
};

export const parseReport = (report: Report) => {
  const object = {
    ...report.neighborhood,
    ...report.radar,
    ...report,
    time: report.date,
  };

  const showFields = report.neighborhood.reportFields as any;
  if (showFields.date) {
    showFields.date = true;
    showFields.time = true;
  }
  showFields.plate = report.plate !== "XXXXXXX";
  showFields.maxSpeed = true;

  const entries = Object.entries(object)
    .filter(([key, value]) => showFields[key] && typeof value !== "object")
    .map(([key, value]) => [keyToNames[key], parseValue(key, value as any)])
    .filter(([key]) => Boolean(key));

  return entries;
};

const parseValue = (key: string, value: number | string) => {
  if (key === "date") return formatToArg(new Date(value), "dd/MM/yy");
  if (key === "time") return formatToArg(new Date(value), "HH:mm:ss");
  if (key.toLowerCase().includes("speed")) {
    const speed = Math.abs(value as number);
    return `${speed} Km/h`;
  }
  return value;
};
