export type Language = "vi" | "en";

export const DEFAULT_LANGUAGE: Language = "vi";

export const LANGUAGE_LABELS: Record<Language, string> = {
  vi: "VI",
  en: "EN",
};

export const LANGUAGE_LOCALES: Record<Language, string> = {
  vi: "vi-VN",
  en: "en-US",
};

export function getLocale(language: Language | null | undefined): string {
  if (!language) return LANGUAGE_LOCALES[DEFAULT_LANGUAGE];
  return LANGUAGE_LOCALES[language] ?? LANGUAGE_LOCALES[DEFAULT_LANGUAGE];
}
