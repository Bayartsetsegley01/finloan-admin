"use client";

import { Dropdown, type MenuProps } from "antd";
import { ChevronsUpDown } from "lucide-react";

import { BrandMark } from "@/components/ui/BrandMark";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useTenant } from "@/lib/tenant/TenantProvider";
import type { TenantId } from "@/types/tenant";

/** Switches the active tenant. Everything downstream re-brands because it only reads the tenant config. */
export function OrganizationSwitcher({ collapsible }: { collapsible?: boolean }) {
  const { config, tenants, switchTenant } = useTenant();
  const { t } = useI18n();

  const items: MenuProps["items"] = tenants.map((tenant) => ({
    key: tenant.id,
    label: (
      <span className="flex items-center gap-2.5">
        <BrandMark
          size="sm"
          name={tenant.organizationName}
          primaryColor={tenant.primaryColor}
          secondaryColor={tenant.secondaryColor}
        />
        {tenant.organizationName}
      </span>
    ),
  }));

  return (
    <Dropdown
      trigger={["click"]}
      placement="topLeft"
      menu={{
        items,
        selectable: true,
        selectedKeys: [config.id],
        onClick: ({ key }) => switchTenant(key as TenantId),
      }}
    >
      <button
        type="button"
        aria-label={`${t("org.switch")}: ${config.organizationName}`}
        aria-haspopup="menu"
        className={cn(
          "flex h-11 w-full items-center gap-3 rounded-md border border-border bg-surface px-2.5 text-left transition-colors hover:bg-surface-hover",
          collapsible && "md:justify-center md:px-0 lg:justify-start lg:px-2.5",
        )}
      >
        <BrandMark size="sm" name={config.organizationName} logo={config.logo} />
        <span className={cn("min-w-0 flex-1", collapsible && "md:hidden lg:block")}>
          <span className="block truncate text-caption font-medium text-fg">{config.organizationName}</span>
          <span className="block truncate text-meta text-fg-muted">{config.organizationId}</span>
        </span>
        <ChevronsUpDown
          className={cn("size-4 shrink-0 text-fg-muted", collapsible && "md:hidden lg:block")}
          aria-hidden
        />
      </button>
    </Dropdown>
  );
}
