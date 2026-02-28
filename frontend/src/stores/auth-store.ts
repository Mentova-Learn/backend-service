import { create } from "zustand";
import { api, ApiError } from "@/lib/api";
import type { User, LoginResponse, RegisterRequest } from "@/lib/types";

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  hydrated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  loading: false,
  hydrated: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const data = await api<LoginResponse>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.access_token);
      set({ token: data.access_token });
      await get().fetchMe();
    } finally {
      set({ loading: false });
    }
  },

  register: async (data) => {
    set({ loading: true });
    try {
      await api("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      // Auto-login after registration
      await get().login(data.email, data.password);
    } finally {
      set({ loading: false });
    }
  },

  fetchMe: async () => {
    try {
      const user = await api<User>("/api/v1/auth/@me");
      set({ user });
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        get().logout();
      }
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },

  hydrate: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ token });
      await get().fetchMe();
    }
    set({ hydrated: true });
  },
}));
