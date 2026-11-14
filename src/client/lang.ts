import type { Lang } from "./i18n.ts";

const KEY = "hb.lang";

export function resolveLang(): Lang {
  const url = new URLSearchParams(location.search).get("lang");
  if (url === "en" || url === "fr") return url;
  const stored = localStorage.getItem(KEY);
  if (stored === "en" || stored === "fr") return stored;
  return navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export function persistLang(lang: Lang): void {
  localStorage.setItem(KEY, lang);
}

export function htmlLang(lang: Lang): void {
  document.documentElement.lang = lang;
}
