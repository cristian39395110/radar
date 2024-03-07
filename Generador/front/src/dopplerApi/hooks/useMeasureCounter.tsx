import { useQuery } from "react-query";
import { getCounterByNeighborhood } from "../measures.api";
import { MINUTE_IN_MILLIS } from "../../utils/constanst";

export const useMeasureCounter = (neighborhoodId?: string) => {
  const { data: counter, ...rest } = useQuery(
    [neighborhoodId, "measure", "counter"],
    () => {
      if (!neighborhoodId) return 0;
      return getCounterByNeighborhood(neighborhoodId);
    },
    {
      staleTime: MINUTE_IN_MILLIS,
    }
  );

  return {
    ...rest,
    counter,
  };
};
