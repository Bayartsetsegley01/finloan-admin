import type { ReactNode } from "react";

interface SettingsFieldProps {
  label: string;
  description?: string;
  /** Associates the label with a control; omit for composite controls. */
  htmlFor?: string;
  children: ReactNode;
}

/** One labelled row inside a settings card: label + help on the left, control on the right. */
export function SettingsField({ label, description, htmlFor, children }: SettingsFieldProps) {
  return (
    <div className="grid gap-3 px-6 py-5 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] sm:gap-8">
      <div>
        <label htmlFor={htmlFor} className="text-body font-medium text-fg">
          {label}
        </label>
        {description && <p className="mt-0.5 text-caption text-fg-muted">{description}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
