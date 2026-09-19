"use client";

import { Button } from "antd";
import { HandCoins, LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";

import { LoanStatusBadge } from "@/components/loans/LoanStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { useI18n } from "@/lib/i18n/I18nProvider";

function PreviewGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-meta font-medium text-fg-muted">{label}</p>
      {children}
    </div>
  );
}

/**
 * Live preview. It renders the *real* Button, Badge and StatCard components —
 * there is nothing tenant-specific here, which is the point of the white-label setup.
 */
export function BrandingPreview() {
  const { t } = useI18n();

  return (
    <Card title={t("settings.preview")} description={t("settings.preview.description")} className="lg:sticky lg:top-24">
      <div className="flex flex-col gap-6">
        <PreviewGroup label={t("settings.preview.button.label")}>
          <div className="flex flex-wrap gap-2">
            <Button type="primary">{t("settings.preview.button")}</Button>
            <Button>{t("common.cancel")}</Button>
          </div>
        </PreviewGroup>

        <PreviewGroup label={t("settings.preview.badge.label")}>
          <div className="flex flex-wrap gap-2">
            <Badge tone="brand">{t("settings.preview.brandBadge")}</Badge>
            <LoanStatusBadge status="approved" />
            <LoanStatusBadge status="pending" />
          </div>
        </PreviewGroup>

        <PreviewGroup label={t("settings.preview.nav.label")}>
          {/* Non-interactive replica of the sidebar item styles */}
          <div className="flex flex-col gap-1" aria-hidden>
            <div className="flex h-10 items-center gap-3 rounded-md bg-primary-soft px-3 text-body font-medium text-primary-text">
              <HandCoins className="size-[18px]" />
              {t("nav.loans")}
            </div>
            <div className="flex h-10 items-center gap-3 rounded-md px-3 text-body font-medium text-fg-secondary">
              <LayoutDashboard className="size-[18px]" />
              {t("nav.dashboard")}
            </div>
          </div>
        </PreviewGroup>

        <PreviewGroup label={t("settings.preview.card.label")}>
          <StatCard
            label={t("kpi.activeLoans")}
            value="1,248"
            change={3.1}
            sentiment="positive"
            comparisonLabel={t("kpi.vsLastMonth")}
          />
        </PreviewGroup>
      </div>
    </Card>
  );
}
