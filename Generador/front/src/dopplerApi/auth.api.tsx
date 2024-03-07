import { dopplerApi } from "./doppler";
import { AdminUser, NewUser, Role } from "./types/AdminUser";
import { NewRadar } from "./types/Radars";

export const loadUsers = async () => {
  const { data } = await dopplerApi.get<AdminUser[]>("auth");
  return data;
};

export const createUser = async (user: NewUser) => {
  const { id, ...rest } = user;
  const { data } = await dopplerApi.post("auth/signup", rest);
  return data;
};

export const createOrUpdateRadar = async (radar: NewRadar) => {
  const { id, ...rest } = radar;
  if (id) {
    const { data } = await dopplerApi.put(`radars/${id}`, rest);
    return data;
  }
  const { data } = await dopplerApi.post("auth/radars/new", rest);
  return data;
};

export const updatePassword = async (oldPassword: string, password: string) => {
  try {
    await dopplerApi.put(
      "auth/update-password",
      {
        oldPassword,
        password,
      },
      { timeout: 15000 }
    );
  } catch (e: any) {
    throw new Error(e.response.data.message);
  }
  return "Contraseña actualizada con exito";
};

export const adminUpdateUser = async (
  id: string,
  role?: Role,
  password?: string
): Promise<boolean> => {
  if (!role && !password) return true;
  try {
    await dopplerApi.put(`/auth/admin/${id}`, {
      role,
      password,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
