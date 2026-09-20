"use client";

import { App, Button, Dropdown, Pagination, Table, type TableColumnsType } from "antd";
import { Copy, Ellipsis, Eye, SearchX } from "lucide-react";
import { useCallback, useMemo, type ReactNode } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import { cn } from "@/lib/cn";
import { formatCurrency, formatDate } from "@/lib/format";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { Loan } from "@/types/loan";

import { LoanStatusBadge } from "./LoanStatusBadge";
import { createPlaceholderLoans } from "./placeholderLoans";

interface LoanTableProps {
  loans: Loan[] | undefined;
  total: number;
  page: number;
  pageSize: number;
  /** Nothing to show yet → render skeleton rows. */
  isInitialLoading: boolean;
  /** Refetching with existing rows → dim them and show a spinner. */
  isRefreshing: boolean;
  onPageChange: (page: number) => void;
  onSelect: (loanId: string) => void;
  /** Rendered inside the empty state, e.g. a "Clear filters" button. */
  emptyAction?: ReactNode;
}

/** Skeleton bar widths per column, so loading rows resemble real ones. */
const SKELETON_WIDTH: Record<string, string> = {
  id: "w-16",
  customer: "w-28",
  type: "w-24",
  amount: "ml-auto w-20",
  term: "w-14",
  status: "w-20",
  appliedAt: "w-20",
  actions: "ml-auto w-14",
};

