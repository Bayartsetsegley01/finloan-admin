# FinLoan Admin

A white-label, multi-tenant loan management admin dashboard.
Built to demonstrate frontend engineering quality: one codebase → multiple organizations → configurable branding.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Ant Design 6 · Lucide · mock API layer

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build
```

## What to look at

| Area | Where |
| --- | --- |
| **White label / multi-tenant** | `src/lib/tenant/` (registry, provider, cookie persistence) · `src/lib/theme/tokens.ts` · `src/lib/theme/antdTheme.ts` |
| **Loans module (core)** | `src/components/loans/` — `LoansView` composes `LoanFilters`, `LoanTable`, `LoanDetailsDrawer`, `LoanForm` |
| **API / data layer** | `src/lib/api/` (services) · `src/lib/mock/` (in-memory data) · `src/hooks/useAsync.ts` |
| **i18n (MN default / EN)** | `src/lib/i18n/` — typed dictionaries, `mn` is the source of truth |
| **Design system** | `src/app/globals.css` (Tailwind theme + AntD refinements) · `src/components/ui/` |

## Architecture

```
src/
  app/                    Routes only. (app)/{dashboard,loans,settings}/page.tsx are thin wrappers.
  components/
    ui/                   Badge, Card, PageHeader, StatCard, EmptyState, ErrorState, DefinitionList, BrandMark, SkeletonBar
    layout/               AppShell, Sidebar, Header, OrganizationSwitcher, LanguageSwitcher
    loans/                LoansView, LoanFilters, LoanTable, LoanDetails(+Drawer), LoanForm, LoanStatusBadge
    dashboard/            DashboardView, LoanOverviewChart, RecentApplications
    settings/             SettingsView, BrandingPreview, ColorField, SettingsField
  lib/
    api/                  loans.ts, customers.ts, dashboard.ts, client.ts (latency + failure simulation)
    mock/                 realistic Mongolian FinTech data — never imported by components
    i18n/  tenant/  theme/
  hooks/                  useAsync, useDebouncedValue
  types/                  loan, customer, dashboard, tenant
  providers/              Providers.tsx (AntD registry → Tenant → I18n → ConfigProvider)
```

### White label in one paragraph

Components never know which organization is active. They use semantic tokens (`bg-primary`, `text-primary-text`,
`bg-primary-soft`, `bg-surface` …) that resolve to CSS variables on `<html>`, and Ant Design receives the same values through
`ConfigProvider`. `TenantConfig` (name, logo, primary/secondary color, theme) is the only input. Switching organization in the
sidebar/Settings, or editing colors live, re-themes everything — the Loans page is the same component throughout.
Derived shades (hover / soft / border) are computed with `color-mix()` so any brand color works, and the readable text color on
primary buttons is chosen automatically by contrast ratio.

Tenant + language are stored in **cookies**, read by the root layout on the server, so the first paint already has the right brand
and language (no flash of the wrong theme).

### Data-fetching states

`useAsync(fetcher)` is a ~40-line stale-while-revalidate hook (derived state, no race conditions). Every screen shows:
skeleton on first load → dimmed rows + spinner on refetch → `ErrorState` with retry → `EmptyState` with "clear filters".
Turn on **Settings → Developer tools → Simulate API errors** to review the error states.

### Design system (foundations)

| Token | Value |
| --- | --- |
| Font | Inter (self-hosted via `@fontsource-variable/inter`, Cyrillic incl. Ө/Ү) — weights 400 / 500 / 600 |
| Type scale | page title 24/32 · KPI 28/36 · section 16/24 · body 14/20 · caption 13/20 · meta 12/16 |
| Spacing | 4px base, 8px rhythm (gaps 8 / 16 / 24 / 32) |
| Radius | 6 (chips) · 8 (controls) · 12 (surfaces) |
| Elevation | hairline borders first; shadow only on overlays |
| Chart | brand color = approved (solid) / pending (tint); red reserved for overdue; legend + tooltip + hidden data table |

Ant Design is themed through tokens (`antdTheme.ts`) plus a handful of targeted CSS refinements for Table. AntD lives in its own CSS
layer **below** Tailwind, so utilities can always override it.

### Responsive

`≥1024px` 240px sidebar · `768–1023px` 72px icon rail · `<768px` drawer. Tables scroll horizontally, forms and cards stack.

### Accessibility

Semantic landmarks, skip link, `aria-current`, labelled controls, keyboard-reachable actions (row click is a convenience — the ID
button and "view" button do the same), visible focus rings, `prefers-reduced-motion`, chart has a screen-reader data table.
Audited with axe-core (WCAG 2 A/AA + best-practice) in both tenants, both themes, both languages: 0 violations.

## Notes / trade-offs

- Mock "database" lives in memory; created loans persist until reload.
- Logo upload is a placeholder (kept in the browser only, not persisted).
- The dashboard greeting follows Ulaanbaatar time (server-computed, so no hydration mismatch).
- Suggested Git flow: `main` ← short-lived `feat/*` branches, Conventional Commits
  (e.g. `feat(loans): add filter bar`, `feat(tenant): cookie persistence`).
