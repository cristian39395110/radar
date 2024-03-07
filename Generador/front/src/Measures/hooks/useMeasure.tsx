import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  discardMeasure,
  getMeasure,
  getMeasuresIdsByNeighborhood,
} from "../../dopplerApi/measures.api";
import { Measure } from "../../dopplerApi/types/Measures";
import { MINUTE_IN_MILLIS } from "../../utils/constanst";

export const useMeasures = (neighborhoodId?: string) => {
  const [measure, setMeasure] = useState<Measure | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actual, setActual] = useState(0);

  const {
    isLoading: idsIsLoading,
    data: measuresIds,
    refetch,
    error,
  } = useQuery(
    [neighborhoodId || "void", "measures"],
    () => {
      if (!neighborhoodId) return [];
      return getMeasuresIdsByNeighborhood(neighborhoodId);
    },
    {
      staleTime: MINUTE_IN_MILLIS,
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (!measuresIds) return;
    if (actual === measuresIds.length) {
      setMeasure(null);
    }
    setIsLoading(true);
    getMeasure(measuresIds[actual]).then((m) => {
      setMeasure(m);
      setIsLoading(false);
    });
  }, [actual, measuresIds]);

  const next = (discard = false) => {
    discard && measure && discardMeasure(measure?._id);
    setActual(actual + 1);
  };

  return {
    isLoading: isLoading || idsIsLoading,
    measuresIds,
    measure,
    total: measuresIds?.length || 0,
    actual: actual + 1,
    next,
  };
};