export function LoanTable({
  loans,
  total,
  page,
  pageSize,
  isInitialLoading,
  isRefreshing,
  onPageChange,
  onSelect,
  emptyAction,
}: LoanTableProps) {
  const { t, lang } = useI18n();
  const { message } = App.useApp();

  const copyId = useCallback(
    async (id: string) => {
      await navigator.clipboard.writeText(id);
      message.success(t("common.copied"));
    },
    [message, t],
  );

  const columns = useMemo<TableColumnsType<Loan>>(
    () => [
      {
        key: "id",
        title: t("col.loanId"),
        dataIndex: "id",
        width: 160,
        render: (id: string) => (
          <button
            type="button"
            onClick={() => onSelect(id)}
            className="rounded-sm text-left font-medium whitespace-nowrap text-fg tabular-nums underline-offset-4 transition-colors hover:text-primary-text hover:underline"
          >
            {id}
          </button>
        ),
      },
      {
        key: "customer",
        title: t("col.customer"),
        render: (_, loan) => (
          <div className="min-w-0">
            <div className="truncate font-medium text-fg">{loan.customerName}</div>
            <div className="text-meta text-fg-muted">{loan.customerId}</div>
          </div>
        ),
      },
      {
        key: "type",
        title: t("col.type"),
        dataIndex: "type",
        render: (type: Loan["type"]) => <span className="text-fg-secondary">{t(`loanType.${type}`)}</span>,
      },
      {
        key: "amount",
        title: t("col.amount"),
        dataIndex: "amount",
        align: "right",
        render: (amount: number) => <span className="font-medium text-fg tabular-nums">{formatCurrency(amount)}</span>,
      },
      {
        key: "term",
        title: t("col.term"),
        dataIndex: "term",
        render: (term: number) => (
          <span className="text-fg-secondary tabular-nums">{t("unit.months", { count: term })}</span>
        ),
      },
      {
        key: "status",
        title: t("col.status"),
        dataIndex: "status",
        render: (status: Loan["status"]) => <LoanStatusBadge status={status} />,
      },
      {
        key: "appliedAt",
        title: t("col.appliedDate"),
        dataIndex: "appliedAt",
        render: (date: string) => <span className="text-fg-secondary tabular-nums">{formatDate(date, lang)}</span>,
      },
      {
        key: "actions",
        title: <span className="sr-only">{t("col.actions")}</span>,
        align: "right",
        width: 104,
        render: (_, loan) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              type="text"
              icon={<Eye className="size-4" aria-hidden />}
              aria-label={`${t("common.viewDetails")}: ${loan.id}`}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(loan.id);
              }}
            />
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              menu={{
                items: [
                  { key: "view", label: t("common.viewDetails"), icon: <Eye className="size-4" aria-hidden /> },
                  { key: "copy", label: t("common.copyId"), icon: <Copy className="size-4" aria-hidden /> },
                ],
                onClick: ({ key, domEvent }) => {
                  domEvent.stopPropagation();
                  if (key === "view") onSelect(loan.id);
                  if (key === "copy") void copyId(loan.id);
                },
              }}
            >
              <Button
                type="text"
                icon={<Ellipsis className="size-4" aria-hidden />}
                aria-label={`${t("common.moreActions")}: ${loan.id}`}
                onClick={(event) => event.stopPropagation()}
              />
            </Dropdown>
          </div>
        ),
      },
    ],
    [t, lang, onSelect, copyId],
  );

  const skeletonColumns = useMemo<TableColumnsType<Loan>>(
    () =>
      columns.map((column) => ({
        ...column,
        render: () => <SkeletonBar className={SKELETON_WIDTH[String(column.key)]} />,
      })),
    [columns],
  );

  const placeholderRows = useMemo(() => createPlaceholderLoans(pageSize), [pageSize]);
  const rows = isInitialLoading ? placeholderRows : (loans ?? []);
  const isEmpty = !isInitialLoading && rows.length === 0;

  const emptyState = (
    <EmptyState
      icon={SearchX}
      title={t("loans.empty.title")}
      description={t("loans.empty.description")}
      action={emptyAction}
    />
  );

  // Shared with the mobile Pagination below: the desktop Table renders its own copy
  // internally, the card list needs a standalone one, but both drive off the same state.
  const paginationConfig = {
    current: page,
    pageSize,
    total,
    showSizeChanger: false,
    hideOnSinglePage: true,
    showTotal: (count: number, [from, to]: [number, number]) => t("loans.range", { from, to, total: count }),
    onChange: onPageChange,
  };

  return (
    <div className="fl-table">
      {/* sm+: table. Below sm, seven columns can't fit 390px without truncating every
          field, so a stacked card list takes over — swapped in by CSS (hidden/sm:hidden),
          never a JS width check, so SSR output matches the client. */}
      <div className="hidden sm:block">
        <Table<Loan>
          rowKey="id"
          columns={isInitialLoading ? skeletonColumns : columns}
          dataSource={rows}
          loading={isRefreshing}
          scroll={{ x: 960 }}
          aria-busy={isInitialLoading || isRefreshing}
          rowClassName={() => (isInitialLoading ? "fl-row-skeleton" : "fl-row-clickable")}
          onRow={isInitialLoading ? undefined : (loan) => ({ onClick: () => onSelect(loan.id) })}
          locale={{ emptyText: emptyState }}
          pagination={false}
        />
      </div>

      <div className="sm:hidden">
        {isEmpty ? (
          emptyState
        ) : (
          <ul aria-busy={isInitialLoading || isRefreshing} className={cn(isRefreshing && "opacity-60 transition-opacity")}>
            {rows.map((loan, index) =>
              isInitialLoading ? (
                <li key={index} aria-hidden className="flex flex-col gap-2 border-b border-border px-6 py-4 last:border-b-0">
                  <div className="flex items-center justify-between gap-3">
                    <SkeletonBar className="w-16" />
                    <SkeletonBar className="w-20" />
                  </div>
                  <SkeletonBar className="w-28" />
                  <SkeletonBar className="w-20" />
                  <div className="flex items-center justify-between gap-3">
                    <SkeletonBar className="w-24" />
                    <SkeletonBar className="w-20" />
                  </div>
                  <SkeletonBar className="w-20" />
                </li>
              ) : (
                <li key={loan.id} className="border-b border-border last:border-b-0">
                  <button
                    type="button"
                    onClick={() => onSelect(loan.id)}
                    className="flex w-full flex-col gap-1.5 px-6 py-4 text-left transition-colors hover:bg-surface-hover"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-fg tabular-nums">{loan.id}</span>
                      <LoanStatusBadge status={loan.status} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-fg">{loan.customerName}</p>
                      <p className="text-meta text-fg-muted">{loan.customerId}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-fg-secondary">{t(`loanType.${loan.type}`)}</span>
                      <span className="font-medium text-fg tabular-nums">{formatCurrency(loan.amount)}</span>
                    </div>
                    <span className="text-meta text-fg-muted tabular-nums">{formatDate(loan.appliedAt, lang)}</span>
                  </button>
                </li>
              ),
            )}
          </ul>
        )}
      </div>

      {!isInitialLoading && !isEmpty && (
        <div className="flex justify-end">
          <Pagination {...paginationConfig} />
        </div>
      )}
    </div>
  );
}
