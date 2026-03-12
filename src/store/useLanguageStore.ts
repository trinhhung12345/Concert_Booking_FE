import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "@/lib/i18n";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: DEFAULT_LANGUAGE,
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => {
        const current = get().language;
        set({ language: current === "vi" ? "en" : "vi" });
      },
    }),
    {
      name: "language-storage",
    }
  )
);
