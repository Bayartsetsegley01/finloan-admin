"use client";

import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LANGUAGES } from "@/lib/i18n/translations";

/** MN | EN toggle. Plain buttons with aria-pressed — keyboard and screen-reader friendly. */
export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("shell.language")}
      className="inline-flex rounded-md border border-border bg-surface p-0.5"
    >
      {LANGUAGES.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            onClick={() => setLang(code)}
            className={cn(
              "h-7 min-w-10 rounded-sm px-2 text-meta font-semibold tracking-wide uppercase transition-colors",
              active ? "bg-primary-soft text-primary-text" : "text-fg-muted hover:text-fg",
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
