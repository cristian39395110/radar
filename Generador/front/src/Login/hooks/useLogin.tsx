import { useEffect, useMemo, useState } from "react";
import useAuth from "../../dopplerApi/hooks/useAuth";
import { AuthUser } from "../../dopplerApi/types/AuthUser";
import { useModalStore } from "../../state/modal.store";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [form, setForm] = useState<AuthUser>({
    username: "",
    password: "",
  });

  const { mutate, status } = useAuth();

  const setStatus = useModalStore((s) => s.setStatus);

  const navigate = useNavigate();

  useEffect(() => {
    let message: string | undefined;
    if (status === "error") {
      message = "El usuario o la contraseña no coinciden";
    }
    setStatus(status, message);
    if (status === "success") {
      navigate("/neighborhoods");
    }
  }, [status]);

  const { errors, isValid } = useMemo(() => {
    const result = AuthUser.safeParse(form);
    if (result.success) {
      return { isValid: true };
    }

    const errors = Object.fromEntries(
      result.error.errors.map((x) => [x.path[0], x.message])
    );

    return { errors, isValid: false };
  }, [form]);

  const login = async () => {
    await mutate(form);
  };

  const update = (name: keyof AuthUser, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  return {
    form,
    errors,
    isValid,
    login,
    update,
  };
};
