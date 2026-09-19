import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface CardProps {
  title?: ReactNode;
  description?: ReactNode;
  /** Right-aligned header content (buttons, legends …). */
  actions?: ReactNode;
  /** Set to false when the body is edge-to-edge (tables). */
  padded?: boolean;
  className?: string;
  children?: ReactNode;
}

/** The one surface used everywhere: white, hairline border, 12px radius, no heavy shadow. */
export function Card({ title, description, actions, padded = true, className, children }: CardProps) {
  const hasHeader = Boolean(title || actions);

  return (
    <section className={cn("overflow-hidden rounded-lg border border-border bg-surface shadow-card", className)}>
      {hasHeader && (
        <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 px-6 pt-5 pb-4">
          <div className="min-w-0">
            {title && <h2 className="text-section text-fg">{title}</h2>}
            {description && <p className="mt-0.5 text-caption text-fg-muted">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={cn(padded && (hasHeader ? "px-6 pb-6" : "p-6"))}>{children}</div>
    </section>
  );
}
