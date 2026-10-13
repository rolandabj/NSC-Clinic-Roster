import { formatDate } from '../../utils/dateUtils';
import { escapeHtml } from '../../utils/escapeHtml';

/**
 * The email a nurse gets when a planner or manager decides one of their requests (UI overhaul
 * Phase 5, slice 4). The server writes it from the stored request, so nothing in it comes from
 * the browser that asked for it to be sent.
 */

export type DecidedRequest =
  | { kind: 'leave'; leaveTypeName?: string; startDate: string; endDate: string }
  | { kind: 'day'; available: boolean; shiftName?: string; date: string };

export interface DecisionEmailInput {
  request: DecidedRequest;
  status: 'APPROVED' | 'REJECTED';
  nurseName: string;
  reviewerName?: string;
  reviewNote?: string;
  senderName: string;
}

/** One line of plain text: no line breaks (they could add header lines to the subject), at most `max` characters. */
const oneLine = (value: string | undefined, max = 120) => String(value || '').replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

/** "Annual Leave", "day off", "Day shift" or "shift". */
function what(request: DecidedRequest): string {
  if (request.kind === 'leave') return oneLine(request.leaveTypeName, 60) || 'leave';
  if (!request.available) return 'day off';
  const shift = oneLine(request.shiftName, 40);
  return shift ? `${shift} shift` : 'shift';
}

/** "18-11-2026", or "20-11-2026 to 22-11-2026". */
function when(request: DecidedRequest): string {
  if (request.kind === 'day') return formatDate(request.date);
  if (!request.startDate) return '';
  return request.startDate === request.endDate ? formatDate(request.startDate) : `${formatDate(request.startDate)} to ${formatDate(request.endDate)}`;
}

export function decisionEmail(input: DecisionEmailInput): { subject: string; text: string; html: string } {
  const decided = input.status === 'APPROVED' ? 'approved' : 'declined';
  const dates = when(input.request);
  const sentence = `Your ${what(input.request)} request${dates ? ` for ${dates}` : ''} was ${decided}`;
  const reviewer = oneLine(input.reviewerName, 80);
  const firstName = oneLine(input.nurseName, 80).split(' ')[0] || 'there';
  const note = oneLine(input.reviewNote, 500);
  const sender = oneLine(input.senderName, 100) || 'Clinic Roster';

  const lines = [
    `Hello ${firstName},`,
    `${sentence}${reviewer ? ` by ${reviewer}` : ''}.`,
    ...(note ? [`Note from ${reviewer || 'the reviewer'}: ${note}`] : []),
    'You can see all your requests on the My requests page of the Clinic Roster app.',
    sender,
  ];
  const html = `<div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #0f172a; max-width: 560px;">${lines
    .map((line) => `<p style="margin: 0 0 12px;">${escapeHtml(line)}</p>`)
    .join('')}</div>`;
  return { subject: sentence, text: lines.join('\n\n'), html };
}
