import { useEffect, useMemo, useState } from "react";
import { User } from "../../types/User";
import { AdminUser, NewUser } from "../../dopplerApi/types/AdminUser";
import { useMutation } from "react-query";
import { createUser } from "../../dopplerApi/auth.api";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "../../state/modal.store";

const messages = {
  idle: "",
  error: "No se pudo crear el usuario",
  success: "Usuario creado con exito",
  loading: "Creando usuario...",
};

export const useUserForm = (oldUser?: AdminUser) => {
  const [user, setUser] = useState<NewUser>(parseUser(oldUser));
  const setStatus = useModalStore((s) => s.setStatus);

  const { mutate, data, status, ...rest } = useMutation({
    mutationFn: () => {
      return createUser(user);
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    setStatus(status, messages[status]);
    if (status === "success") navigate("/admin/users");
  }, [status]);

  const { isValid, errors } = useMemo(() => {
    const result = NewUser.safeParse(user);
    if (result.success) {
      return {
        isValid: true,
        errors: {},
      };
    }
    const entriesErrors = result.error.errors.map(({ message, path }) => [
      path[0],
      message,
    ]);
    const errors = Object.fromEntries(entriesErrors);
    return { isValid: false, errors };
  }, [user]);

  const update = (name: keyof NewUser, value: string) => {
    setUser({
      ...user,
      [name]: value,
    });
  };

  return {
    user,
    isValid,
    errors,
    createOrUpdate: mutate,
    update,
  };
};

const parseUser = (user?: AdminUser): NewUser => {
  if (!user) {
    return {
      fullName: "",
      username: "",
      roles: ["employer"],
      password: "12345678",
    };
  }
  const { fullName, username, roles, _id } = user;
  return {
    fullName,
    username,
    roles,
    id: _id,
  };
};
