"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { TENANT_COOKIE, writeCookie } from "@/lib/preferences";
import { buildCssVariables } from "@/lib/theme/tokens";
import type { TenantBranding, TenantConfig, TenantId } from "@/types/tenant";

import { TENANT_LIST, TENANTS, serializeTenant } from "./tenants";

interface TenantContextValue {
  /** The config currently applied to the UI (may include unsaved edits). */
  config: TenantConfig;
  tenants: TenantConfig[];
  isDirty: boolean;
  /** Switches organization and persists immediately. Theme mode is a user preference and is kept. */
  switchTenant: (id: TenantId) => void;
  /** Live-edits branding; the whole app re-themes instantly. */
  updateBranding: (patch: Partial<TenantBranding>) => void;
  save: () => void;
  discard: () => void;
}

const TenantContext = createContext<TenantContextValue | null>(null);

const brandingKeys = ["organizationName", "logo", "primaryColor", "secondaryColor", "theme"] as const;

const isSameBranding = (a: TenantConfig, b: TenantConfig) =>
  brandingKeys.every((key) => a[key] === b[key]);

function applyToDocument(config: TenantConfig): void {
  const root = document.documentElement;
  for (const [name, value] of Object.entries(buildCssVariables(config))) {
    root.style.setProperty(name, value);
  }
  root.dataset.theme = config.theme;
}

export function TenantProvider({
  initialConfig,
  children,
}: {
  initialConfig: TenantConfig;
  children: ReactNode;
}) {
  const [saved, setSaved] = useState(initialConfig);
  const [config, setConfig] = useState(initialConfig);

  // The server already rendered the initial variables on <html>; this keeps them in sync afterwards.
  useEffect(() => applyToDocument(config), [config]);

  const persist = useCallback((next: TenantConfig) => {
    setSaved(next);
    writeCookie(TENANT_COOKIE, serializeTenant(next));
  }, []);

  const switchTenant = useCallback(
    (id: TenantId) => {
      const next: TenantConfig = { ...TENANTS[id], theme: config.theme };
      setConfig(next);
      persist(next);
    },
    [config.theme, persist],
  );

  const updateBranding = useCallback((patch: Partial<TenantBranding>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const save = useCallback(() => persist(config), [config, persist]);
  const discard = useCallback(() => setConfig(saved), [saved]);

  const value = useMemo<TenantContextValue>(
    () => ({
      config,
      tenants: TENANT_LIST,
      isDirty: !isSameBranding(config, saved),
      switchTenant,
      updateBranding,
      save,
      discard,
    }),
    [config, saved, switchTenant, updateBranding, save, discard],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);
  if (!context) throw new Error("useTenant must be used within <TenantProvider>");
  return context;
}
