import type { Loan } from "@/types/loan";

/** Blank rows that give tables their shape while data loads (rendered as skeletons). */
export function createPlaceholderLoans(count: number): Loan[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `placeholder-${index}`,
    customerId: "",
    customerName: "",
    type: "consumer",
    amount: 0,
    interestRate: 0,
    term: 0,
    status: "pending",
    appliedAt: "",
  }));
}
