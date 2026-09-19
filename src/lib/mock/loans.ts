import type { Loan, LoanStatus, LoanType } from "@/types/loan";

import { customers } from "./customers";

/** "Today" for the mock world, so relative data (dates, overdue) stays consistent. */
export const MOCK_TODAY = "2026-09-19";

type LoanSeed = readonly [
  num: number,
  customerId: string,
  type: LoanType,
  amount: number,
  interestRate: number,
  term: number,
  status: LoanStatus,
  appliedAt: string,
  repaidPercent: number,
];

const seeds: LoanSeed[] = [
  [10284, "CU-2041", "consumer", 8_500_000, 18.5, 24, "approved", "2026-09-18", 40],
  [10283, "CU-2042", "consumer", 2_500_000, 21, 12, "pending", "2026-09-18", 0],
  [10281, "CU-2043", "auto", 45_000_000, 14, 48, "pending", "2026-09-17", 0],
  [10279, "CU-2044", "business", 15_000_000, 16, 36, "approved", "2026-09-16", 4],
  [10277, "CU-2045", "mortgage", 180_000_000, 6, 240, "pending", "2026-09-15", 0],
  [10274, "CU-2046", "consumer", 5_000_000, 19.5, 18, "approved", "2026-09-14", 6],
  [10271, "CU-2047", "education", 12_000_000, 10, 36, "rejected", "2026-09-12", 0],
  [10268, "CU-2048", "consumer", 3_200_000, 21, 12, "pending", "2026-09-10", 0],
  [10262, "CU-2049", "business", 60_000_000, 15, 48, "approved", "2026-09-05", 3],
  [10257, "CU-2050", "consumer", 1_800_000, 22, 6, "approved", "2026-08-29", 33],
  [10251, "CU-2051", "auto", 32_000_000, 14.5, 36, "approved", "2026-08-24", 10],
  [10246, "CU-2052", "mortgage", 145_000_000, 6, 240, "pending", "2026-08-20", 0],
  [10240, "CU-2053", "consumer", 4_200_000, 20, 12, "rejected", "2026-08-14", 0],
  [10233, "CU-2054", "business", 25_000_000, 16.5, 24, "approved", "2026-08-07", 22],
  [10226, "CU-2041", "consumer", 6_000_000, 19, 18, "overdue", "2026-07-28", 25],
  [10219, "CU-2042", "consumer", 2_000_000, 21, 12, "approved", "2026-07-21", 45],
  [10212, "CU-2043", "education", 8_000_000, 10, 36, "approved", "2026-07-15", 15],
  [10205, "CU-2044", "consumer", 3_500_000, 20.5, 12, "overdue", "2026-07-09", 30],
  [10198, "CU-2045", "business", 40_000_000, 15.5, 36, "approved", "2026-07-02", 18],
  [10190, "CU-2046", "auto", 28_000_000, 14, 36, "overdue", "2026-06-24", 22],
  [10183, "CU-2047", "consumer", 5_500_000, 19, 24, "approved", "2026-06-18", 30],
  [10175, "CU-2048", "mortgage", 210_000_000, 6, 240, "approved", "2026-06-10", 3],
  [10168, "CU-2049", "consumer", 2_800_000, 22, 12, "rejected", "2026-06-03", 0],
  [10160, "CU-2050", "business", 18_000_000, 16, 24, "overdue", "2026-05-27", 35],
  [10151, "CU-2051", "consumer", 7_200_000, 18.5, 24, "approved", "2026-05-19", 28],
  [10142, "CU-2052", "education", 15_000_000, 9.5, 48, "approved", "2026-05-08", 20],
  [10133, "CU-2053", "consumer", 1_500_000, 23, 6, "overdue", "2026-04-22", 60],
  [10125, "CU-2054", "auto", 52_000_000, 13.5, 48, "approved", "2026-04-15", 20],
  [10116, "CU-2041", "consumer", 4_500_000, 19.5, 18, "approved", "2026-04-02", 55],
  [10108, "CU-2042", "business", 30_000_000, 15, 36, "approved", "2026-03-18", 34],
];

function customerName(customerId: string): string {
  return customers.find((c) => c.id === customerId)?.name ?? "—";
}

export const loans: Loan[] = seeds.map(
  ([num, customerId, type, amount, interestRate, term, status, appliedAt]) => ({
    id: `LN-${num}`,
    customerId,
    customerName: customerName(customerId),
    type,
    amount,
    interestRate,
    term,
    status,
    appliedAt,
  }),
);

/** Principal repaid so far, keyed by loan id (rounded to ₮1,000). */
export const repaidAmounts = new Map<string, number>(
  seeds.map(([num, , , amount, , , , , repaidPercent]) => [
    `LN-${num}`,
    Math.round((amount * repaidPercent) / 100 / 1000) * 1000,
  ]),
);
