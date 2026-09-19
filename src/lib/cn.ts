/** Joins truthy class names. Tiny stand-in for clsx — we only need conditional joining. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
