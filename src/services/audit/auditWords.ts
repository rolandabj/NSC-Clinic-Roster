/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The audit trail in plain words (Phase 8): each action and kind of record by name, what a
 * change did field by field (for the "What changed" dialog), and the search and filter over
 * the records loaded so far.
 */

import type { AuditAction, AuditEvent } from '../../types';
import { formatDate, formatDateTime } from '../../utils/dateUtils';

const ACTION_WORDS: Record<AuditAction, string> = {
  CREATE: 'Added',
  UPDATE: 'Changed',
  DELETE: 'Deleted',
  RESTORE: 'Restored',
  LOCK: 'Pinned a day',
  OVERRIDE_LOCK: 'Changed a pinned day',
  PUBLISH: 'Published',
  SWAP: 'Swapped shifts',
  TEMPLATE_APPLY: 'Template applied',
  REBALANCE: 'Fairness moves',
};

/** The actions in the order of the filter. */
export const AUDIT_ACTIONS = Object.keys(ACTION_WORDS) as AuditAction[];

const ENTITY_WORDS: Record<string, string> = {
  Schedule: 'Roster',
  Assignment: 'Shift',
  LockEntry: 'Pinned day',
  AvailabilityRequest: 'Request',
  LeaveEntry: 'Leave',
  ScheduleVersion: 'Roster version',
};

export function actionWord(action: AuditAction | string): string {
  return ACTION_WORDS[action as AuditAction] ?? String(action);
}

/** A kind of record by name; one not listed is split into words ("SomethingNew" is "Something new"). */
export function entityWord(entity: string): string {
  if (ENTITY_WORDS[entity]) return ENTITY_WORDS[entity];
  const words = entity.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** A stored value as words: dates as DD-MM-YYYY (with the time for a moment), true and false as Yes and No. */
export function valueWords(value: unknown): string {
  if (value === undefined || value === null) return 'Not set';
  if (value === '') return 'Empty';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return formatDate(value);
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) return formatDateTime(value);
    return value;
  }
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value) && value.every((v) => typeof v !== 'object' || v === null)) return value.map(valueWords).join(', ');
  return JSON.stringify(value);
}

export interface FieldChange {
  field: string;
  before: string;
  after: string;
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** The fields whose value differs between before and after, in name order. */
export function changedFields(before: unknown, after: unknown): FieldChange[] {
  if (before === undefined && after === undefined) return [];
  if ((before !== undefined && !isRecord(before)) || (after !== undefined && !isRecord(after))) {
    return JSON.stringify(before) === JSON.stringify(after) ? [] : [{ field: 'Value', before: valueWords(before), after: valueWords(after) }];
  }
  const b = (before ?? {}) as Record<string, unknown>;
  const a = (after ?? {}) as Record<string, unknown>;
  return [...new Set([...Object.keys(b), ...Object.keys(a)])]
    .sort((x, y) => x.localeCompare(y))
    .filter((k) => JSON.stringify(b[k]) !== JSON.stringify(a[k]))
    .map((k) => ({ field: k, before: valueWords(b[k]), after: valueWords(a[k]) }));
}

export interface AuditFilters {
  action: 'ALL' | AuditAction;
  search: string;
}

/** The records that match the action and the search (who, the kind of record in either name, the note). */
export function filterAudit(events: AuditEvent[], f: AuditFilters): AuditEvent[] {
  const q = f.search.trim().toLowerCase();
  return events.filter(
    (ev) =>
      (f.action === 'ALL' || ev.action === f.action) &&
      (!q || [ev.actor, ev.entity, entityWord(ev.entity), ev.note || '', actionWord(ev.action)].some((t) => t.toLowerCase().includes(q)))
  );
}
