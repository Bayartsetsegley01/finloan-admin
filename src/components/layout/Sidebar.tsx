"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/components/ui/BrandMark";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { NAV_ITEMS } from "@/lib/navigation";
import { useTenant } from "@/lib/tenant/TenantProvider";
import { CURRENT_USER } from "@/lib/user";

import { OrganizationSwitcher } from "./OrganizationSwitcher";

interface SidebarProps {
  /**
   * "rail"   → persistent desktop/tablet sidebar: full (240px) from lg, icon-only rail on md.
   * "drawer" → mobile drawer: always full.
   */
  variant: "rail" | "drawer";
  onNavigate?: () => void;
}

export function Sidebar({ variant, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const { config } = useTenant();
  const isRail = variant === "rail";

  // Labels collapse only in the tablet rail.
  const labelClass = isRail ? "hidden lg:block" : undefined;

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className={cn("flex h-16 shrink-0 items-center gap-3 px-5", isRail && "md:justify-center md:px-0 lg:justify-start lg:px-5")}>
        <BrandMark name={config.organizationName} logo={config.logo} />
        <span className={cn("truncate text-section text-fg", labelClass)}>{config.organizationName}</span>
      </div>

      <nav aria-label={t("nav.main")} className="flex-1 px-3 py-2">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            const label = t(labelKey);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  title={label}
                  onClick={onNavigate}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-md px-3 text-body font-medium transition-colors",
                    isRail && "md:justify-center md:px-0 lg:justify-start lg:px-3",
                    active
                      ? "bg-primary-soft text-primary-text"
                      : "text-fg-secondary hover:bg-surface-hover hover:text-fg",
                  )}
                >
                  <Icon className="size-[18px] shrink-0" aria-hidden />
                  <span className={labelClass}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-3 border-t border-border p-3">
        <OrganizationSwitcher collapsible={isRail} />
        <div className={cn("flex items-center gap-3 px-1", isRail && "md:justify-center md:px-0 lg:justify-start lg:px-1")}>
          <span
            aria-hidden
            className="grid size-8 shrink-0 place-items-center rounded-full bg-neutral-soft text-caption font-semibold text-fg-secondary"
          >
            {CURRENT_USER.name.charAt(0)}
          </span>
          <span className={cn("min-w-0", labelClass)}>
            <span className="block truncate text-caption font-medium text-fg">{CURRENT_USER.name}</span>
            <span className="block truncate text-meta text-fg-muted">{t("profile.role")}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
