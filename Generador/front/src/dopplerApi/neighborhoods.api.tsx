import { dopplerApi } from "./doppler";
import { FunctionalUnit } from "./types/FunctionalUnit";
import { Neighborhood, NewNeighborhood } from "./types/Neighborhoods";

export const loadNeighborhoods = async (includeTokens = false) => {
  const { data } = await dopplerApi.get<Neighborhood[]>("/neighborhoods", {
    params: {
      isActive: true,
      t: includeTokens,
    },
  });
  return data;
};

export const findNeighborhood = async (
  id: string,
  incluedeTokens = false
): Promise<Neighborhood> => {
  const { data } = await dopplerApi.get<Neighborhood>(`/neighborhoods/${id}`, {
    params: {
      t: incluedeTokens,
    },
  });
  return data;
};

export const createOrUpdateNeighborhood = async (
  newNeighborhood: NewNeighborhood
) => {
  const { id, ...rest } = newNeighborhood;
  if (id) {
    const { data } = await dopplerApi.put(`/neighborhoods/${id}`, rest);
    return data;
  }
  const { data } = await dopplerApi.post("/neighborhoods", rest);
  return data;
};

export const sendFunctionalUnits = async (
  id: string,
  functionalUnits: FunctionalUnit[]
) => {
  try {
    const { data } = await dopplerApi.post(`/neighborhoods/${id}/homeowners`, {
      data: functionalUnits,
    });
    return data;
  } catch (err) {
    throw new Error("Server error");
  }
};
