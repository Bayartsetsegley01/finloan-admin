"use client";

import { App, Button, Input, Segmented, Switch, Upload } from "antd";
import { Moon, Sun, Upload as UploadIcon } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { BrandMark } from "@/components/ui/BrandMark";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getSimulateFailure, setSimulateFailure } from "@/lib/api/client";
import { getContrastRatio } from "@/lib/color";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useTenant } from "@/lib/tenant/TenantProvider";
import { palettes } from "@/lib/theme/tokens";
import type { ThemeMode } from "@/types/tenant";

import { BrandingPreview } from "./BrandingPreview";
import { ColorField } from "./ColorField";
import { SettingsField } from "./SettingsField";

/** Below this ratio, brand color as text/icon on the surface is hard to see. */
const MIN_BRAND_CONTRAST = 3;

const themeOption = (value: ThemeMode, label: string, icon: React.ReactNode) => ({
  value,
  label: (
    <span className="inline-flex items-center gap-2 px-1">
      {icon}
      {label}
    </span>
  ),
});

export function SettingsView() {
  const { t } = useI18n();
  const { message } = App.useApp();
  const { config, tenants, isDirty, switchTenant, updateBranding, save, discard } = useTenant();
  const [simulateErrors, setSimulateErrors] = useState(getSimulateFailure);

  const surface = palettes[config.theme].surface;
  const lowContrast = (hex: string) =>
    getContrastRatio(hex, surface) < MIN_BRAND_CONTRAST ? t("settings.lowContrast") : undefined;

  const handleSave = () => {
    save();
    message.success(t("settings.saved"));
  };

  const handleLogoSelected = (file: File) => {
    if (config.logo?.startsWith("blob:")) URL.revokeObjectURL(config.logo);
    updateBranding({ logo: URL.createObjectURL(file) });
    return false; // placeholder: keep the file in the browser, no upload request
  };

  const handleSimulateErrors = (value: boolean) => {
    setSimulateFailure(value);
    setSimulateErrors(value);
  };

  return (
    <>
      <PageHeader
        title={t("settings.title")}
        subtitle={t("settings.subtitle")}
        actions={
          <>
            {isDirty && <Badge tone="warning">{t("settings.unsaved")}</Badge>}
            <Button onClick={discard} disabled={!isDirty}>
              {t("settings.discard")}
            </Button>
            <Button type="primary" onClick={handleSave} disabled={!isDirty}>
              {t("settings.save")}
            </Button>
          </>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-6">
          <Card
            padded={false}
            title={t("settings.organization")}
            description={t("settings.organization.description")}
          >
            <div className="divide-y divide-border border-t border-border">
              <SettingsField label={t("settings.activeOrganization")}>
                <Segmented
                  value={config.id}
                  onChange={switchTenant}
                  options={tenants.map((tenant) => ({
                    value: tenant.id,
                    label: (
                      <span className="inline-flex items-center gap-2 py-0.5">
                        <BrandMark
                          size="sm"
                          name={tenant.organizationName}
                          primaryColor={tenant.primaryColor}
                          secondaryColor={tenant.secondaryColor}
                        />
                        {tenant.organizationName}
                      </span>
                    ),
                  }))}
                />
              </SettingsField>
              <SettingsField label={t("settings.organizationName")} htmlFor="org-name">
                <Input
                  id="org-name"
                  value={config.organizationName}
                  maxLength={60}
                  onChange={(event) => updateBranding({ organizationName: event.target.value })}
                  className="max-w-sm"
                />
              </SettingsField>
              <SettingsField label={t("settings.organizationId")} htmlFor="org-id">
                <Input id="org-id" value={config.organizationId} readOnly className="max-w-sm tabular-nums" />
              </SettingsField>
            </div>
          </Card>

          <Card padded={false} title={t("settings.branding")} description={t("settings.branding.description")}>
            <div className="divide-y divide-border border-t border-border">
              <SettingsField label={t("settings.logo")} description={t("settings.logo.hint")}>
                <div className="flex flex-wrap items-center gap-4">
                  <BrandMark name={config.organizationName} logo={config.logo} />
                  <Upload
                    accept="image/png,image/svg+xml,image/jpeg"
                    showUploadList={false}
                    maxCount={1}
                    beforeUpload={handleLogoSelected}
                  >
                    <Button icon={<UploadIcon className="size-4" aria-hidden />}>{t("settings.logo.upload")}</Button>
                  </Upload>
                  {config.logo && (
                    <Button type="text" onClick={() => updateBranding({ logo: undefined })}>
                      {t("settings.logo.remove")}
                    </Button>
                  )}
                </div>
              </SettingsField>
              <SettingsField label={t("settings.primaryColor")}>
                <ColorField
                  value={config.primaryColor}
                  onChange={(primaryColor) => updateBranding({ primaryColor })}
                  warning={lowContrast(config.primaryColor)}
                />
              </SettingsField>
              <SettingsField label={t("settings.secondaryColor")}>
                <ColorField
                  value={config.secondaryColor ?? config.primaryColor}
                  onChange={(secondaryColor) => updateBranding({ secondaryColor })}
                />
              </SettingsField>
            </div>
          </Card>

          <Card padded={false} title={t("settings.theme")}>
            <div className="border-t border-border">
              <SettingsField label={t("settings.theme")}>
                <Segmented<ThemeMode>
                  value={config.theme}
                  onChange={(theme) => updateBranding({ theme })}
                  options={[
                    themeOption("light", t("settings.theme.light"), <Sun className="size-4" aria-hidden />),
                    themeOption("dark", t("settings.theme.dark"), <Moon className="size-4" aria-hidden />),
                  ]}
                />
              </SettingsField>
            </div>
          </Card>

          <Card padded={false} title={t("settings.developer")} description={t("settings.developer.description")}>
            <div className="border-t border-border">
              <SettingsField
                label={t("settings.simulateErrors")}
                description={t("settings.simulateErrors.description")}
                htmlFor="simulate-errors"
              >
                <Switch id="simulate-errors" checked={simulateErrors} onChange={handleSimulateErrors} />
              </SettingsField>
            </div>
          </Card>
        </div>

        <BrandingPreview />
      </div>
    </>
  );
}
