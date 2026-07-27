"use client";

import { create } from "zustand";

export type Toast = {
  id: string;
  message: string;
  type: "error" | "success";
};

type ToastState = {
  toasts: Toast[];
  add: (message: string, type?: Toast["type"]) => void;
  remove: (id: string) => void;
};

export const useToast = create<ToastState>()((set) => ({
  toasts: [],
  add: (message, type = "error") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
