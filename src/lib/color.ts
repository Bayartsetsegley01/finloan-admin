const HEX_PATTERN = /^#?([0-9a-f]{6})$/i;

export function isValidHex(value: string): boolean {
  return HEX_PATTERN.test(value.trim());
}

/** Normalises "2455e0" / "#2455E0" to "#2455E0". */
export function normalizeHex(value: string): string {
  const match = HEX_PATTERN.exec(value.trim());
  return match?.[1] ? `#${match[1].toUpperCase()}` : value;
}

function toRgb(hex: string): [number, number, number] {
  const match = HEX_PATTERN.exec(hex.trim());
  const value = match?.[1] ?? "000000";
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colors (1–21). */
export function getContrastRatio(a: string, b: string): number {
  const [light, dark] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (light + 0.05) / (dark + 0.05);
}

/** Picks white or near-black text — whichever is more readable on `background`. */
export function getReadableTextColor(background: string): string {
  const onLight = getContrastRatio(background, "#111827");
  const onWhite = getContrastRatio(background, "#FFFFFF");
  return onWhite >= onLight ? "#FFFFFF" : "#111827";
}
