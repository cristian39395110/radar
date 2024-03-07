import { dopplerApi } from "../doppler";

export const loadCarImagesUrls = async (video?: string) => {
  if (!video) return [];
  const { data } = await dopplerApi.get<string[]>(`/records/${video}/images`);
  return data;
};

export const loadPlateImagesUrls = async (video?: string) => {
  if (!video) return [];
  const { data } = await dopplerApi.get<string[]>(`/records/${video}/plates`);
  return data;
};

export const findRecordImages = async (video: string) => {
  const { data } = await dopplerApi.get(`/records/${video}/images/zip`, {
    timeout: 5 * 60 * 1000,
    responseType: "arraybuffer",
  });
  return data;
};
