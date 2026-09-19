import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import type { CSSProperties, ReactNode } from "react";

import "@fontsource-variable/inter";
import "./globals.css";

import { LANGUAGE_COOKIE, TENANT_COOKIE, parseLanguage } from "@/lib/preferences";
import { parseStoredTenant } from "@/lib/tenant/tenants";
import { buildCssVariables } from "@/lib/theme/tokens";
import { Providers } from "@/providers/Providers";

export const metadata: Metadata = {
  title: { default: "FinLoan Admin", template: "%s · FinLoan Admin" },
  description: "White-label loan management admin dashboard.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Brand + language come from cookies, so the first server-rendered paint is already correct.
  const cookieStore = await cookies();
  const tenant = parseStoredTenant(cookieStore.get(TENANT_COOKIE)?.value);
  const language = parseLanguage(cookieStore.get(LANGUAGE_COOKIE)?.value);

  return (
    <html
      lang={language}
      data-theme={tenant.theme}
      style={buildCssVariables(tenant) as CSSProperties}
      suppressHydrationWarning
    >
      <body>
        <Providers initialTenant={tenant} initialLanguage={language}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
