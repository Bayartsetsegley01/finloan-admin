import type { Language } from "@/lib/i18n/translations";

/*
 * Formatting helpers. Dates are handled as plain ISO strings (no Date objects),
 * so output is identical on server and client regardless of time zone.
 */

const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const numberFormat = new Intl.NumberFormat("en-US");

export const formatNumber = (value: number): string => numberFormat.format(value);

/** ₮8,500,000 */
export const formatCurrency = (amount: number): string => `₮${formatNumber(amount)}`;

const trimDecimal = (value: number) => value.toFixed(1).replace(/\.0$/, "");

/** ₮12.4B (en) · ₮12.4 тэрбум (mn) */
export function formatCompactCurrency(amount: number, lang: Language): string {
  const units: [size: number, suffix: string][] =
    lang === "mn"
      ? [
          [1e9, " тэрбум"],
          [1e6, " сая"],
        ]
      : [
          [1e9, "B"],
          [1e6, "M"],
        ];

  for (const [size, suffix] of units) {
    if (amount >= size) return `₮${trimDecimal(amount / size)}${suffix}`;
  }
  return formatCurrency(amount);
}

/** Sep 18, 2026 (en) · 2026.09.18 (mn) */
export function formatDate(iso: string, lang: Language): string {
  const [year = "", month = "", day = ""] = iso.slice(0, 10).split("-");
  if (lang === "mn") return `${year}.${month}.${day}`;
  return `${EN_MONTHS[Number(month) - 1] ?? ""} ${Number(day)}, ${year}`;
}

/** Sep 18, 2026, 09:14 */
export function formatDateTime(iso: string, lang: Language): string {
  return `${formatDate(iso, lang)}, ${iso.slice(11, 16)}`;
}

/** "2026-09" → "Sep" (en) · "9-р сар" (mn) */
export function formatMonth(isoMonth: string, lang: Language): string {
  const month = Number(isoMonth.slice(5, 7));
  return lang === "mn" ? `${month}-р сар` : (EN_MONTHS[month - 1] ?? "");
}

/** Signed percent, e.g. +8.2% */
export function formatSignedPercent(value: number): string {
  return `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(1)}%`;
}
