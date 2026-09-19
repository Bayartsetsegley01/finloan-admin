import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/cn";
import { formatSignedPercent } from "@/lib/format";

import { SkeletonBar } from "./SkeletonBar";

type Sentiment = "positive" | "negative" | "neutral";

const SENTIMENT_CLASS: Record<Sentiment, string> = {
  positive: "text-success",
  negative: "text-danger",
  neutral: "text-fg-secondary",
};

interface StatCardProps {
  label: string;
  value: string;
  /** Period-over-period change in percent. */
  change?: number;
  /** Whether the change is good news, bad news, or just information. */
  sentiment?: Sentiment;
  comparisonLabel?: string;
}

export function StatCard({ label, value, change, sentiment = "neutral", comparisonLabel }: StatCardProps) {
  const TrendIcon = change !== undefined && change < 0 ? TrendingDown : TrendingUp;

  return (
    <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
      <p className="text-caption text-fg-secondary">{label}</p>
      <p className="mt-2 text-kpi text-fg">{value}</p>
      {change !== undefined && (
        <p className="mt-3 flex flex-wrap items-center gap-x-1.5 text-meta">
          <span className={cn("inline-flex items-center gap-1 font-medium", SENTIMENT_CLASS[sentiment])}>
            <TrendIcon className="size-3.5" aria-hidden />
            {formatSignedPercent(change)}
          </span>
          {comparisonLabel && <span className="text-fg-muted">{comparisonLabel}</span>}
        </p>
      )}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-surface p-6 shadow-card" aria-hidden>
      <SkeletonBar className="w-24" />
      <SkeletonBar className="mt-4 h-7 w-32" />
      <SkeletonBar className="mt-5 h-3 w-28" />
    </div>
  );
}
