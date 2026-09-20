"use client";

import { Tabs } from "antd";
import type { ReactNode } from "react";

import { DefinitionList } from "@/components/ui/DefinitionList";
import { cn } from "@/lib/cn";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { LoanActivity, LoanDetails as LoanDetailsData } from "@/types/loan";

import { LoanStatusBadge } from "./LoanStatusBadge";
import { RepaymentSchedule } from "./RepaymentSchedule";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border pt-6">
      <h3 className="mb-4 text-body font-semibold text-fg">{title}</h3>
      {children}
    </section>
  );
}

function RepaymentProgress({ paid, total }: { paid: number; total: number }) {
  const { t } = useI18n();
  const percent = total > 0 ? Math.round((paid / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-caption text-fg-muted">{t("details.paid")}</p>
          <p className="mt-0.5 text-section text-fg tabular-nums">{formatCurrency(paid)}</p>
        </div>
        <div className="text-right">
          <p className="text-caption text-fg-muted">{t("details.remaining")}</p>
          <p className="mt-0.5 text-section text-fg tabular-nums">{formatCurrency(total - paid)}</p>
        </div>
      </div>
      <div
        role="progressbar"
        aria-label={t("details.repayment")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-soft"
      >
        <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-meta text-fg-muted">{t("details.percentRepaid", { percent })}</p>
    </div>
  );
}

function ActivityTimeline({ items }: { items: LoanActivity[] }) {
  const { t, lang } = useI18n();

  return (
    <ol>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isNegative = item.type === "rejected" || item.type === "overdue";

        return (
          <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast && <span aria-hidden className="absolute top-5 bottom-0 left-[7px] w-px bg-border" />}
            <span
              aria-hidden
              className={cn(
                "relative mt-1 grid size-4 shrink-0 place-items-center rounded-full border-2 bg-surface",
                isLast ? (isNegative ? "border-mark-danger" : "border-primary") : "border-border-strong",
              )}
            >
              {isLast && <span className={cn("size-1.5 rounded-full", isNegative ? "bg-mark-danger" : "bg-primary")} />}
            </span>
            <div className="min-w-0">
              <p className="text-body text-fg">{t(`activity.${item.type}`)}</p>
              <p className="text-meta text-fg-muted tabular-nums">{formatDateTime(item.at, lang)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Presentational: everything shown in the loan drawer, given already-loaded data. */
export function LoanDetails({ loan }: { loan: LoanDetailsData }) {
  const { t, lang } = useI18n();
  const { customer } = loan;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-caption text-fg-muted tabular-nums">{loan.id}</p>
        <p className="mt-1 text-kpi text-fg tabular-nums">{formatCurrency(loan.amount)}</p>
      </div>

      <Section title={t("details.customer")}>
        <DefinitionList
          items={[
            { label: t("details.name"), value: <span className="font-medium">{customer.name}</span> },
            { label: t("details.phone"), value: <span className="tabular-nums">{customer.phone}</span> },
            { label: t("details.email"), value: customer.email },
            { label: t("details.customerId"), value: <span className="tabular-nums">{customer.id}</span> },
          ]}
        />
      </Section>

      <Section title={t("details.loan")}>
        <DefinitionList
          items={[
            { label: t("details.type"), value: t(`loanType.${loan.type}`) },
            { label: t("details.amount"), value: <span className="font-medium tabular-nums">{formatCurrency(loan.amount)}</span> },
            { label: t("details.interestRate"), value: t("unit.perYear", { rate: loan.interestRate }) },
            { label: t("details.term"), value: t("unit.months", { count: loan.term }) },
            { label: t("details.monthlyPayment"), value: <span className="tabular-nums">{formatCurrency(loan.monthlyPayment)}</span> },
            { label: t("details.status"), value: <LoanStatusBadge status={loan.status} /> },
            { label: t("details.appliedAt"), value: formatDate(loan.appliedAt, lang) },
            ...(loan.purpose ? [{ label: t("details.purpose"), value: loan.purpose }] : []),
          ]}
        />
      </Section>

      {loan.status !== "rejected" && (
        <Section title={t("details.repayment")}>
          <Tabs
            items={[
              {
                key: "progress",
                label: t("details.repayment.tabProgress"),
                children:
                  loan.status === "pending" ? (
                    <p className="text-caption text-fg-muted">{t("details.repaymentNotStarted")}</p>
                  ) : (
                    <RepaymentProgress paid={loan.repaidAmount} total={loan.amount} />
                  ),
              },
              {
                key: "schedule",
                label: t("details.repayment.tabSchedule"),
                children: <RepaymentSchedule loan={loan} />,
              },
            ]}
          />
        </Section>
      )}

      <Section title={t("details.activity")}>
        <ActivityTimeline items={loan.activity} />
      </Section>
    </div>
  );
}
