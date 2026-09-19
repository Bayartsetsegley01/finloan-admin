import type { Metadata } from "next";

import { DashboardView, type GreetingPeriod } from "@/components/dashboard/DashboardView";

export const metadata: Metadata = { title: "Dashboard" };

/** Greeting follows Ulaanbaatar time. Computed on the server so it never mismatches on hydration. */
function getGreetingPeriod(): GreetingPeriod {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Ulaanbaatar" }).format(
      new Date(),
    ),
  );
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export default function DashboardPage() {
  return <DashboardView greetingPeriod={getGreetingPeriod()} />;
}
