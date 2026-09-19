import type { ReactNode } from "react";

export interface DefinitionItem {
  label: string;
  value: ReactNode;
}

/** Label → value pairs with proper <dl> semantics. */
export function DefinitionList({ items }: { items: DefinitionItem[] }) {
  return (
    <dl className="grid grid-cols-[minmax(0,112px)_minmax(0,1fr)] sm:grid-cols-[minmax(0,148px)_minmax(0,1fr)] items-baseline gap-x-4 gap-y-3">
      {items.map(({ label, value }) => (
        <div key={label} className="contents">
          <dt className="text-caption text-fg-muted">{label}</dt>
          <dd className="text-body text-fg [overflow-wrap:anywhere]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
