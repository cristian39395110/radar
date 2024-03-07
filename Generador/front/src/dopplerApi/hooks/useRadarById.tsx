import { useQuery } from "react-query";
import { findRadar } from "../radars.api";

export const useRadarById = (id?: string) => {
  const { data: radar, ...rest } = useQuery(id || "void", () => {
    if (id) return findRadar(id);
  });

  return { radar, ...rest };
};
