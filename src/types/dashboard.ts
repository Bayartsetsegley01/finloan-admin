export interface KpiMetric {
  value: number;
  /** Month-over-month change, percent. Positive = increase. */
  change: number;
}

export interface MonthlyLoanOverview {
  /** ISO month (YYYY-MM). */
  month: string;
  approved: number;
  pending: number;
  overdue: number;
}

export interface DashboardSummary {
  totalLoanValue: KpiMetric;
  activeLoans: KpiMetric;
  pendingApplications: KpiMetric;
  overdueLoans: KpiMetric;
  overview: MonthlyLoanOverview[];
}
