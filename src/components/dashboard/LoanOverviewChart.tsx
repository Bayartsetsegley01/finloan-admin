"use client";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatMonth } from "@/lib/format";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import type { MonthlyLoanOverview } from "@/types/dashboard";

/**
 * Stacked column chart, drawn with plain HTML/CSS so it stays crisp, themeable and dependency-free.
 * Restrained on purpose: the brand color carries "healthy" volume (solid = approved, lighter = pending),
 * and red is reserved for the one series that needs attention. Legend, tooltip and a hidden table carry the rest.
 */
const SERIES = [
  { key: "approved", label: "status.approved", swatch: "bg-primary" },
  { key: "pending", label: "status.pending", swatch: "bg-primary-muted" },
  { key: "overdue", label: "status.overdue", swatch: "bg-mark-danger" },
] as const satisfies ReadonlyArray<{ key: keyof MonthlyLoanOverview; label: TranslationKey; swatch: string }>;

const CHART_HEIGHT = "h-60"; // 240px
const AXIS_STEPS = [10, 20, 50, 100, 200, 500, 1000];

/** Picks a "nice" step so the axis has at most ~5 gridlines. */
function buildAxis(maxValue: number): { top: number; ticks: number[] } {
  const step = AXIS_STEPS.find((candidate) => maxValue / candidate <= 5) ?? 1000;
  const top = Math.ceil(maxValue / step) * step;
  return { top, ticks: Array.from({ length: top / step + 1 }, (_, i) => i * step) };
}

const total = (row: MonthlyLoanOverview) => row.approved + row.pending + row.overdue;

function Legend() {
  const { t } = useI18n();
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label={t("overview.legend")}>
      {SERIES.map(({ key, label, swatch }) => (
        <li key={key} className="flex items-center gap-2 text-caption text-fg-secondary">
          <span aria-hidden className={cn("size-2.5 rounded-sm", swatch)} />
          {t(label)}
        </li>
      ))}
    </ul>
  );
}

/** Appears beside the hovered column (right for the first half of the chart, left for the second) so it never clips. */
function Tooltip({ row, side }: { row: MonthlyLoanOverview; side: "left" | "right" }) {
  const { t, lang } = useI18n();

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-3 z-10 w-44 rounded-lg border border-border bg-surface p-3 text-left opacity-0 shadow-popover transition-opacity group-focus-visible:opacity-100 group-hover:opacity-100",
        side === "right" ? "left-full ml-1" : "right-full mr-1",
      )}
    >
      <p className="mb-2 text-meta font-medium text-fg">{formatMonth(row.month, lang)}</p>
      <ul className="flex flex-col gap-1.5">
        {SERIES.map(({ key, label, swatch }) => (
          <li key={key} className="flex items-center justify-between gap-3 text-meta">
            <span className="flex items-center gap-2 text-fg-secondary">
              <span className={cn("size-2 rounded-sm", swatch)} />
              {t(label)}
            </span>
            <span className="font-medium text-fg tabular-nums">{row[key]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LoanOverviewChart({ data }: { data: MonthlyLoanOverview[] }) {
  const { t, lang } = useI18n();
  const { top, ticks } = buildAxis(Math.max(...data.map(total)));
  const columns = { gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` };

  return (
    <Card title={t("overview.title")} description={t("overview.subtitle")} actions={<Legend />}>
      <div className="overflow-x-auto pt-3 pb-1">
        <div className="min-w-[620px]">
          <div className="flex">
            {/* Y axis */}
            <div aria-hidden className={cn("relative w-10 shrink-0", CHART_HEIGHT)}>
              {ticks.map((tick) => (
                <span
                  key={tick}
                  className="absolute right-3 translate-y-1/2 text-meta text-fg-muted tabular-nums"
                  style={{ bottom: `${(tick / top) * 100}%` }}
                >
                  {tick}
                </span>
              ))}
            </div>

            {/* Plot */}
            <div className={cn("relative flex-1", CHART_HEIGHT)}>
              {ticks.map((tick) => (
                <div
                  key={tick}
                  aria-hidden
                  className="absolute inset-x-0 border-t border-border"
                  style={{ bottom: `${(tick / top) * 100}%` }}
                />
              ))}

              <div className="relative grid h-full" style={columns} role="group" aria-label={t("overview.chartLabel")}>
                {data.map((row, index) => {
                  const side = index < data.length / 2 ? "right" : "left";
                  const label = formatMonth(row.month, lang);
                  const summary = SERIES.map(({ key, label: seriesLabel }) => `${t(seriesLabel)} ${row[key]}`).join(", ");

                  return (
                    <div
                      key={row.month}
                      tabIndex={0}
                      role="img"
                      aria-label={`${label}: ${summary}`}
                      className="group relative flex h-full items-end justify-center rounded-md transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover"
                    >
                      <div
                        className="flex w-6 flex-col-reverse gap-0.5"
                        style={{ height: `${(total(row) / top) * 100}%` }}
                      >
                        {SERIES.map(({ key, swatch }, seriesIndex) => (
                          <div
                            key={key}
                            className={cn(swatch, seriesIndex === SERIES.length - 1 && "rounded-t-sm")}
                            style={{ flex: `${row[key]} 1 0%` }}
                          />
                        ))}
                      </div>
                      <Tooltip row={row} side={side} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X axis */}
          <div className="mt-3 flex" aria-hidden>
            <div className="w-10 shrink-0" />
            <div className="grid flex-1" style={columns}>
              {data.map((row) => (
                <span key={row.month} className="text-center text-meta whitespace-nowrap text-fg-muted">
                  {formatMonth(row.month, lang)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table view of the same data for assistive tech */}
      <table className="sr-only">
        <caption>{t("overview.chartLabel")}</caption>
        <thead>
          <tr>
            <th scope="col">{t("col.date")}</th>
            {SERIES.map(({ key, label }) => (
              <th key={key} scope="col">
                {t(label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}>
              <th scope="row">{formatMonth(row.month, lang)}</th>
              {SERIES.map(({ key }) => (
                <td key={key}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function LoanOverviewChartSkeleton() {
  const { t } = useI18n();
  const heights = [42, 46, 44, 48, 52, 56, 60, 62, 68, 74, 80, 88];

  return (
    <Card title={t("overview.title")} description={t("overview.subtitle")} actions={<Legend />}>
      <div aria-hidden className="pt-3 pb-1">
        <div className={cn("ml-10 flex items-end justify-around border-b border-border", CHART_HEIGHT)}>
          {heights.map((height, index) => (
            <span key={index} className="w-6 animate-pulse rounded-t-sm bg-border" style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="mt-3 h-4" />
      </div>
    </Card>
  );
}
