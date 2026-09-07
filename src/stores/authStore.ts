import { create } from "zustand";
import type { Rol, Usuario } from "../api/types";

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (user: Usuario) => void;
  logout: () => void;
  setUser: (user: Usuario) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null") as Usuario | null,
  isAuthenticated: !!localStorage.getItem("user"),
  login: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userId", user.id_usuario);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
}));

export function getCurrentRol(): Rol | null {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return (JSON.parse(raw) as Usuario).rol;
  } catch {
    return null;
  }
}
