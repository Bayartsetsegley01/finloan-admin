import type { DashboardSummary } from "@/types/dashboard";

export const dashboardSummary: DashboardSummary = {
  totalLoanValue: { value: 12_400_000_000, change: 8.2 },
  activeLoans: { value: 1_248, change: 3.1 },
  pendingApplications: { value: 86, change: 10.3 },
  overdueLoans: { value: 32, change: 6.7 },
  overview: [
    { month: "2025-10", approved: 132, pending: 38, overdue: 14 },
    { month: "2025-11", approved: 141, pending: 41, overdue: 15 },
    { month: "2025-12", approved: 138, pending: 47, overdue: 17 },
    { month: "2026-01", approved: 150, pending: 39, overdue: 16 },
    { month: "2026-02", approved: 158, pending: 44, overdue: 18 },
    { month: "2026-03", approved: 167, pending: 52, overdue: 20 },
    { month: "2026-04", approved: 176, pending: 61, overdue: 21 },
    { month: "2026-05", approved: 189, pending: 58, overdue: 23 },
    { month: "2026-06", approved: 205, pending: 66, overdue: 25 },
    { month: "2026-07", approved: 224, pending: 73, overdue: 26 },
    { month: "2026-08", approved: 241, pending: 78, overdue: 30 },
    { month: "2026-09", approved: 258, pending: 86, overdue: 32 },
  ],
};
