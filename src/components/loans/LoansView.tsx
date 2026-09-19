"use client";

import { App, Button, Modal } from "antd";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAsync } from "@/hooks/useAsync";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { createLoan, getLoans } from "@/lib/api/loans";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { PAGE_SIZE } from "@/lib/loanRules";
import type { CreateLoanInput, LoanFilters as LoanFiltersValue, LoanQuery } from "@/types/loan";

import { EMPTY_LOAN_FILTERS, LoanFilters, hasActiveFilters } from "./LoanFilters";
import { LoanDetailsDrawer } from "./LoanDetailsDrawer";
import { LoanForm } from "./LoanForm";
import { LoanTable } from "./LoanTable";

/** The Loans module. One component, whichever organization is active — branding comes from the tenant config. */
export function LoansView() {
  const { t } = useI18n();
  const { message } = App.useApp();

  const [filters, setFilters] = useState<LoanFiltersValue>(EMPTY_LOAN_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  // Typing in search shouldn't fire a request per keystroke.
  const search = useDebouncedValue(filters.search, 300);
  const { status, type, dateRange } = filters;

  const query = useMemo<LoanQuery>(
    () => ({ search, status, type, dateRange, page, pageSize: PAGE_SIZE }),
    [search, status, type, dateRange, page],
  );
  const fetchLoans = useCallback(() => getLoans(query), [query]);
  const { data, error, isLoading, isInitialLoading, reload } = useAsync(fetchLoans);

  const changeFilters = (next: LoanFiltersValue) => {
    setFilters(next);
    setPage(1);
  };

  const openLoan = useCallback((id: string) => {
    setSelectedId(id);
    setDrawerOpen(true);
  }, []);

  const handleCreate = async (input: CreateLoanInput) => {
    const loan = await createLoan(input);
    setCreateOpen(false);
    setFilters(EMPTY_LOAN_FILTERS);
    setPage(1);
    reload();
    message.success(t("loans.created", { id: loan.id }));
  };

  return (
    <>
      <PageHeader
        title={t("loans.title")}
        subtitle={t("loans.subtitle")}
        actions={
          <Button type="primary" icon={<Plus className="size-4" aria-hidden />} onClick={() => setCreateOpen(true)}>
            {t("loans.new")}
          </Button>
        }
      />

      <Card padded={false}>
        <LoanFilters value={filters} onChange={changeFilters} />

        {error ? (
          <ErrorState title={t("loans.error.title")} description={t("loans.error.description")} onRetry={reload} />
        ) : (
          <LoanTable
            loans={data?.items}
            total={data?.total ?? 0}
            page={page}
            pageSize={PAGE_SIZE}
            isInitialLoading={isInitialLoading}
            isRefreshing={isLoading && !isInitialLoading}
            onPageChange={setPage}
            onSelect={openLoan}
            emptyAction={
              hasActiveFilters(filters) ? (
                <Button onClick={() => changeFilters(EMPTY_LOAN_FILTERS)}>{t("common.clearFilters")}</Button>
              ) : undefined
            }
          />
        )}
      </Card>

      <LoanDetailsDrawer open={drawerOpen} loanId={selectedId} onClose={() => setDrawerOpen(false)} />

      <Modal
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        title={t("form.title")}
        footer={null}
        width={640}
        destroyOnHidden
      >
        <p className="mb-6 text-caption text-fg-muted">{t("form.subtitle")}</p>
        <LoanForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>
    </>
  );
}
