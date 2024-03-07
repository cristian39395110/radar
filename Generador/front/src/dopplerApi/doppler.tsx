import axios from "axios";
import { getAccessToken } from "../services/localstorage/accessToken";

export const DOPPLER_URL =
  import.meta.env.REACT_APP_DOPPLER_URL || "http://localhost:8000";

const apikey = import.meta.env.REACT_APP_API_KEY || "doppler-solutions-test";

export const dopplerApi = axios.create({
  baseURL: DOPPLER_URL,
  timeout: 10000,
  headers: {
    "x-api-key": `app${apikey}`,
  },
});

dopplerApi.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
