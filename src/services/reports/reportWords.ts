/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Reports in plain words (Phase 8): each hours status as a word in normal case with its tone,
 * the difference as hours ahead or short, the filters of the Hours tab, and
 * the tab the address names (#reports?tab=fairness).
 */

import type { Tone } from '../../components/ui/Badge';
import type { HoursAccountingStatus, NurseHoursAccounting } from './hoursAccounting';

const STATUS_WORDS: Record<HoursAccountingStatus, string> = {
  OPTIMAL: 'On goal',
  UNDER: 'A little short',
  CRITICAL_UNDER: 'Very short',
  OVER: 'A little over',
  CRITICAL_OVER: 'Too many hours',
};

const STATUS_TONES: Record<HoursAccountingStatus, Tone> = {
  OPTIMAL: 'success',
  UNDER: 'warning',
  CRITICAL_UNDER: 'danger',
  OVER: 'info',
  CRITICAL_OVER: 'warning',
};

/**
 * The statuses in the order of the Status filter. A status is judged on the balance, counting
 * the rosters before, so the filter names no share of this roster's goal (Checkpoint 8).
 */
export const STATUS_CHOICES: { id: HoursAccountingStatus; label: string }[] = (
  ['OPTIMAL', 'UNDER', 'CRITICAL_UNDER', 'OVER', 'CRITICAL_OVER'] as HoursAccountingStatus[]
).map((id) => ({ id, label: STATUS_WORDS[id] }));

export function statusWord(status: HoursAccountingStatus | string): string {
  return STATUS_WORDS[status as HoursAccountingStatus] ?? String(status);
}

export function statusTone(status: HoursAccountingStatus | string): Tone {
  return STATUS_TONES[status as HoursAccountingStatus] ?? 'neutral';
}

/** The colour of a Share of goal bar, from the share it shows (the same bands as the statuses). */
export function shareTone(percent: number): Tone {
  if (percent < 75) return 'danger';
  if (percent < 90) return 'warning';
  if (percent <= 110) return 'success';
  if (percent <= 120) return 'info';
  return 'warning';
}

/** "12 h ahead", "8.5 h short" or "Even", to one decimal place. */
export function differenceWords(hours: number): string {
  const rounded = Math.round(hours * 10) / 10;
  if (rounded === 0) return 'Even';
  return `${Math.abs(rounded)} h ${rounded > 0 ? 'ahead' : 'short'}`;
}

export interface ReportFilters {
  search: string;
  status: 'ALL' | HoursAccountingStatus;
  seniority: string;
  contract: 'ALL' | 'FULL' | 'PART';
}

type FilterableRow = Pick<NurseHoursAccounting, 'status' | 'contractPercent'> & {
  nurse: Pick<NurseHoursAccounting['nurse'], 'fullName' | 'employeeCode' | 'seniorityLevelId'>;
};

/** The rows that match every filter: name or staff number, status, seniority and contract. */
export function filterReportRows<T extends FilterableRow>(rows: T[], f: ReportFilters): T[] {
  const q = f.search.trim().toLowerCase();
  return rows.filter(
    (r) =>
      (!q || r.nurse.fullName.toLowerCase().includes(q) || (r.nurse.employeeCode || '').toLowerCase().includes(q)) &&
      (f.status === 'ALL' || r.status === f.status) &&
      (f.seniority === 'ALL' || r.nurse.seniorityLevelId === f.seniority) &&
      (f.contract === 'ALL' || (f.contract === 'FULL' ? r.contractPercent >= 100 : r.contractPercent < 100))
  );
}

export type ReportTab = 'hours' | 'fairness' | 'leave';

export const REPORT_TABS: { id: ReportTab; label: string }[] = [
  { id: 'hours', label: 'Hours' },
  { id: 'fairness', label: 'Fairness' },
  { id: 'leave', label: 'Leave allowance' },
];

/** The tab the address names; anything else opens Hours. */
export function reportTab(tab: string | undefined): ReportTab {
  return REPORT_TABS.some((t) => t.id === tab) ? (tab as ReportTab) : 'hours';
}

/** A bar's length as a share of the longest, from 0 to 100. */
export function barShare(value: number, longest: number): number {
  if (!(longest > 0) || !(value > 0)) return 0;
  return Math.min(100, Math.round((value / longest) * 100));
}
