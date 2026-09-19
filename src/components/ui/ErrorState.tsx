"use client";

import { Button } from "antd";
import { CircleAlert, RefreshCw } from "lucide-react";

import { useI18n } from "@/lib/i18n/I18nProvider";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/** Inline failure state with a retry action. Announced to assistive tech via role="alert". */
export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  const { t } = useI18n();

  return (
    <div role="alert" className="flex flex-col items-center px-6 py-16 text-center">
      <span className="grid size-10 place-items-center rounded-lg bg-danger-soft text-danger">
        <CircleAlert className="size-5" aria-hidden />
      </span>
      <h3 className="mt-4 text-body font-semibold text-fg">{title ?? t("common.error.title")}</h3>
      <p className="mt-1 max-w-sm text-caption text-fg-muted">
        {description ?? t("common.error.description")}
      </p>
      {onRetry && (
        <Button className="mt-5" icon={<RefreshCw className="size-4" aria-hidden />} onClick={onRetry}>
          {t("common.retry")}
        </Button>
      )}
    </div>
  );
}
