/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Firestore Quota & Limit Tracker
 * Monitors and broadcasts Firestore free-tier quota exhaustion state to prevent
 * infinite background retry loops and inform users gracefully.
 */

type QuotaListener = (isExceeded: boolean, details: string | null) => void;

class QuotaTracker {
  private static instance: QuotaTracker;
  private isExceeded: boolean = false;
  private quotaMessage: string | null = null;
  private listeners: Set<QuotaListener> = new Set();

  private constructor() {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('clinic_firestore_quota_exceeded');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Quotas reset daily at midnight Pacific Time; keep flag for active session
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            this.isExceeded = true;
            this.quotaMessage = parsed.message || 'Firestore daily write quota reached.';
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
    return this.isExceeded;
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
      this.quotaMessage =
        'Firestore free daily write quota has been reached for today. The application remains fully readable and operational in read-only mode. Writes will resume tomorrow when Google Cloud resets the daily quota.';
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'clinic_firestore_quota_exceeded',
          JSON.stringify({
            timestamp: Date.now(),
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
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('clinic_firestore_quota_exceeded');
    }
    this.listeners.forEach((listener) => listener(false, null));
  }
}

export const quotaTracker = QuotaTracker.getInstance();
