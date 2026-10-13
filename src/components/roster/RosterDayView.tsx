import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AvailabilityRequest, Assignment, DoctorSession, LeaveEntry, LockEntry, Nurse, PublicHoliday, SeniorityLevel } from '../../types';
import type { ValidationReport } from '../../services/validation/ScheduleValidator';
import { formatDayDate, localTodayIso } from '../../utils/dateUtils';
import { Notice, PROBLEM_MARKS, ProblemBadge, cx } from '../ui';
import type { CellLookups } from '../workbook/grid/cellView';
import { dayTotalsOf, dayTotalWords } from '../workbook/grid/dayTotals';
import { dayViewOf, firstDayShown } from './dayView';

/**
 * The roster on a phone (UI overhaul Phase 4, slice 5): one day at a time with Previous day and
 * Next day, each nurse's day in words, the day's totals and problems, and a note that changes
 * need a laptop or tablet. Nothing here changes the roster.
 */
export const RosterDayView: React.FC<{
  /** Every day of the roster, in order. */
  dates: string[];
  /** A day named by a link, shown first when it is in the roster. */
  linkedDate?: string;
  nurses: Nurse[];
  assignments: Assignment[];
  leaveEntries: LeaveEntry[];
  locks: LockEntry[];
  availabilityRequests?: AvailabilityRequest[];
  holidays: PublicHoliday[];
  sessions: DoctorSession[];
  seniorityLevels: SeniorityLevel[];
  lookups: CellLookups;
  validationReport: ValidationReport;
}> = (props) => {
  const { dates, nurses, seniorityLevels, validationReport } = props;
  const today = localTodayIso();
  const [chosen, setChosen] = useState(() => firstDayShown(dates, today, props.linkedDate));
  // A later link (or Back and Forward) to another day moves the view there.
  const [lastLink, setLastLink] = useState(props.linkedDate);
  if (props.linkedDate !== lastLink) {
    setLastLink(props.linkedDate);
    if (props.linkedDate && dates.includes(props.linkedDate)) setChosen(props.linkedDate);
  }
  const date = dates.includes(chosen) ? chosen : firstDayShown(dates, today, props.linkedDate);
  const index = dates.indexOf(date);
  const sortedNurses = useMemo(() => [...nurses].sort((a, b) => a.fullName.localeCompare(b.fullName)), [nurses]);
  const day = useMemo(
    () =>
      dayViewOf(date, {
        nurses: sortedNurses,
        assignments: props.assignments,
        leaveEntries: props.leaveEntries,
        locks: props.locks,
        availabilityRequests: props.availabilityRequests,
        holidays: props.holidays,
        lookups: props.lookups,
        findings: validationReport.findings,
        today,
      }),
    [date, sortedNurses, props.assignments, props.leaveEntries, props.locks, props.availabilityRequests, props.holidays, props.lookups, validationReport, today]
  );
  const total = dayTotalsOf([date], props.assignments, props.sessions, nurses, seniorityLevels, validationReport.hourlyCoverageMap).get(date);
  const levelOf = new Map(seniorityLevels.map((s) => [s.id, s.name]));
  const holiday = props.holidays.find((h) => h.date === date);

  if (!date) return null;
  return (
    <section aria-label="The roster, one day at a time" className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-4 text-base text-ink">
      <Notice tone="info" title="To change the roster, open it on a laptop or tablet.">
        On a phone the roster can be read, one day at a time.
      </Notice>

      {/* The day, then Previous day and Next day side by side (on one line each, the date kept whole). */}
      <div className="flex flex-col gap-2">
        <h2 aria-live="polite" className="text-center text-lg font-semibold whitespace-nowrap">
          {formatDayDate(date, 'long')}
          {date === today && <span className="block text-sm font-semibold text-brand-strong">Today</span>}
          {holiday && <span className="block text-sm font-normal text-ink-muted whitespace-normal">Public holiday: {holiday.name}</span>}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setChosen(dates[index - 1])}
            disabled={index <= 0}
            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-md border border-line-strong bg-surface px-3 text-sm font-semibold whitespace-nowrap disabled:opacity-50"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Previous day
          </button>
          <button
            type="button"
            onClick={() => setChosen(dates[index + 1])}
            disabled={index >= dates.length - 1}
            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-md border border-line-strong bg-surface px-3 text-sm font-semibold whitespace-nowrap disabled:opacity-50"
          >
            Next day
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {total && <p className="text-sm text-ink-muted">{dayTotalWords(date, total).replace(/^Day totals, [^:]*: /, 'On this day: ')}.</p>}

      <div>
        <h3 className="mb-2 text-sm font-semibold">Problems on this day</h3>
        {day.problems.length === 0 ? (
          <p className="text-sm text-ink-muted">No problems on this day.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {day.problems.map((p) => (
              <li key={p.id} className="flex flex-col items-start gap-1 rounded-md border border-line bg-surface p-3 text-sm">
                <ProblemBadge kind={p.kind} />
                <span>{p.message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Nurses</h3>
        <ul className="flex flex-col gap-2">
          {day.rows.map((row) => {
            const nurse = nurses.find((n) => n.id === row.nurseId);
            const Icon = row.problemKind === 'none' ? null : PROBLEM_MARKS[row.problemKind].icon;
            return (
              <li
                key={row.nurseId}
                className={cx('rounded-md border border-line bg-surface p-3', row.color && 'border-l-4')}
                style={row.color ? { borderLeftColor: row.color } : undefined}
              >
                <p className="flex items-center gap-2">
                  <span className="font-semibold">{row.name}</span>
                  {nurse && levelOf.get(nurse.seniorityLevelId) && <span className="text-sm text-ink-muted">{levelOf.get(nurse.seniorityLevelId)}</span>}
                  {Icon && (
                    <span className={cx('ml-auto inline-flex items-center gap-1 text-sm font-semibold', PROBLEM_MARKS[row.problemKind as 'must' | 'check'].text)}>
                      <Icon className="size-4" aria-hidden="true" />
                      {PROBLEM_MARKS[row.problemKind as 'must' | 'check'].word}
                    </span>
                  )}
                </p>
                <p className="text-sm text-ink-muted">{row.summary}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
