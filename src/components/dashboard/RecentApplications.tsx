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

  return (
    <Card title={t("recent.title")} padded={false}>
      {error ? (
        <ErrorState title={t("loans.error.title")} description={t("loans.error.description")} onRetry={reload} />
      ) : (
        <Table<Loan>
          className="fl-table"
          rowKey="id"
          columns={isInitialLoading ? skeletonColumns : columns}
          dataSource={isInitialLoading ? createPlaceholderLoans(RECENT_COUNT) : data?.items}
          pagination={false}
          scroll={{ x: 640 }}
          rowClassName={isInitialLoading ? () => "fl-row-skeleton" : undefined}
          aria-busy={isInitialLoading}
        />
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
