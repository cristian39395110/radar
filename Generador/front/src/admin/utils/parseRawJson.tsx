import { FunctionalUnit } from "../../dopplerApi/types/FunctionalUnit";
import { RawFunctionalUnit } from "../types/RawFunctionalUnits";

export const parseRawJson = (
  rawFunctionalUnits: RawFunctionalUnit[],
  functionalUnits: FunctionalUnit[] = []
): FunctionalUnit[] => {
  if (rawFunctionalUnits.length === 0)
    return functionalUnits.filter((f) => f.name);
  const [first, ...rest] = rawFunctionalUnits;
  const person = parseRaw(first);
  const index = functionalUnits.findIndex((f) => f.name === person.name);
  if (index === -1) {
    functionalUnits.push({
      name: person.name,
      plates: [person.plate],
      homeowner: person.homeowner,
    });
    return parseRawJson(rest, functionalUnits);
  }
  functionalUnits[index].plates.push(first.patente);
  return parseRawJson(rest, functionalUnits);
};

const parseRaw = (raw: RawFunctionalUnit) => {
  return {
    name: raw.unidadFuncional,
    plate: raw.patente.trim().toUpperCase(),
    homeowner: raw.dueño.trim(),
  };
};
