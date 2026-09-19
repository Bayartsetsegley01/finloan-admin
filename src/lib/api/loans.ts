import { calculateMonthlyPayment } from "@/lib/finance";
import { customers, upsertCustomer } from "@/lib/mock/customers";
import { MOCK_TODAY, loans, repaidAmounts } from "@/lib/mock/loans";
import type {
  CreateLoanInput,
  Loan,
  LoanActivity,
  LoanDetails,
  LoanQuery,
  Paginated,
} from "@/types/loan";

import { ApiError, simulateRequest } from "./client";

const idNumber = (id: string) => Number(id.replace("LN-", ""));

function matchesQuery(loan: Loan, query: LoanQuery): boolean {
  const search = query.search.trim().toLowerCase();
  if (search) {
    const haystack = `${loan.id} ${loan.customerName} ${loan.customerId}`.toLowerCase();
    if (!haystack.includes(search)) return false;
  }
  if (query.status && loan.status !== query.status) return false;
  if (query.type && loan.type !== query.type) return false;
  if (query.dateRange) {
    const [from, to] = query.dateRange;
    if (loan.appliedAt < from || loan.appliedAt > to) return false;
  }
  return true;
}

/** Newest applications first. */
const byNewest = (a: Loan, b: Loan) =>
  b.appliedAt.localeCompare(a.appliedAt) || idNumber(b.id) - idNumber(a.id);

export function getLoans(query: LoanQuery): Promise<Paginated<Loan>> {
  return simulateRequest(() => {
    const matched = loans.filter((loan) => matchesQuery(loan, query)).sort(byNewest);
    const start = (query.page - 1) * query.pageSize;
    return { items: matched.slice(start, start + query.pageSize), total: matched.length };
  });
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Derives a plausible activity timeline from the loan's current status. */
function buildActivity(loan: Loan): LoanActivity[] {
  const day = loan.appliedAt;
  const step = (type: LoanActivity["type"], at: string): LoanActivity => ({
    id: `${loan.id}-${type}`,
    type,
    at,
  });

  const timeline: LoanActivity[] = [
    step("submitted", `${day}T09:14`),
    step("documentVerified", `${day}T11:02`),
  ];

  switch (loan.status) {
    case "rejected":
      timeline.push(step("rejected", `${day}T15:40`));
      break;
    case "approved":
    case "overdue":
      timeline.push(step("approved", `${day}T14:30`), step("disbursed", `${day}T16:20`));
      if (loan.status === "overdue") {
        const overdueOn = addDays(day, 45);
        timeline.push(step("overdue", `${overdueOn < "2026-09-15" ? overdueOn : "2026-09-15"}T00:05`));
      }
      break;
    case "pending":
      break;
  }

  return timeline;
}

export function getLoanById(id: string): Promise<LoanDetails> {
  return simulateRequest(() => {
    const loan = loans.find((l) => l.id === id);
    if (!loan) throw new ApiError(`Loan ${id} not found`, 404);

    const customer = customers.find((c) => c.id === loan.customerId);
    if (!customer) throw new ApiError(`Customer ${loan.customerId} not found`, 404);

    return {
      ...loan,
      customer,
      monthlyPayment: calculateMonthlyPayment(loan.amount, loan.interestRate, loan.term),
      repaidAmount: repaidAmounts.get(loan.id) ?? 0,
      activity: buildActivity(loan),
    };
  });
}

export function createLoan(input: CreateLoanInput): Promise<Loan> {
  return simulateRequest(() => {
    const customer = upsertCustomer({
      name: input.customerName,
      phone: input.phone,
      email: input.email,
    });

    const nextNumber = loans.reduce((max, l) => Math.max(max, idNumber(l.id)), 0) + 1;
    const loan: Loan = {
      id: `LN-${nextNumber}`,
      customerId: customer.id,
      customerName: customer.name,
      type: input.type,
      amount: input.amount,
      interestRate: input.interestRate,
      term: input.term,
      status: "pending",
      appliedAt: MOCK_TODAY,
      purpose: input.purpose?.trim() || undefined,
    };

    loans.unshift(loan);
    return loan;
  });
}
