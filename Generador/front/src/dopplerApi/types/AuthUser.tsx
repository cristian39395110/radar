import { z } from "zod";

export type AuthUser = z.infer<typeof AuthUser>;

export const AuthUser = z.object({
  username: z
    .string()
    .min(4, { message: "Los usuarios tienen al menos 4 caracteres" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});
