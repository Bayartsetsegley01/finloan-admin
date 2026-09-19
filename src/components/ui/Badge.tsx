import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "brand";

const TONES: Record<BadgeTone, { badge: string; dot: string }> = {
  neutral: { badge: "bg-neutral-soft text-fg-secondary", dot: "bg-mark-neutral" },
  success: { badge: "bg-success-soft text-success", dot: "bg-mark-success" },
  warning: { badge: "bg-warning-soft text-warning", dot: "bg-mark-warning" },
  danger: { badge: "bg-danger-soft text-danger", dot: "bg-mark-danger" },
  brand: { badge: "bg-primary-soft text-primary-text", dot: "bg-primary" },
};

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
}

/** Small, quiet status label: tinted background + a 6px dot. Never a saturated pill. */
export function Badge({ tone = "neutral", children }: BadgeProps) {
  const styles = TONES[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-meta font-medium whitespace-nowrap",
        styles.badge,
      )}
    >
      <span className={cn("size-1.5 rounded-full", styles.dot)} aria-hidden />
      {children}
    </span>
  );
}
