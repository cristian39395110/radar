import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Status = "error" | "idle" | "loading" | "success";

type ModalStore = {
  status: Status;
  timeout: number;
  message: string;
  setStatus(status: Status, message?: string): void;
};

const TIMEOUTS = {
  idle: 0,
  loading: 15000,
  error: 100,
  success: 100,
};

export const useModalStore = create<ModalStore>((set, get) => ({
  status: "idle",
  timeout: 1000,
  message: "",
  setStatus: (status, message) => {
    set({ status, message, timeout: TIMEOUTS[status] });
  },
}));
