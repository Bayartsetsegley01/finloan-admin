"use client";

import { ChevronRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { NAV_ITEMS } from "@/lib/navigation";
import { useTenant } from "@/lib/tenant/TenantProvider";

import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const { config } = useTenant();

  const current = NAV_ITEMS.find(({ href }) => pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-surface px-4 md:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label={t("nav.openMenu")}
        className="-ml-2 grid size-9 place-items-center rounded-md text-fg-secondary transition-colors hover:bg-surface-hover hover:text-fg md:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <nav aria-label={t("shell.breadcrumb")} className="min-w-0 flex-1">
        <ol className="flex items-center gap-1.5 text-body">
          <li className="hidden truncate text-fg-muted sm:block">{config.organizationName}</li>
          <li aria-hidden className="hidden text-fg-muted sm:block">
            <ChevronRight className="size-4" />
          </li>
          <li aria-current="page" className="truncate font-medium text-fg">
            {current ? t(current.labelKey) : null}
          </li>
        </ol>
      </nav>

      <LanguageSwitcher />
    </header>
  );
}
