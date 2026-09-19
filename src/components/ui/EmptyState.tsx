import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="grid size-10 place-items-center rounded-lg border border-border bg-surface-muted text-fg-secondary">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-4 text-body font-semibold text-fg">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-caption text-fg-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
