import { dashboardSummary } from "@/lib/mock/dashboard";
import type { DashboardSummary } from "@/types/dashboard";

import { simulateRequest } from "./client";

export function getDashboardSummary(): Promise<DashboardSummary> {
  return simulateRequest(() => dashboardSummary);
}
