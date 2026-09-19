import type { LoanStatus } from "@/types/loan";

/** Business rules shared by the loan form and (in a real app) the API. */
export const MIN_LOAN_AMOUNT = 100_000;
export const MAX_LOAN_AMOUNT = 1_000_000_000;
export const MAX_INTEREST_RATE = 60;

/** Term options in months. */
export const TERM_OPTIONS = [6, 12, 18, 24, 36, 48, 60, 120, 240] as const;

/** Mongolian mobile/landline numbers: optional +976, 8 digits, first digit 6–9. */
export const PHONE_PATTERN = /^(\+976[\s-]?)?[6-9]\d{3}[\s-]?\d{4}$/;

export const PAGE_SIZE = 10;

export const STATUS_TONE = {
  pending: "warning",
  approved: "success",
  rejected: "neutral",
  overdue: "danger",
} as const satisfies Record<LoanStatus, string>;
