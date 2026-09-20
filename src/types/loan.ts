import type { Customer } from "./customer";

export const LOAN_STATUSES = ["pending", "approved", "rejected", "overdue"] as const;
export type LoanStatus = (typeof LOAN_STATUSES)[number];

export const LOAN_TYPES = ["consumer", "mortgage", "auto", "business", "education"] as const;
export type LoanType = (typeof LOAN_TYPES)[number];

export interface Loan {
  id: string;
  customerId: string;
  customerName: string;
  type: LoanType;
  /** Principal in MNT (₮). */
  amount: number;
  /** Annual interest rate, percent. */
  interestRate: number;
  /** Term in months. */
  term: number;
  status: LoanStatus;
  /** ISO date (YYYY-MM-DD). */
  appliedAt: string;
  purpose?: string;
}

export const ACTIVITY_TYPES = [
  "submitted",
  "documentVerified",
  "approved",
  "rejected",
  "disbursed",
  "overdue",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface LoanActivity {
  id: string;
  type: ActivityType;
  /** ISO datetime. */
  at: string;
}

export interface LoanDetails extends Loan {
  customer: Customer;
  monthlyPayment: number;
  repaidAmount: number;
  activity: LoanActivity[];
}

export interface LoanFilters {
  search: string;
  status?: LoanStatus;
  type?: LoanType;
  /** Inclusive ISO date range. */
  dateRange?: [string, string];
}

export interface LoanQuery extends LoanFilters {
  page: number;
  pageSize: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
}

export const AMORTIZATION_METHODS = ["annuity", "equalPrincipal"] as const;
export type AmortizationMethod = (typeof AMORTIZATION_METHODS)[number];

/** One row of an amortization (repayment) schedule. Amounts are whole MNT (₮). */
export interface ScheduleRow {
  /** 1-based payment number. */
  index: number;
  /** ISO date (YYYY-MM-DD) the payment is due. */
  dueDate: string;
  openingBalance: number;
  principal: number;
  interest: number;
  /** principal + interest. */
  total: number;
  closingBalance: number;
}

export interface CreateLoanInput {
  customerName: string;
  phone: string;
  email: string;
  type: LoanType;
  amount: number;
  interestRate: number;
  term: number;
  purpose?: string;
}
