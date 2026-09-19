"use client";

import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { STATUS_TONE } from "@/lib/loanRules";
import type { LoanStatus } from "@/types/loan";

export function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const { t } = useI18n();
  return <Badge tone={STATUS_TONE[status]}>{t(`status.${status}`)}</Badge>;
}
