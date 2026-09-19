import { cn } from "@/lib/cn";

/** Placeholder block for loading states. Purely decorative, hidden from assistive tech. */
export function SkeletonBar({ className }: { className?: string }) {
  return <span aria-hidden className={cn("block h-3.5 animate-pulse rounded bg-border", className)} />;
}
