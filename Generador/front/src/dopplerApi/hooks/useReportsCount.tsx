import { useQuery } from "react-query";
import { useNeighborhoods } from "./useNeighborhoods";
import { countReportsByNeighborhood } from "../reports.api";

export const useReportsCount = (neighborhood: string) => {
  const { data: reports, ...rest } = useQuery(
    [neighborhood, "reports", "counter"],
    () => countReportsByNeighborhood(neighborhood)
  );

  return {
    ...rest,
    reports,
  };
};
