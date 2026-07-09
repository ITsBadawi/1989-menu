import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// Demo credentials for this offline-first prototype.
const DEMO_USER = "admin";
const DEMO_PASS = "1989admin";

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      login: (username, password) => {
        if (username === DEMO_USER && password === DEMO_PASS) {
          set({ isAuthenticated: true, username });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, username: null }),
    }),
    { name: "1989-auth" }
  )
);
