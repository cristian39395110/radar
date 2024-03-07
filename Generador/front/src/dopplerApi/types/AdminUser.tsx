import { z } from "zod";

export interface AdminUser {
  _id: string;
  username: string;
  fullName: string;
  roles: Role[];
  password: string;
  __v: number;
}

export type Role = "admin" | "developer" | "employer";

export type NewUser = z.infer<typeof NewUser>;

export const NewUser = z
  .object({
    username: z
      .string()
      .min(4, "El nombre de usuario debe tener al menos 4 caracteres"),
    fullName: z.string().min(5, "El nombre del usuario debe estar completo"),
    roles: z.array(z.enum(["admin", "developer", "employer"])),
    password: z.optional(
      z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
    ),
    id: z.optional(z.string()),
  })
  .refine((schema) => schema.id ?? !!schema.password, {
    message: "La contraseña es requirida",
  });
