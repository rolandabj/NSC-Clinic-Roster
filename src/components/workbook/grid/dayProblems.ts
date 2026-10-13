import type { ValidationFinding } from '../../../services/validation/ScheduleValidator';

/**
 * Problems about a whole day (not one nurse's shift): no free nurse, no senior nurse, a doctor's
 * session without a nurse... The grid shows them on the day's heading and the phone's day view
 * lists them for the day, not on each nurse they name.
 */
const DAY_PROBLEM_IDS = /^(cov-gap-|h1-senior-|evening-tail-|holiday-|nc-coverage-|role-quota-|session-partial-|unassigned-session-)/;
export const isDayProblem = (f: ValidationFinding) => DAY_PROBLEM_IDS.test(f.id);
