import type { AmortizationMethod, ScheduleRow } from "@/types/loan";

/** Annuity (equal monthly installment) payment, rounded to the nearest ₮100. */
export function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
): number {
  if (termMonths <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  const payment =
    monthlyRate === 0
      ? principal / termMonths
      : (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -termMonths);
  return Math.round(payment / 100) * 100;
}

/** Adds `months` to an ISO date (YYYY-MM-DD), returning an ISO date. UTC-based, so it's DST-safe. */
function addMonthsIso(isoDate: string, months: number): string {
  const date = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
}

export interface GenerateAmortizationScheduleInput {
  /** Principal in MNT (₮). */
  amount: number;
  /** Annual interest rate, percent. */
  annualRate: number;
  termMonths: number;
  /** ISO date (YYYY-MM-DD) the loan is disbursed; the first installment is due one month later. */
  startDate: string;
  method: AmortizationMethod;
}

/**
 * Builds a full repayment schedule.
 *
 * - Monthly rate = annualRate / 100 / 12.
 * - "annuity": every installment (principal + interest) is equal; the formula is the
 *   standard amortization payment `P × r / (1 − (1 + r)^−n)`.
 * - "equalPrincipal": principal is split evenly across installments, so interest (and
 *   therefore the total payment) declines each month as the balance shrinks.
 * - All amounts are rounded to the nearest ₮ as they're generated. Rounding drift is
 *   absorbed into the last row's principal so the schedule always closes to exactly 0,
 *   and the sum of principal across rows always equals `amount`.
 */
export function generateAmortizationSchedule({
  amount,
  annualRate,
  termMonths,
  startDate,
  method,
}: GenerateAmortizationScheduleInput): ScheduleRow[] {
  if (amount <= 0 || termMonths <= 0) return [];

  const monthlyRate = annualRate / 100 / 12;
  const equalInstallment =
    monthlyRate === 0
      ? amount / termMonths
      : (amount * monthlyRate) / (1 - (1 + monthlyRate) ** -termMonths);
  const equalPrincipalShare = amount / termMonths;

  const rows: ScheduleRow[] = [];
  let balance = amount;

  for (let index = 1; index <= termMonths; index += 1) {
    const openingBalance = balance;
    const interest = Math.round(openingBalance * monthlyRate);

    let principal: number;
    let total: number;
    if (method === "annuity") {
      total = Math.round(equalInstallment);
      principal = total - interest;
    } else {
      principal = Math.round(equalPrincipalShare);
      total = principal + interest;
    }

    let closingBalance = openingBalance - principal;
    const isLastRow = index === termMonths;
    if (isLastRow) {
      // Absorb rounding drift into the final installment so the balance closes to exactly 0.
      principal += closingBalance;
      closingBalance = 0;
      total = principal + interest;
    }

    rows.push({
      index,
      dueDate: addMonthsIso(startDate, index),
      openingBalance,
      principal,
      interest,
      total,
      closingBalance,
    });

    balance = closingBalance;
  }

  return rows;
}
