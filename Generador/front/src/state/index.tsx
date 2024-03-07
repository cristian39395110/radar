import { StateCreator, create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "../types/User";
import { deleteAccessToken } from "../services/localstorage/accessToken";

type Auth = {
  user?: User;
  isLogged: boolean;
  logout: () => void;
  updateUser: (user: User) => void;
  updateAccessToken: (token: string) => void;
};

const auth: StateCreator<Auth, [], []> = (set, get) => ({
  isLogged: false,
  logout: () => {
    set({ user: undefined, isLogged: false });
    deleteAccessToken();
  },
  updateUser: (user) => set({ user, isLogged: true }),
  updateAccessToken: (token) => {
    const auth = get();
    if (!auth.isLogged) return;
    set({
      ...auth,
      user: {
        ...(auth.user as User),
        access_token: token,
      },
    });
  },
});

export const useAuthStore = create(devtools(auth));
