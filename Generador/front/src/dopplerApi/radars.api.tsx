import { dopplerApi } from "./doppler";
import { Radar, RadarWithApiKey } from "./types/Radars";

export const loadRadars = async () => {
  const { data } = await dopplerApi.get<Radar[]>("/radars");
  return data;
};

export const loadRadarsWithApiKey = async () => {
  const { data } = await dopplerApi.get<RadarWithApiKey[]>("auth/radars");
  return data;
};

export const findRadar = async (id: string) => {
  const { data } = await dopplerApi.get<Radar>(`/radars/${id}`);
  return data;
};
