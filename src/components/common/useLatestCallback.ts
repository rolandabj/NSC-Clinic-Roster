import { useCallback, useRef } from 'react';

/**
 * A function that stays the same for the life of the component and always calls the newest
 * `fn`. Handlers passed this way do not make a memoized child (such as the roster grid) draw
 * again when its parent draws.
 */
export function useLatestCallback<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback((...args: A) => ref.current(...args), []);
}
