/**
 * Tiny transport layer for the mock API.
 * Every service function goes through `simulateRequest`, so the UI experiences
 * realistic latency — and can be switched into a failing state to demo error handling.
 */

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const LATENCY_RANGE_MS = [450, 900] as const;

let shouldFail = false;

export function setSimulateFailure(value: boolean): void {
  shouldFail = value;
}

export function getSimulateFailure(): boolean {
  return shouldFail;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function simulateRequest<T>(handler: () => T): Promise<T> {
  const [min, max] = LATENCY_RANGE_MS;
  await sleep(min + Math.random() * (max - min));

  if (shouldFail) {
    throw new ApiError("Service temporarily unavailable", 503);
  }

  // Clone so callers can never mutate the in-memory "database" by accident.
  return structuredClone(handler());
}
