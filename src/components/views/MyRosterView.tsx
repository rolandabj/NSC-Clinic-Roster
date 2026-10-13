/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * A nurse's private page, opened from their own link (#me?t=TOKEN) without
 * signing in. It reads one document, nurseRosters/{token}, containing personal
 * calendar data and cleaned published team sheets. Older pages keep their list view.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { CalendarPlus, CalendarRange, Rss, Copy, Check, AlertTriangle, Loader2, ChevronDown } from 'lucide-react';
import type { NurseRosterDoc, NurseRosterShift } from '../../types';
import { PublishedRosterSheet } from '../roster/PublishedRosterSheet';
import { Button, Notice, cx } from '../ui';
import { formatDateTime, formatDayDate } from '../../utils/dateUtils';
import { myShiftDays, type MyDay } from '../../services/publish/myShifts';
import { getRepository } from '../../services/repository';
import { buildNurseRosterIcs, downloadIcsFile } from '../../services/export/icsExportService';
import {
  NURSE_TOKEN_PATTERN,
  formatRosterAsText,
  nurseCalendarUrl,
  nurseWebcalUrl,
  todayIso,
  weekdayOf,
} from '../../services/publish/nurseRosterService';

interface MyRosterViewProps {
  token: string;
}

type LoadState = { kind: 'loading' } | { kind: 'gone' } | { kind: 'error' } | { kind: 'ready'; doc: NurseRosterDoc };

