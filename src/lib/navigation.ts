import { HandCoins, LayoutDashboard, Settings, type LucideIcon } from "lucide-react";

import type { TranslationKey } from "@/lib/i18n/translations";

export interface NavItem {
  href: string;
  labelKey: TranslationKey;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/loans", labelKey: "nav.loans", icon: HandCoins },
  { href: "/settings", labelKey: "nav.settings", icon: Settings },
];
