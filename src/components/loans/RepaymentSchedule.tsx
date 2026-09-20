"use client";

import { Table, type TableColumnsType } from "antd";
import { useMemo } from "react";

import { cn } from "@/lib/cn";
import { formatCurrency, formatDate } from "@/lib/format";
import { generateAmortizationSchedule } from "@/lib/finance";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { LoanDetails, ScheduleRow } from "@/types/loan";

interface ScheduleTableRow extends ScheduleRow {
  isPaid: boolean;
}

/** Amount cell: muted once paid, brand-colored on the upcoming due row. */
function AmountCell({ value, row, muted }: { value: number; row: ScheduleTableRow; muted: boolean }) {
  return (
    <span className={cn("tabular-nums", row.isPaid ? "text-fg-muted" : muted ? "text-fg" : "font-medium text-primary-text")}>
      {formatCurrency(value)}
    </span>
  );
}

/** Amortization table shown in the loan drawer's "Payment schedule" tab. */
export function RepaymentSchedule({ loan }: { loan: LoanDetails }) {
  const { t, lang } = useI18n();

  const rows = useMemo<ScheduleTableRow[]>(() => {
    if (loan.status === "pending") return [];

    const disbursedAt = loan.activity.find((item) => item.type === "disbursed")?.at ?? loan.appliedAt;
    const schedule = generateAmortizationSchedule({
      amount: loan.amount,
      annualRate: loan.interestRate,
      termMonths: loan.term,
      startDate: disbursedAt.slice(0, 10),
      method: "annuity",
    });

    let paidSoFar = 0;
    return schedule.map((row) => {
      const isPaid = paidSoFar + row.principal <= loan.repaidAmount;
      paidSoFar += row.principal;
      return { ...row, isPaid };
    });
  }, [loan]);

  if (loan.status === "pending") {
    return <p className="text-caption text-fg-muted">{t("schedule.notReady")}</p>;
  }

  const nextDueIndex = rows.find((row) => !row.isPaid)?.index ?? null;

  const columns: TableColumnsType<ScheduleTableRow> = [
    {
      key: "index",
      title: <span className="whitespace-nowrap">{t("schedule.col.index")}</span>,
      dataIndex: "index",
      width: 72,
      render: (index: number, row) => (
        <span className={cn("tabular-nums", row.isPaid && "text-fg-muted")}>{index}</span>
      ),
    },
    {
      key: "dueDate",
      title: t("schedule.col.dueDate"),
      dataIndex: "dueDate",
      render: (dueDate: string, row) => (
        <span className={cn("tabular-nums", row.isPaid ? "text-fg-muted" : "font-medium text-fg")}>
          {formatDate(dueDate, lang)}
        </span>
      ),
    },
    {
      key: "openingBalance",
      title: t("schedule.col.openingBalance"),
      dataIndex: "openingBalance",
      align: "right",
      render: (value: number, row) => <AmountCell value={value} row={row} muted />,
    },
    {
      key: "principal",
      title: t("schedule.col.principal"),
      dataIndex: "principal",
      align: "right",
      render: (value: number, row) => <AmountCell value={value} row={row} muted={false} />,
    },
    {
      key: "interest",
      title: t("schedule.col.interest"),
      dataIndex: "interest",
      align: "right",
      render: (value: number, row) => <AmountCell value={value} row={row} muted />,
    },
    {
      key: "total",
      title: t("schedule.col.total"),
      dataIndex: "total",
      align: "right",
      render: (value: number, row) => <AmountCell value={value} row={row} muted={false} />,
    },
    {
      key: "closingBalance",
      title: t("schedule.col.closingBalance"),
      dataIndex: "closingBalance",
      align: "right",
      render: (value: number, row) => <AmountCell value={value} row={row} muted />,
    },
  ];

  const totals = rows.reduce(
    (acc, row) => ({
      principal: acc.principal + row.principal,
      interest: acc.interest + row.interest,
      total: acc.total + row.total,
    }),
    { principal: 0, interest: 0, total: 0 },
  );

  return (
    <Table<ScheduleTableRow>
      className="fl-table"
      rowKey="index"
      aria-label={t("schedule.caption")}
      columns={columns}
      dataSource={rows}
      pagination={false}
      scroll={{ y: 360, x: 720 }}
      rowClassName={(row) => cn(row.index === nextDueIndex && "bg-primary-soft")}
      summary={() => (
        <Table.Summary fixed="bottom">
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}>
              <span className="font-medium text-fg">{t("schedule.summary.total")}</span>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} />
            <Table.Summary.Cell index={2} align="right">
              <span className="font-medium text-fg tabular-nums">{formatCurrency(totals.principal)}</span>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="right">
              <span className="font-medium text-fg tabular-nums">{formatCurrency(totals.interest)}</span>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4} align="right">
              <span className="font-medium text-fg tabular-nums">{formatCurrency(totals.total)}</span>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={5} />
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  );
}