export const MyRosterView: React.FC<MyRosterViewProps> = ({ token }) => {
  const [state, setState] = useState<LoadState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [showEarlier, setShowEarlier] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [status, setStatus] = useState('');
  const [scheduleId, setScheduleId] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (!NURSE_TOKEN_PATTERN.test(token)) {
      setState({ kind: 'gone' });
      return;
    }
    setState({ kind: 'loading' });
    getRepository()
      .get('nurseRosters', token)
      .then((doc) => {
        if (cancelled) return;
        setState(doc && !doc.revoked ? { kind: 'ready', doc } : { kind: 'gone' });
      })
      .catch((err: any) => {
        if (cancelled) return;
        // The rules refuse a revoked or unknown link; anything else is most likely the connection.
        setState(err?.code === 'permission-denied' || err?.code === 'not-found' ? { kind: 'gone' } : { kind: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, [token, attempt]);

  useEffect(() => {
    if (state.kind === 'ready') document.title = `${state.doc.nurseName} shifts`;
  }, [state]);

  const doc = state.kind === 'ready' ? state.doc : null;
  const today = doc ? todayIso(doc.timezone) : '';
  const sheets = doc?.teamRosters || [];
  const sheet = sheets.find(s => s.scheduleId === scheduleId) || sheets.find(s => s.endDate >= today) || sheets.at(-1);

  const mine = useMemo(() => (doc ? myShiftDays(doc, today) : { comingUp: [], earlier: [] }), [doc, today]);

  const copy = async (text: string, done: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(done);
    } catch {
      setStatus("Couldn't copy. Press and hold the text to copy it instead.");
    }
    setTimeout(() => setStatus(''), 4000);
  };

  if (state.kind === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 p-4" role="status">
        <Loader2 className="w-7 h-7 animate-spin text-indigo-600" aria-hidden="true" />
        <p className="text-sm text-slate-600">Opening your shifts…</p>
      </div>
    );
  }

  if (state.kind === 'gone' || state.kind === 'error') {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3 text-center">
          <AlertTriangle className="w-9 h-9 text-amber-500 mx-auto" aria-hidden="true" />
          {state.kind === 'gone' ? (
            <>
              <h1 className="text-base font-bold text-slate-900">This link no longer works.</h1>
              <p className="text-sm text-slate-600">Ask your planner for a new one.</p>
            </>
          ) : (
            <>
              <h1 className="text-base font-bold text-slate-900">Your shifts couldn't be loaded.</h1>
              <p className="text-sm text-slate-600">Check your internet connection and try again.</p>
              <button
                type="button"
                onClick={() => setAttempt((n) => n + 1)}
                className="min-h-11 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm cursor-pointer"
              >
                Try again
              </button>
            </>
          )}
        </div>
      </main>
    );
  }

  const firstName = state.doc.nurseName.trim().split(/\s+/)[0] || state.doc.nurseName;
  const feedUrl = nurseCalendarUrl(token);
  const hasShifts = (state.doc.shifts || []).length > 0;
  const addToCalendar = () => {
    downloadIcsFile(`${state.doc.nurseName} shifts.ics`, buildNurseRosterIcs(state.doc));
    setStatus('Calendar file saved. Open it to add your shifts.');
    setTimeout(() => setStatus(''), 4000);
  };
  const shiftLine = (s: NurseRosterShift) => `${s.startTime} to ${s.endTime}, ${s.shiftName} shift`;

  /** One day as a card: the weekday and the day's number large on the left, then the shifts or the leave. */
  const DayCard: React.FC<{ day: MyDay; muted?: boolean }> = ({ day, muted }) => {
    const isToday = day.date === today;
    return (
      <li
        aria-current={isToday ? 'date' : undefined}
        className={cx('flex items-center gap-4 rounded-lg border bg-surface px-4 py-3 shadow-card', isToday ? 'border-brand' : 'border-line', muted && 'opacity-70')}
      >
        <div aria-hidden="true" className="w-12 shrink-0 text-center">
          <p className="text-sm font-semibold text-ink-muted">{weekdayOf(day.date)}</p>
          <p className="text-2xl leading-none font-semibold text-ink tabular-nums">{Number(day.date.slice(8, 10))}</p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="sr-only">
            {formatDayDate(day.date, 'long')}
            {isToday ? ', today' : ''}
          </p>
          {day.shifts.map((s, i) => (
            <div key={i}>
              <p className="font-semibold text-ink">{shiftLine(s)}</p>
              {s.detail && <p className="text-ink-muted">{s.detail}</p>}
            </div>
          ))}
          {day.leave && <p className="font-semibold text-ink">Leave</p>}
          <p aria-hidden="true" className="text-sm text-ink-muted">
            {formatDayDate(day.date, 'long')}
            {isToday ? ' (today)' : ''}
          </p>
        </div>
      </li>
    );
  };

  return (
    <div className="min-h-dvh bg-canvas text-base text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-xl items-center gap-2.5 px-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand text-white">
            <CalendarRange aria-hidden="true" className="size-5" />
          </span>
          <p className="min-w-0 flex-1 truncate font-bold">NSC Clinic Roster</p>
          {state.doc.clinicName && <p className="truncate text-sm text-ink-muted">{state.doc.clinicName}</p>}
        </div>
      </header>

      <main className="mx-auto max-w-xl space-y-6 px-4 py-5">
        <div>
          <h1 className="text-2xl font-semibold">{firstName}'s shifts</h1>
          <p className="mt-1 text-ink-muted">Your published shifts{sheet ? ' and the team schedule' : ''}.</p>
        </div>

        <Notice tone="info" title="Keep this link within the clinic.">
          Anyone with it can see your shifts{sheet ? ' and the published team schedule' : ''}.
        </Notice>

        {/* The next shift first, with the main action. */}
        <section aria-labelledby="next-shift" className="rounded-xl border border-brand/30 bg-brand-soft p-4">
          <h2 id="next-shift" className="text-sm font-semibold text-brand-strong">
            Next shift
          </h2>
          {mine.next ? (
            <>
              <p className="mt-1 text-xl font-semibold">
                {formatDayDate(mine.next.date, 'long')}
                {mine.next.date === today ? ' (today)' : ''}
              </p>
              {mine.next.shifts.map((s, i) => (
                <div key={i}>
                  <p>{shiftLine(s)}</p>
                  {s.detail && <p className="text-ink-muted">{s.detail}</p>}
                </div>
              ))}
            </>
          ) : (
            <p className="mt-1">No upcoming shifts yet. They show here once your planner publishes the roster.</p>
          )}
          {hasShifts && (
            <Button variant="primary" size="lg" icon={CalendarPlus} onClick={addToCalendar} className="mt-3 w-full sm:w-auto">
              Add to my calendar
            </Button>
          )}
        </section>

        {mine.comingUp.length > 0 && (
          <section aria-labelledby="coming-up">
            <h2 id="coming-up" className="mb-2 text-lg font-semibold">
              Coming up
            </h2>
            <ul className="space-y-2">
              {mine.comingUp.map((day) => (
                <DayCard key={day.date} day={day} />
              ))}
            </ul>
          </section>
        )}

        {mine.earlier.length > 0 && (
          <section aria-label="Earlier shifts">
            <Button
              variant="ghost"
              size="lg"
              icon={ChevronDown}
              onClick={() => setShowEarlier((v) => !v)}
              aria-expanded={showEarlier}
              className={cx('px-2', showEarlier && '[&>svg]:rotate-180')}
            >
              {showEarlier ? 'Hide earlier shifts' : `Show earlier shifts (${mine.earlier.length} ${mine.earlier.length === 1 ? 'day' : 'days'})`}
            </Button>
            {showEarlier && (
              <ul className="mt-2 space-y-2">
                {mine.earlier.map((day) => (
                  <DayCard key={day.date} day={day} muted />
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Other ways to keep the shifts. */}
        <section aria-labelledby="keep-shifts" className="space-y-2">
          <h2 id="keep-shifts" className="text-lg font-semibold">
            Keep your shifts
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button size="lg" icon={Rss} onClick={() => setShowSubscribe((v) => !v)} aria-expanded={showSubscribe} aria-controls="subscribe-help">
              Subscribe in your calendar
            </Button>
            <Button size="lg" icon={Copy} onClick={() => copy(formatRosterAsText(state.doc, today), 'Shifts copied. You can paste them in WhatsApp.')}>
              Copy as text
            </Button>
          </div>
          {showSubscribe && (
            <div id="subscribe-help" className="space-y-3 rounded-lg border border-line bg-surface p-4">
              <p>Subscribing keeps your calendar up to date by itself when the roster changes. Your calendar app checks for changes every few hours.</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <a
                  href={nurseWebcalUrl(token)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-brand px-5 font-semibold text-white hover:bg-brand-strong"
                >
                  Open in my calendar app
                </a>
                <Button size="lg" icon={Copy} onClick={() => copy(feedUrl, 'Calendar link copied.')}>
                  Copy calendar link
                </Button>
              </div>
              <p className="select-all rounded bg-sunken px-2 py-1.5 font-mono text-sm break-all">{feedUrl}</p>
              <p>
                <strong>iPhone:</strong> tap Open in my calendar app, then Subscribe. Or go to Settings, Calendar, Accounts, Add Account, Other, Add
                Subscribed Calendar, and paste the calendar link.
              </p>
              <p>
                <strong>Android (Google Calendar):</strong> on a computer, open calendar.google.com, press the plus next to Other calendars, choose From
                URL and paste the calendar link. It then shows on your phone too.
              </p>
            </div>
          )}
        </section>

        <p className="sr-only" role="status" aria-live="polite">
          {status}
        </p>
        {status && (
          <p className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-success-soft px-3 py-2 text-success" aria-hidden="true">
            <Check className="size-4" />
            {status}
          </p>
        )}
      </main>

      {/* The team schedule keeps its grid, which scrolls sideways on a phone. */}
      <section aria-labelledby="team-schedule" className="mx-auto max-w-[1600px] space-y-4 px-4 pb-6 sm:px-6">
        <h2 id="team-schedule" className="mx-auto max-w-xl text-lg font-semibold sm:max-w-none">
          Team schedule
        </h2>
        {sheet ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-3 font-semibold">
                Published roster
                <select
                  value={sheet.scheduleId}
                  onChange={(e) => setScheduleId(e.target.value)}
                  className="min-h-11 rounded-md border border-line-strong bg-surface px-3 font-normal"
                >
                  {sheets.map((s) => (
                    <option key={s.scheduleId} value={s.scheduleId}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <Button variant="ghost" size="lg" onClick={() => setAttempt((n) => n + 1)}>
                Refresh
              </Button>
            </div>
            <PublishedRosterSheet key={sheet.scheduleId} sheet={sheet} clinicName={state.doc.clinicName} timezone={state.doc.timezone} myNurseId={state.doc.nurseId} />
          </>
        ) : (
          <p className="mx-auto max-w-xl rounded-lg border border-line bg-surface p-3 text-ink-muted">
            The team schedule will appear after your planner publishes again or selects Update all pages in Publish, Private links.
          </p>
        )}
      </section>

      <footer className="mx-auto max-w-xl px-4 pb-8 text-sm text-ink-muted">
        {!Number.isNaN(Date.parse(state.doc.updatedAt)) && <>Updated {formatDateTime(state.doc.updatedAt)}. </>}
        Questions about a shift? Ask your planner.
      </footer>
    </div>
  );
};
