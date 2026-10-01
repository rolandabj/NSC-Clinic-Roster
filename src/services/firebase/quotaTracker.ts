/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Firestore Quota & Limit Tracker
 * Monitors and broadcasts Firestore free-tier quota exhaustion state to prevent
 * infinite background retry loops and inform users gracefully.
 */

type QuotaListener = (isExceeded: boolean, details: string | null) => void;

/** Thrown instead of silently skipping a write while the daily quota is used up. */
export class QuotaExceededError extends Error {
  constructor(message?: string) {
    super(
      message ||
        'Not saved: the Firestore daily quota is used up. Your change is kept on this screen and will be saved when you retry after the quota resets (midnight Pacific time).'
    );
    this.name = 'QuotaExceededError';
  }
}

/**
 * Firestore daily quotas reset at midnight Pacific time. Returns that moment
 * (as epoch milliseconds) for the next reset after `now`.
 */
export function nextQuotaResetMs(now: number = Date.now()): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(now));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value || 0);
  // Pacific wall clock time now, read as if it were UTC
  const pacificNowAsUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  const offset = pacificNowAsUtc - now;
  const nextPacificMidnightAsUtc = Date.UTC(get('year'), get('month') - 1, get('day') + 1, 0, 0, 0);
  return nextPacificMidnightAsUtc - offset;
}

class QuotaTracker {
  private static instance: QuotaTracker;
  private isExceeded: boolean = false;
  private quotaMessage: string | null = null;
  private resetsAt: number = 0;
  private listeners: Set<QuotaListener> = new Set();

  private constructor() {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('clinic_firestore_quota_exceeded');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Quotas reset daily at midnight Pacific time; keep the flag only until then
          const resetsAt = parsed.resetsAt || nextQuotaResetMs(parsed.timestamp || 0);
          if (Date.now() < resetsAt) {
            this.isExceeded = true;
            this.resetsAt = resetsAt;
            this.quotaMessage = parsed.message || 'Firestore daily write quota reached.';
          } else {
            sessionStorage.removeItem('clinic_firestore_quota_exceeded');
          }
        } catch {
          // ignore parsing error
        }
      }
    }
  }

  public static getInstance(): QuotaTracker {
    if (!QuotaTracker.instance) {
      QuotaTracker.instance = new QuotaTracker();
    }
    return QuotaTracker.instance;
  }

  public isQuotaExceeded(): boolean {
    if (this.isExceeded && this.resetsAt && Date.now() >= this.resetsAt) {
      // The daily quota has reset since the limit was hit.
      this.reset();
    }
    return this.isExceeded;
  }

  /** Throws QuotaExceededError when writes are paused, so callers can tell the user. */
  public assertWritable(): void {
    if (this.isQuotaExceeded()) {
      throw new QuotaExceededError();
    }
  }

  public getQuotaMessage(): string | null {
    return this.quotaMessage;
  }

  public notifyQuotaExceeded(error: unknown): void {
    const errorStr = error instanceof Error ? error.message : String(error);
    const isExhausted =
      errorStr.includes('resource-exhausted') ||
      errorStr.includes('Quota limit exceeded') ||
      errorStr.includes('Quota exceeded') ||
      (error as any)?.code === 'resource-exhausted';

    if (isExhausted && !this.isExceeded) {
      this.isExceeded = true;
      this.resetsAt = nextQuotaResetMs();
      this.quotaMessage =
        'Firestore free daily write quota has been reached for today. The application remains fully readable and operational in read-only mode. Writes will resume tomorrow when Google Cloud resets the daily quota.';
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'clinic_firestore_quota_exceeded',
          JSON.stringify({
            timestamp: Date.now(),
            resetsAt: this.resetsAt,
            message: this.quotaMessage,
          })
        );
      }

      this.listeners.forEach((listener) => listener(this.isExceeded, this.quotaMessage));
    }
  }

  public subscribe(listener: QuotaListener): () => void {
    this.listeners.add(listener);
    listener(this.isExceeded, this.quotaMessage);
    return () => this.listeners.delete(listener);
  }

  public reset(): void {
    this.isExceeded = false;
    this.quotaMessage = null;
    this.resetsAt = 0;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('clinic_firestore_quota_exceeded');
    }
    this.listeners.forEach((listener) => listener(false, null));
  }
}

export const quotaTracker = QuotaTracker.getInstance();
