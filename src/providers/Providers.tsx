"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import mnMN from "antd/locale/mn_MN";
import dayjs from "dayjs";
import "dayjs/locale/mn";
import { useEffect, useMemo, type ReactNode } from "react";

import { I18nProvider, useI18n } from "@/lib/i18n/I18nProvider";
import type { Language } from "@/lib/i18n/translations";
import { TenantProvider, useTenant } from "@/lib/tenant/TenantProvider";
import { buildAntdTheme } from "@/lib/theme/antdTheme";
import type { TenantConfig } from "@/types/tenant";

/** Bridges our tenant + language state into Ant Design's ConfigProvider. */
function AntdConfig({ children }: { children: ReactNode }) {
  const { config } = useTenant();
  const { lang } = useI18n();

  const theme = useMemo(() => buildAntdTheme(config), [config]);

  useEffect(() => {
    dayjs.locale(lang === "mn" ? "mn" : "en");
  }, [lang]);

  return (
    <ConfigProvider theme={theme} locale={lang === "mn" ? mnMN : enUS}>
      <App component={false}>{children}</App>
    </ConfigProvider>
  );
}

export function Providers({
  initialTenant,
  initialLanguage,
  children,
}: {
  initialTenant: TenantConfig;
  initialLanguage: Language;
  children: ReactNode;
}) {
  return (
    <AntdRegistry layer>
      <TenantProvider initialConfig={initialTenant}>
        <I18nProvider initialLanguage={initialLanguage}>
          <AntdConfig>{children}</AntdConfig>
        </I18nProvider>
      </TenantProvider>
    </AntdRegistry>
  );
}
