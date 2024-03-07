import { dopplerApi } from "./doppler";
import { Measure, QueryMeasures } from "./types/Measures";

const MEASURES = "/measures";

export const getMeasuresIdsByNeighborhood = async (
  neigborhoodId: string
): Promise<string[]> => {
  try {
    const { data } = await dopplerApi.get<string[]>(
      `${MEASURES}/${neigborhoodId}/ids`
    );
    return data;
  } catch (err) {
    return [];
  }
};

export const getMeasure = async (id: string) => {
  try {
    const { data } = await dopplerApi.get<Measure>(`${MEASURES}/${id}`);
    return data;
  } catch (e) {
    throw new Error("No se encontro la medición");
  }
};

export const getMeasures = async (query?: QueryMeasures) => {
  const filterQuery = Object.fromEntries(
    Object.entries(query || {}).filter(([key, value]) => {
      if (key === "time") {
        return typeof value === "object" && Object.keys(value).length > 0;
      }
      return true;
    })
  );
  const { data } = await dopplerApi.get<Measure[]>(`${MEASURES}`, {
    params: {
      query: JSON.stringify(filterQuery),
    },
  });
  return data;
};

export const getMeasuresByNeighborhood = async (
  neighborhoodId: string
): Promise<Measure[]> => {
  const { data } = await dopplerApi.get<Measure[]>(
    `${MEASURES}/byneighborhood`,
    {
      params: {
        neighborhood: neighborhoodId,
      },
    }
  );
  return data;
};

export const getCounterByNeighborhood = async (neighborhood: string) => {
  const { data } = await dopplerApi.get<number>(
    `${MEASURES}/${neighborhood}/count`
  );
  return data;
};

export const discardMeasure = async (measure: string) => {
  const { data } = await dopplerApi.put(`${MEASURES}/${measure}/discard`);
  return data;
};

export const uploadPic = async (
  pic: File,
  imageType: "plate" | "car",
  videoId: string
) => {
  const formData = new FormData();
  formData.append(imageType, pic);
  const { data } = await dopplerApi.put(`${MEASURES}/csv/${videoId}`, formData);
  return data;
};

export const deleteMeasure = async (id: string) => {
  const { data } = await dopplerApi.delete(`${MEASURES}/${id}`);
  return data;
};
