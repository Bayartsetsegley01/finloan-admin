"use client";

import { useCallback, useEffect, useState } from "react";

type Settled<T> =
  | { fetcher: () => Promise<T>; attempt: number; status: "success"; data: T }
  | { fetcher: () => Promise<T>; attempt: number; status: "error"; error: Error };

export interface AsyncState<T> {
  /** Latest successful result — kept while a refetch is in flight (stale-while-revalidate). */
  data: T | undefined;
  error: Error | undefined;
  /** True whenever a request for the current inputs is in flight. */
  isLoading: boolean;
  /** True only when there is nothing to show yet. */
  isInitialLoading: boolean;
  reload: () => void;
}

const toError = (value: unknown): Error =>
  value instanceof Error ? value : new Error("Unknown error");

/**
 * Minimal data-fetching hook.
 *
 * `fetcher` MUST be referentially stable (wrap it in useCallback / useMemo) —
 * a new function identity means "new request". State is derived rather than
 * synchronised, so there are no cascading renders and no race conditions:
 * results that belong to an outdated fetcher are simply ignored.
 */
export function useAsync<T>(fetcher: () => Promise<T>): AsyncState<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    let active = true;
    fetcher().then(
      (data) => active && setSettled({ fetcher, attempt, status: "success", data }),
      (error: unknown) =>
        active && setSettled({ fetcher, attempt, status: "error", error: toError(error) }),
    );
    return () => {
      active = false;
    };
  }, [fetcher, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  const isCurrent = settled?.fetcher === fetcher && settled.attempt === attempt;
  const data = settled?.status === "success" ? settled.data : undefined;
  const error = isCurrent && settled?.status === "error" ? settled.error : undefined;

  return {
    data: error ? undefined : data,
    error,
    isLoading: !isCurrent,
    isInitialLoading: !isCurrent && data === undefined,
    reload,
  };
}
