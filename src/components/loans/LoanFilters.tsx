"use client";

import { Button, DatePicker, Input, Select } from "antd";
import dayjs from "dayjs";
import { Search } from "lucide-react";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { LOAN_STATUSES, LOAN_TYPES, type LoanFilters as LoanFiltersValue } from "@/types/loan";

export const EMPTY_LOAN_FILTERS: LoanFiltersValue = { search: "" };

export const hasActiveFilters = (filters: LoanFiltersValue): boolean =>
  Boolean(filters.search || filters.status || filters.type || filters.dateRange);

const ISO_DATE = "YYYY-MM-DD";

interface LoanFiltersProps {
  value: LoanFiltersValue;
  onChange: (next: LoanFiltersValue) => void;
}

export function LoanFilters({ value, onChange }: LoanFiltersProps) {
  const { t } = useI18n();

  const statusOptions = LOAN_STATUSES.map((status) => ({ value: status, label: t(`status.${status}`) }));
  const typeOptions = LOAN_TYPES.map((type) => ({ value: type, label: t(`loanType.${type}`) }));

  return (
    <div
      role="search"
      aria-label={t("filters.label")}
      className="grid gap-3 border-b border-border p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_176px_192px_272px_auto] lg:items-center lg:px-6"
    >
      <Input
        allowClear
        value={value.search}
        onChange={(event) => onChange({ ...value, search: event.target.value })}
        prefix={<Search className="size-4 text-fg-muted" aria-hidden />}
        placeholder={t("filters.search")}
        aria-label={t("filters.search")}
        className="sm:col-span-2 lg:col-span-1"
      />

      <Select
        allowClear
        value={value.status}
        onChange={(status) => onChange({ ...value, status })}
        options={statusOptions}
        placeholder={t("filters.allStatuses")}
        aria-label={t("col.status")}
      />

      <Select
        allowClear
        value={value.type}
        onChange={(type) => onChange({ ...value, type })}
        options={typeOptions}
        placeholder={t("filters.allTypes")}
        aria-label={t("col.type")}
      />

      <DatePicker.RangePicker
        allowClear
        className="w-full sm:col-span-2 lg:col-span-1"
        format="YYYY.MM.DD"
        placeholder={[t("filters.dateStart"), t("filters.dateEnd")]}
        value={value.dateRange ? [dayjs(value.dateRange[0]), dayjs(value.dateRange[1])] : null}
        onChange={(dates) => {
          const [from, to] = dates ?? [];
          onChange({ ...value, dateRange: from && to ? [from.format(ISO_DATE), to.format(ISO_DATE)] : undefined });
        }}
      />

      {hasActiveFilters(value) && (
        <Button type="text" onClick={() => onChange(EMPTY_LOAN_FILTERS)} className="justify-self-start text-primary-text">
          {t("common.clearFilters")}
        </Button>
      )}
    </div>
  );
}
