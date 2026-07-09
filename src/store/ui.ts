import { create } from "zustand";
import { persist } from "zustand/middleware";

type Lang = "ar" | "en";

interface UIState {
  lang: Lang;
  toggleLang: () => void;
  setLang: (l: Lang) => void;
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      lang: "ar",
      toggleLang: () => set((s) => ({ lang: s.lang === "ar" ? "en" : "ar" })),
      setLang: (l) => set({ lang: l }),
    }),
    { name: "1989-ui" }
  )
);
