import { z } from "zod";

export type RegisterForm = z.infer<typeof RegisterForm>;

const PLATE_MESSAGE = "La patente tiene 6 o 7 caracteres";
const ACCEPTED_MIME_TYPES = ["image/gif", "image/jpeg", "image/png"];
export const RegisterForm = z.object({
  actNumber: z
    .number()
    .min(0, "Debe ser positivo")
    .int("El número de acta debe ser un entero"),
  date: z.string(),
  plate: z.string().min(6, PLATE_MESSAGE).max(7, PLATE_MESSAGE),
  speed: z.number(),
  location: z.string(),
  neighborhood: z.string(),
  radar: z.string(),
  measure: z.string(),
  homeowner: z.string().optional(),
  functionalUnit: z.string().optional(),
  src: z.object({
    car: z.string(),
    domain: z.string().optional(),
  }),
});

export type RegisterImages = {
  car: string;
  plate: string;
};
