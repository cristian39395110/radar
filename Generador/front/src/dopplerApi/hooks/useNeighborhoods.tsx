import { loadNeighborhoods } from "../neighborhoods.api";
import { useQuery } from "react-query";

export const useNeighborhoods = () => {
  const { data: neighborhoods, ...rest } = useQuery(
    "neighborhoods",
    () => loadNeighborhoods(),
    {
      staleTime: 1000 * 60,
    }
  );
  return {
    ...rest,
    neighborhoods,
  };
};
