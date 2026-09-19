import { isValidHex, normalizeHex } from "@/lib/color";
import type { TenantConfig, TenantId } from "@/types/tenant";

/**
 * Tenant registry. In a real product this would come from an API keyed by domain / subdomain;
 * here it is a static map so the white-label mechanics are easy to follow.
 */
export const TENANTS: Record<TenantId, TenantConfig> = {
  mbank: {
    id: "mbank",
    organizationId: "ORG-MBK-0001",
    organizationName: "M Bank",
    primaryColor: "#2455E0",
    secondaryColor: "#0E9AA7",
    theme: "light",
  },
  fingo: {
    id: "fingo",
    organizationId: "ORG-FGO-0002",
    organizationName: "FinGo",
    primaryColor: "#6D4AE0",
    secondaryColor: "#E0679A",
    theme: "light",
  },
};

export const TENANT_LIST: TenantConfig[] = Object.values(TENANTS);

export const DEFAULT_TENANT_ID: TenantId = "mbank";

/** Curated brand colors offered in Settings. */
export const BRAND_COLOR_PRESETS = ["#2455E0", "#4F46E5", "#6D4AE0", "#0E7C86", "#15803D", "#334155"];

const isTenantId = (value: unknown): value is TenantId =>
  typeof value === "string" && value in TENANTS;

/** What we persist: the tenant id plus the customisable branding fields. */
type StoredTenant = Partial<Pick<TenantConfig, "organizationName" | "primaryColor" | "secondaryColor" | "theme">> & {
  id?: unknown;
};

export function serializeTenant(config: TenantConfig): string {
  const stored: StoredTenant = {
    id: config.id,
    organizationName: config.organizationName,
    primaryColor: config.primaryColor,
    secondaryColor: config.secondaryColor,
    theme: config.theme,
  };
  return JSON.stringify(stored);
}

/** Rebuilds a valid TenantConfig from an untrusted cookie value. Falls back to the default tenant. */
export function parseStoredTenant(raw: string | undefined): TenantConfig {
  let stored: StoredTenant = {};
  try {
    if (raw) stored = JSON.parse(raw) as StoredTenant;
  } catch {
    // Corrupt cookie → use defaults.
  }

  const preset = TENANTS[isTenantId(stored.id) ? stored.id : DEFAULT_TENANT_ID];

  return {
    ...preset,
    organizationName:
      typeof stored.organizationName === "string" && stored.organizationName.trim()
        ? stored.organizationName.trim().slice(0, 60)
        : preset.organizationName,
    primaryColor:
      typeof stored.primaryColor === "string" && isValidHex(stored.primaryColor)
        ? normalizeHex(stored.primaryColor)
        : preset.primaryColor,
    secondaryColor:
      typeof stored.secondaryColor === "string" && isValidHex(stored.secondaryColor)
        ? normalizeHex(stored.secondaryColor)
        : preset.secondaryColor,
    theme: stored.theme === "dark" ? "dark" : "light",
  };
}
