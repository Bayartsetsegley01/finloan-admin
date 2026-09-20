"use client";

import { Table, type TableColumnsType } from "antd";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo } from "react";

import { LoanStatusBadge } from "@/components/loans/LoanStatusBadge";
import { createPlaceholderLoans } from "@/components/loans/placeholderLoans";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import { useAsync } from "@/hooks/useAsync";
import { getLoans } from "@/lib/api/loans";
import { formatCurrency, formatDate } from "@/lib/format";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { Loan } from "@/types/loan";

const RECENT_COUNT = 5;

export function RecentApplications() {
  const { t, lang } = useI18n();
  const fetchRecent = useCallback(() => getLoans({ search: "", page: 1, pageSize: RECENT_COUNT }), []);
  const { data, error, isInitialLoading, reload } = useAsync(fetchRecent);

  const columns = useMemo<TableColumnsType<Loan>>(
    () => [
      {
        key: "applicant",
        title: t("col.applicant"),
        render: (_, loan) => <span className="font-medium text-fg">{loan.customerName}</span>,
      },
      {
        key: "id",
        title: t("col.loanId"),
        dataIndex: "id",
        render: (id: string) => <span className="text-fg-secondary tabular-nums">{id}</span>,
      },
      {
        key: "amount",
        title: t("col.amount"),
        dataIndex: "amount",
        align: "right",
        render: (amount: number) => <span className="font-medium text-fg tabular-nums">{formatCurrency(amount)}</span>,
      },
      {
        key: "status",
        title: t("col.status"),
        dataIndex: "status",
        render: (status: Loan["status"]) => <LoanStatusBadge status={status} />,
      },
      {
        key: "date",
        title: t("col.date"),
        dataIndex: "appliedAt",
        render: (date: string) => <span className="text-fg-secondary tabular-nums">{formatDate(date, lang)}</span>,
      },
    ],
    [t, lang],
  );

  const skeletonColumns = useMemo<TableColumnsType<Loan>>(
    () =>
      columns.map((column) => ({
        ...column,
        render: () => <SkeletonBar className={column.key === "amount" ? "ml-auto w-20" : "w-24"} />,
      })),
    [columns],
  );

  const rows = isInitialLoading ? createPlaceholderLoans(RECENT_COUNT) : (data?.items ?? []);

  return (
    <Card title={t("recent.title")} padded={false}>
      {error ? (
        <ErrorState title={t("loans.error.title")} description={t("loans.error.description")} onRetry={reload} />
      ) : (
        <>
          {/* sm+: table. Below sm the row columns can't fit 390px without truncating
              every field, so a stacked card list takes over — swapped in by CSS
              (hidden/sm:hidden), never a JS width check, so SSR output matches the client. */}
          <div className="hidden sm:block">
            <Table<Loan>
              className="fl-table"
              rowKey="id"
              columns={isInitialLoading ? skeletonColumns : columns}
              dataSource={rows}
              pagination={false}
              scroll={{ x: 640 }}
              rowClassName={isInitialLoading ? () => "fl-row-skeleton" : undefined}
              aria-busy={isInitialLoading}
            />
          </div>

          <ul className="sm:hidden" aria-busy={isInitialLoading}>
            {rows.map((loan, index) =>
              isInitialLoading ? (
                <li key={index} aria-hidden className="flex flex-col gap-2 border-b border-border px-6 py-4 last:border-b-0">
                  <div className="flex items-center justify-between gap-3">
                    <SkeletonBar className="w-28" />
                    <SkeletonBar className="w-16" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <SkeletonBar className="w-20" />
                    <SkeletonBar className="w-16" />
                  </div>
                  <SkeletonBar className="w-24" />
                </li>
              ) : (
                <li key={loan.id} className="flex flex-col gap-1 border-b border-border px-6 py-4 last:border-b-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate font-medium text-fg">{loan.customerName}</span>
                    <LoanStatusBadge status={loan.status} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-fg-muted tabular-nums">{loan.id}</span>
                    <span className="font-medium text-fg tabular-nums">{formatCurrency(loan.amount)}</span>
                  </div>
                  <span className="text-meta text-fg-muted tabular-nums">{formatDate(loan.appliedAt, lang)}</span>
                </li>
              ),
            )}
          </ul>
        </>
      )}

      <div className="border-t border-border px-6 py-4">
        <Link
          href="/loans"
          className="inline-flex items-center gap-1.5 rounded-sm text-body font-medium text-primary-text transition-colors hover:text-primary-hover"
        >
          {t("recent.viewAll")}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </Card>
  );
}
