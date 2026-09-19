import { getReadableTextColor } from "@/lib/color";
import type { TenantConfig, ThemeMode } from "@/types/tenant";

/**
 * Design tokens — the single source of truth for the visual language.
 *
 * - Neutral + status colors are fixed per theme mode.
 * - Brand colors (primary / secondary) come from the active TenantConfig.
 * - The same values feed both Tailwind (via CSS variables) and Ant Design (via ConfigProvider).
 */

export const FONT_STACK = `"Inter Variable", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`;

export const RADIUS = { sm: 6, md: 8, lg: 12 } as const;

export const CONTROL_HEIGHT = 36;

export interface Palette {
  /** App background. */
  canvas: string;
  /** Cards, table, drawer. */
  surface: string;
  /** Table header, filter bar, quiet fills. */
  surfaceMuted: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  fg: string;
  fgSecondary: string;
  fgMuted: string;
  /** Status text colors (AA on their soft background). */
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  neutralSoft: string;
  /** Status marks (dots, chart fills). Fixed across themes. */
  markSuccess: string;
  markWarning: string;
  markDanger: string;
  markNeutral: string;
}

export const palettes: Record<ThemeMode, Palette> = {
  light: {
    canvas: "#F6F7F9",
    surface: "#FFFFFF",
    surfaceMuted: "#F9FAFB",
    surfaceHover: "#F4F5F7",
    border: "#E7E9ED",
    borderStrong: "#D5D9E0",
    fg: "#101828",
    fgSecondary: "#475467",
    fgMuted: "#667085",
    success: "#067647",
    successSoft: "#ECFDF3",
    warning: "#B54708",
    warningSoft: "#FFF6E5",
    danger: "#B42318",
    dangerSoft: "#FEF3F2",
    neutralSoft: "#F2F4F7",
    markSuccess: "#0CA30C",
    markWarning: "#FAB219",
    markDanger: "#D03B3B",
    markNeutral: "#98A2B3",
  },
  dark: {
    canvas: "#0B1018",
    surface: "#121926",
    surfaceMuted: "#161E2D",
    surfaceHover: "#1A2334",
    border: "#243044",
    borderStrong: "#34425B",
    fg: "#F2F4F7",
    fgSecondary: "#B4BCC9",
    fgMuted: "#8B95A7",
    success: "#4BD08C",
    successSoft: "rgba(75, 208, 140, 0.12)",
    warning: "#FDB022",
    warningSoft: "rgba(253, 176, 34, 0.12)",
    danger: "#F97066",
    dangerSoft: "rgba(249, 112, 102, 0.12)",
    neutralSoft: "rgba(180, 188, 201, 0.10)",
    markSuccess: "#0CA30C",
    markWarning: "#FAB219",
    markDanger: "#D03B3B",
    markNeutral: "#6B7689",
  },
};

const toKebab = (key: string) => key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

/**
 * CSS custom properties applied on <html>. Tailwind utilities (`bg-surface`, `text-fg-muted`,
 * `bg-primary` …) resolve to these, so switching tenant or theme never touches component code.
 * Derived shades (hover / soft / border) are computed in globals.css with color-mix().
 */
export function buildCssVariables(config: TenantConfig): Record<string, string> {
  const vars: Record<string, string> = {
    "--primary": config.primaryColor,
    "--on-primary": getReadableTextColor(config.primaryColor),
    "--secondary": config.secondaryColor ?? config.primaryColor,
  };

  for (const [key, value] of Object.entries(palettes[config.theme])) {
    vars[`--${toKebab(key)}`] = value;
  }

  return vars;
}
