import { z } from "zod";
import { Neighborhood } from "./Neighborhoods";

export type Radar = {
  _id: string;
  model: string;
  radarId: string;
  sensorId: string;
  neighborhood: string | Neighborhood;
  maxSpeed: number;
  isActive: boolean;
  location: string;
};

export type RadarWithApiKey = Radar & {
  apikey: string;
};

export type NewRadar = z.infer<typeof NewRadar>;

export const NewRadar = z.object({
  model: z.string().min(4, "El modelo debe contener al menos 4 caracteres"),
  radarId: z.string(),
  sensorId: z.string(),
  location: z.string(),
  maxSpeed: z.number().positive(),
  neighborhood: z.string(),
  id: z.string().optional(),
});
