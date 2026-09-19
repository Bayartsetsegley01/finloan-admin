"use client";

import { Drawer } from "antd";
import { useCallback } from "react";

import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import { useAsync } from "@/hooks/useAsync";
import { getLoanById } from "@/lib/api/loans";
import { useI18n } from "@/lib/i18n/I18nProvider";

import { LoanDetails } from "./LoanDetails";

function DrawerSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <div className="flex flex-col gap-3">
        <SkeletonBar className="w-16" />
        <SkeletonBar className="h-7 w-44" />
      </div>
      {[0, 1, 2].map((section) => (
        <div key={section} className="flex flex-col gap-4 border-t border-border pt-6">
          <SkeletonBar className="w-32" />
          <SkeletonBar className="w-full" />
          <SkeletonBar className="w-5/6" />
          <SkeletonBar className="w-2/3" />
        </div>
      ))}
    </div>
  );
}

/** Fetches and renders a single loan. Mounted per loan id, so state never leaks between loans. */
function DrawerContent({ loanId }: { loanId: string }) {
  const { t } = useI18n();
  const fetcher = useCallback(() => getLoanById(loanId), [loanId]);
  const { data, error, reload } = useAsync(fetcher);

  if (error) {
    return <ErrorState title={t("details.error.title")} onRetry={reload} />;
  }
  if (!data) {
    return <DrawerSkeleton />;
  }
  return <LoanDetails loan={data} />;
}

interface LoanDetailsDrawerProps {
  open: boolean;
  loanId: string | null;
  onClose: () => void;
}

export function LoanDetailsDrawer({ open, loanId, onClose }: LoanDetailsDrawerProps) {
  const { t } = useI18n();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={t("details.title")}
      size="min(480px, 100vw)"
      destroyOnHidden
      closable={{ placement: "end" }}
      styles={{ body: { paddingTop: 8 } }}
    >
      {loanId && <DrawerContent key={loanId} loanId={loanId} />}
    </Drawer>
  );
}
