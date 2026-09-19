import { DEFAULT_LANGUAGE, LANGUAGES, type Language } from "@/lib/i18n/translations";

/**
 * User preferences (language, tenant branding) are stored in cookies rather than localStorage
 * so the server can render the correct brand colors and language on the very first paint —
 * no flash of the wrong theme.
 */

export const LANGUAGE_COOKIE = "finloan_lang";
export const TENANT_COOKIE = "finloan_tenant";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Browser only. */
export function writeCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}

export function parseLanguage(value: string | undefined): Language {
  return LANGUAGES.find((lang) => lang === value) ?? DEFAULT_LANGUAGE;
}
