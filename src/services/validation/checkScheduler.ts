/**
 * Runs the roster check once for a burst of requests, later instead of at once.
 *
 * Opening a full size roster asked for the check four times in a row (about 60 ms each),
 * and every edit asked for it again. The screen asks with `request`; the check runs once
 * `later` calls back, with the newest request only. `cancel` drops a waiting check (another
 * roster opened, or a fill showed its own result) and `flush` runs it at once.
 */
export interface CheckScheduler<R> {
  request(req: R): void;
  cancel(): void;
  flush(): void;
  /** A check is waiting to run. */
  readonly waiting: boolean;
}

export function createCheckScheduler<R>(options: {
  /** Calls `fn` later; returns a function that cancels the call. */
  later: (fn: () => void) => () => void;
  run: (req: R) => void;
}): CheckScheduler<R> {
  let pending: { req: R } | null = null;
  let stop: (() => void) | null = null;

  const cancel = () => {
    pending = null;
    stop?.();
    stop = null;
  };
  const flush = () => {
    const p = pending;
    cancel();
    if (p) options.run(p.req);
  };

  return {
    request(req) {
      pending = { req };
      if (!stop) stop = options.later(flush);
    },
    cancel,
    flush,
    get waiting() {
      return pending !== null;
    },
  };
}

/**
 * After the next frame is drawn and finished (a timer tick later), so a new roster's cells
 * show first, or within 100 ms
 * when the tab is hidden and draws no frames.
 */
export function afterNextFrame(fn: () => void): () => void {
  let done = false;
  let inner: ReturnType<typeof setTimeout> | undefined;
  const once = () => {
    if (done) return;
    done = true;
    fn();
  };
  const frame = requestAnimationFrame(() => {
    inner = setTimeout(once, 0);
  });
  const fallback = setTimeout(once, 100);
  return () => {
    done = true;
    cancelAnimationFrame(frame);
    clearTimeout(fallback);
    if (inner) clearTimeout(inner);
  };
}
