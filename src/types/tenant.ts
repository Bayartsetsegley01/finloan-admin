export type ThemeMode = "light" | "dark";

export type TenantId = "mbank" | "fingo";

/**
 * Everything that differs between organizations lives here.
 * The application code never branches on the tenant id — it only reads this config.
 */
export interface TenantConfig {
  id: TenantId;
  organizationId: string;
  organizationName: string;
  /** Optional image URL. When absent a monogram is generated from the name. */
  logo?: string;
  primaryColor: string;
  secondaryColor?: string;
  theme: ThemeMode;
}

/** The fields a user may customise in Settings → Branding. */
export type TenantBranding = Pick<
  TenantConfig,
  "organizationName" | "logo" | "primaryColor" | "secondaryColor" | "theme"
>;
