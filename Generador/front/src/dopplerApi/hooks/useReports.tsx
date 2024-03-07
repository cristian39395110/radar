import { useQuery } from "react-query";
import { loadReportsByNeighborhood } from "../reports.api";

export const useReports = (neighborhood: string) => {
  const { data: reports, ...rest } = useQuery([neighborhood, "reports"], () =>
    loadReportsByNeighborhood(neighborhood)
  );
  return {
    ...rest,
    reports,
  };
};
