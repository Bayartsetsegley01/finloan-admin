"use client";

import { Drawer } from "antd";
import { useState, type ReactNode } from "react";

import { useI18n } from "@/lib/i18n/I18nProvider";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

/**
 * Responsive frame.
 *  ≥1024px  240px sidebar
 *  ≥768px   72px icon rail
 *  <768px   sidebar becomes a drawer opened from the header
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useI18n();

  return (
    <div className="min-h-screen md:flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-body focus:font-medium focus:shadow-popover"
      >
        {t("shell.skipToContent")}
      </a>

      <aside className="hidden shrink-0 md:block md:w-[72px] lg:w-60">
        <div className="sticky top-0 h-screen border-r border-border">
          <Sidebar variant="rail" />
        </div>
      </aside>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left"
        size={280}
        closable={false}
        title={null}
        styles={{ header: { display: "none" }, body: { padding: 0 } }}
      >
        <Sidebar variant="drawer" onNavigate={() => setDrawerOpen(false)} />
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setDrawerOpen(true)} />
        <main id="main" className="flex-1 px-4 py-6 md:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1280px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
