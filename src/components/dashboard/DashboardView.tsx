"use client";

import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard, StatCardSkeleton } from "@/components/ui/StatCard";
import { useAsync } from "@/hooks/useAsync";
import { getDashboardSummary } from "@/lib/api/dashboard";
import { formatCompactCurrency, formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { CURRENT_USER } from "@/lib/user";
import type { DashboardSummary } from "@/types/dashboard";

import { LoanOverviewChart, LoanOverviewChartSkeleton } from "./LoanOverviewChart";
import { RecentApplications } from "./RecentApplications";

export type GreetingPeriod = "morning" | "afternoon" | "evening";

function KpiGrid({ summary }: { summary: DashboardSummary }) {
  const { t, lang } = useI18n();
  const comparisonLabel = t("kpi.vsLastMonth");

  return (
    <>
      <StatCard
        label={t("kpi.totalLoans")}
        value={formatCompactCurrency(summary.totalLoanValue.value, lang)}
        change={summary.totalLoanValue.change}
        sentiment="positive"
        comparisonLabel={comparisonLabel}
      />
      <StatCard
        label={t("kpi.activeLoans")}
        value={formatNumber(summary.activeLoans.value)}
        change={summary.activeLoans.change}
        sentiment="positive"
        comparisonLabel={comparisonLabel}
      />
      <StatCard
        label={t("kpi.pendingApplications")}
        value={formatNumber(summary.pendingApplications.value)}
        change={summary.pendingApplications.change}
        comparisonLabel={comparisonLabel}
      />
      <StatCard
        label={t("kpi.overdueLoans")}
        value={formatNumber(summary.overdueLoans.value)}
        change={summary.overdueLoans.change}
        sentiment="negative"
        comparisonLabel={comparisonLabel}
      />
    </>
  );
}

export function DashboardView({ greetingPeriod }: { greetingPeriod: GreetingPeriod }) {
  const { t } = useI18n();
  const { data: summary, error, reload } = useAsync(getDashboardSummary);

  return (
    <>
      <PageHeader
        title={t(`dashboard.greeting.${greetingPeriod}`, { name: CURRENT_USER.name })}
        subtitle={t("dashboard.subtitle")}
      />

      <div className="flex flex-col gap-6">
        {error ? (
          <Card padded={false}>
            <ErrorState onRetry={reload} />
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {summary ? (
                <KpiGrid summary={summary} />
              ) : (
                [0, 1, 2, 3].map((index) => <StatCardSkeleton key={index} />)
              )}
            </div>
            {summary ? <LoanOverviewChart data={summary.overview} /> : <LoanOverviewChartSkeleton />}
          </>
        )}

        <RecentApplications />
      </div>
    </>
  );
}
