import { create } from "zustand";
import type { Rol, Usuario } from "../api/types";

interface AuthState {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: Usuario, token: string) => void;
  logout: () => void;
  setUser: (user: Usuario) => void;
}

function readStoredUser(): Usuario | null {
  try {
    return JSON.parse(localStorage.getItem("user") || "null") as Usuario | null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => {
  const storedUser = readStoredUser();
  const storedToken = localStorage.getItem("token");
  return {
    user: storedUser,
    token: storedToken,
    isAuthenticated: !!storedUser && !!storedToken,
    login: (user, token) => {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id_usuario);
      localStorage.setItem("token", token);
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      set({ user: null, token: null, isAuthenticated: false });
    },
    setUser: (user) => {
      localStorage.setItem("user", JSON.stringify(user));
      set({ user });
    },
  };
});

/** Decodifica el `exp` del JWT (payload base64) sin librerías. Retorna segundos epoch o null. */
export function getTokenExp(token: string | null): number | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string | null): boolean {
  const exp = getTokenExp(token);
  if (exp === null) return false;
  return Date.now() / 1000 >= exp;
}

export function getCurrentRol(): Rol | null {
  const user = readStoredUser();
  return user?.rol ?? null;
}
