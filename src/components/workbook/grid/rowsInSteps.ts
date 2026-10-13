import { useEffect, useState } from 'react';

/** Rows drawn in each step. */
export const ROW_STEP = 20;

/** How many rows to draw after the next step. */
export function nextRowLimit(limit: number, total: number, step = ROW_STEP): number {
  return Math.min(total, limit + step);
}

/**
 * The grid's rows drawn in steps (UI overhaul Phase 4, slice 4): the first `ROW_STEP` rows at
 * once, then one more step after each frame, so loading a full size roster (60 nurses by 31 days)
 * is not one long task of the browser's styles and layout. A new roster (`resetKey`) starts again.
 */
export function useRowsInSteps(total: number, resetKey: string): number {
  const [state, setState] = useState({ key: resetKey, limit: ROW_STEP });
  // A new roster starts again from the first step (set while drawing, as React allows).
  if (state.key !== resetKey) setState({ key: resetKey, limit: ROW_STEP });
  const limit = state.key === resetKey ? state.limit : ROW_STEP;
  useEffect(() => {
    if (limit >= total) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // After the frame with the rows so far is on screen, the next step.
    const frame = requestAnimationFrame(() => {
      timer = setTimeout(() => setState((s) => ({ ...s, limit: nextRowLimit(s.limit, total) })), 0);
    });
    return () => {
      cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
    };
  }, [limit, total]);
  return Math.min(limit, total);
}
