/** The checker's finding id prefixes, longest first, so 'h7-hours-over-' wins over 'hours-over-'. */
const PROBLEM_RULES = [
  'allocation-review', 'cov-gap', 'day-off-for-holiday', 'dayoff-lock', 'doctor-not-in-clinic', 'evening-tail', 'exclusive-nc-doctor-conflict', 'h1-senior', 'h2-days', 'h3-rest',
  'h4-dup', 'h6-phl-capability', 'h7-hours-over', 'h7-period', 'h8-doctor-allocation', 'h8-specialty-allocation', 'h9-week-hours', 'holiday-gap', 'holiday-leave',
  'holiday-no-nurse', 'holiday-senior', 'hours-deferred', 'hours-history-unavailable', 'hours-low', 'hours-over',
  'hours-part-short', 'hours-written-off', 'leave-overlap', 'low-acuity-pair', 'low-acuity-cover', 'low-acuity-float', 'missing-gmail', 'nc-coverage',
  'nc-doctor-conflict', 'nc-not-qualified', 'pending-leave-shift', 'period-gap', 'request-dayoff-shift', 'request-shift',
  'role-quota', 's1-late', 'scale-ratio-warning', 'schedule-overlap', 'session-no-overlap', 'session-overlap', 'session-handover', 'session-partial', 'unassigned-session',
].sort((a, b) => b.length - a.length);

/** Which check a finding came from, e.g. 'cov-gap-2026-10-05-09:00' gives 'cov-gap'. */
export function problemRule(findingId: string): string {
  return PROBLEM_RULES.find((r) => findingId === r || findingId.startsWith(`${r}-`)) || findingId;
}

