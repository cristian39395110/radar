import { useEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { z } from "zod";
import { updatePassword } from "../../dopplerApi/auth.api";
import { useModalStore } from "../../state/modal.store";
import { useNavigate } from "react-router-dom";

type UpdatePassword = z.infer<typeof UpdatePassword>;

const UpdatePassword = z
  .object({
    old: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    password: z
      .string()
      .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    repeatPassword: z.string(),
  })
  .refine(
    (schema) => schema.password === schema.repeatPassword,
    "Las contraseñas nuevas deben coincidir"
  );

const messages = {
  idle: "",
  error: "No se pudo crear el usuario",
  success: "Usuario creado con exito",
  loading: "Creando usuario...",
};

export const useUpdatePassword = () => {
  const [form, setForm] = useState<UpdatePassword>({
    old: "",
    password: "",
    repeatPassword: "",
  });

  const setStatus = useModalStore((s) => s.setStatus);
  const navigate = useNavigate();

  const { status, mutate, error } = useMutation({
    mutationFn: () => updatePassword(form.old, form.password),
  });

  useEffect(() => {
    if (status === "error") {
      const e = error as any;
      setStatus(status, e?.message || messages[status]);
    } else {
      setStatus(status, messages[status]);
    }

    if (status === "success") navigate("/");
  }, [status]);

  const { isValid, errors } = useMemo(() => {
    const result = UpdatePassword.safeParse(form);
    if (result.success) {
      return { isValid: true, errors: {} };
    }
    const errors = Object.fromEntries(
      result.error.errors.map(({ path, message }) => [
        path[0] || "password",
        message,
      ])
    );
    return { isValid: false, errors };
  }, [form]);

  const update = (name: keyof UpdatePassword, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  return {
    form,
    isValid,
    errors,
    updateForm: update,
    updatePassword: mutate,
  };
};
