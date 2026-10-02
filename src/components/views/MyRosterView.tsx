/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * A nurse's private page, opened from her own link (#me?t=TOKEN) without
 * signing in. It reads one document, nurseRosters/{token}, which holds only her
 * published shifts and leave days. Made for phones first.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { CalendarPlus, Rss, Copy, Check, Lock, AlertTriangle, Loader2, ChevronDown } from 'lucide-react';
import type { NurseRosterDoc, NurseRosterShift } from '../../types';
import { getRepository } from '../../services/repository';
import { buildNurseRosterIcs, downloadIcsFile } from '../../services/export/icsExportService';
import {
  NURSE_TOKEN_PATTERN,
  addDaysIso,
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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 'YYYY-MM-DD' as '1 Dec'. */
function shortDate(date: string): string {
  const [, m, d] = date.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

/** Monday of the week the date falls in. */
function mondayOf(date: string): string {
  const idx = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(weekdayOf(date));
  return addDaysIso(date, -idx);
}

interface DayEntry {
  date: string;
  shifts: NurseRosterShift[];
  leave: boolean;
}

export const MyRosterView: React.FC<MyRosterViewProps> = ({ token }) => {
  const [state, setState] = useState<LoadState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [showEarlier, setShowEarlier] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [status, setStatus] = useState('');

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
  const thisMonday = today ? mondayOf(today) : '';

  const days: DayEntry[] = useMemo(() => {
    if (!doc) return [];
    const map = new Map<string, DayEntry>();
    const entry = (date: string) => {
      let e = map.get(date);
      if (!e) {
        e = { date, shifts: [], leave: false };
        map.set(date, e);
      }
      return e;
    };
    for (const s of doc.shifts || []) entry(s.date).shifts.push(s);
    for (const d of doc.leaveDays || []) entry(d).leave = true;
    return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
  }, [doc]);

  const earlierCount = days.filter((d) => d.date < thisMonday).length;
  const visible = days.filter((d) => showEarlier || d.date >= thisMonday);
  const weeks = useMemo(() => {
    const groups: { monday: string; days: DayEntry[] }[] = [];
    for (const d of visible) {
      const monday = mondayOf(d.date);
      const last = groups[groups.length - 1];
      if (last && last.monday === monday) last.days.push(d);
      else groups.push({ monday, days: [d] });
    }
    return groups;
  }, [visible]);

  const weekLabel = (monday: string) => {
    if (monday === thisMonday) return 'This week';
    if (monday === addDaysIso(thisMonday, 7)) return 'Next week';
    if (monday === addDaysIso(thisMonday, -7)) return 'Last week';
    return `Week of ${shortDate(monday)}`;
  };

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
  const buttonClass =
    'min-h-11 inline-flex items-center justify-center gap-2 px-3 rounded-lg border text-sm font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-xl mx-auto px-4 py-5 space-y-4">
        <header className="space-y-1">
          {state.doc.clinicName && (
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{state.doc.clinicName}</p>
          )}
          <h1 className="text-2xl font-bold text-slate-900">Hi {firstName}</h1>
          <p className="text-sm text-slate-600">Here are your shifts from the published roster.</p>
        </header>

        <div className="flex items-start gap-2 rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-900">
          <Lock className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <p>
            <strong>This link is just for you.</strong> Please don't share it. Anyone with it can see your shifts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              downloadIcsFile(`${state.doc.nurseName} shifts.ics`, buildNurseRosterIcs(state.doc));
              setStatus('Calendar file saved. Open it to add your shifts.');
              setTimeout(() => setStatus(''), 4000);
            }}
            className={`${buttonClass} bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700`}
          >
            <CalendarPlus className="w-4 h-4" aria-hidden="true" />
            Add to calendar
          </button>
          <button
            type="button"
            onClick={() => setShowSubscribe((v) => !v)}
            aria-expanded={showSubscribe}
            aria-controls="subscribe-help"
            className={`${buttonClass} bg-white border-slate-300 text-slate-800 hover:bg-slate-100`}
          >
            <Rss className="w-4 h-4" aria-hidden="true" />
            Subscribe in your calendar
          </button>
          <button
            type="button"
            onClick={() => copy(formatRosterAsText(state.doc, today), 'Shifts copied. You can paste them in WhatsApp.')}
            className={`${buttonClass} bg-white border-slate-300 text-slate-800 hover:bg-slate-100`}
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
            Copy as text
          </button>
        </div>

        {showSubscribe && (
          <section id="subscribe-help" className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 text-sm">
            <p className="text-slate-700">
              Subscribing keeps your calendar up to date by itself when the roster changes. Your calendar app checks for
              changes every few hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={nurseWebcalUrl(token)}
                className={`${buttonClass} bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700`}
              >
                Open in my calendar app
              </a>
              <button
                type="button"
                onClick={() => copy(feedUrl, 'Calendar link copied.')}
                className={`${buttonClass} bg-white border-slate-300 text-slate-800 hover:bg-slate-100`}
              >
                <Copy className="w-4 h-4" aria-hidden="true" />
                Copy calendar link
              </button>
            </div>
            <p className="break-all rounded bg-slate-100 px-2 py-1.5 font-mono text-xs text-slate-700 select-all">{feedUrl}</p>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>iPhone:</strong> tap Open in my calendar app, then Subscribe. Or go to Settings, Calendar,
                Accounts, Add Account, Other, Add Subscribed Calendar, and paste the calendar link.
              </p>
              <p>
                <strong>Android (Google Calendar):</strong> on a computer, open calendar.google.com, press the plus
                next to Other calendars, choose From URL and paste the calendar link. It then shows on your phone too.
              </p>
            </div>
          </section>
        )}

        <p className="sr-only" role="status" aria-live="polite">
          {status}
        </p>
        {status && (
          <p className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-800" aria-hidden="true">
            <Check className="w-4 h-4" />
            {status}
          </p>
        )}

        {earlierCount > 0 && (
          <button
            type="button"
            onClick={() => setShowEarlier((v) => !v)}
            aria-expanded={showEarlier}
            className="min-h-11 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:underline cursor-pointer"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showEarlier ? 'rotate-180' : ''}`} aria-hidden="true" />
            {showEarlier ? 'Hide earlier shifts' : `Show earlier shifts (${earlierCount} days)`}
          </button>
        )}

        {weeks.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
            No upcoming shifts yet. They show here once your planner publishes the roster.
          </p>
        ) : (
          weeks.map((week) => (
            <section key={week.monday} aria-labelledby={`week-${week.monday}`} className="space-y-2">
              <h2 id={`week-${week.monday}`} className="text-sm font-bold text-slate-700">
                {weekLabel(week.monday)}
              </h2>
              <ul className="space-y-2">
                {week.days.map((day) => {
                  const isToday = day.date === today;
                  const isPast = day.date < today;
                  return (
                    <li
                      key={day.date}
                      aria-current={isToday ? 'date' : undefined}
                      className={`flex gap-3 rounded-lg border p-3 ${
                        isToday
                          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                          : 'border-slate-200 bg-white'
                      } ${isPast ? 'opacity-60' : ''}`}
                    >
                      <div className="w-14 shrink-0 text-center">
                        <p className="text-xs font-semibold uppercase text-slate-500">{weekdayOf(day.date)}</p>
                        <p className="text-base font-bold text-slate-900">{shortDate(day.date)}</p>
                        {isToday && <p className="text-[11px] font-bold text-indigo-700">Today</p>}
                        {isPast && <span className="sr-only">(past)</span>}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        {day.shifts.map((s, i) => (
                          <div key={i}>
                            <p className="text-sm font-semibold text-slate-900">
                              <span className="inline-block min-w-7 rounded bg-slate-800 px-1.5 py-0.5 text-center font-mono text-xs text-white mr-2">
                                {s.acronym}
                              </span>
                              {s.startTime} to {s.endTime}
                              <span className="sr-only">, {s.shiftName}</span>
                            </p>
                            {s.detail && <p className="text-sm text-slate-600 mt-0.5">{s.detail}</p>}
                          </div>
                        ))}
                        {day.leave && (
                          <p className="text-sm font-semibold text-amber-800">
                            <span className="inline-block rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs mr-2">L</span>
                            Leave
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}

        <footer className="pt-2 text-xs text-slate-500">
          {!Number.isNaN(Date.parse(state.doc.updatedAt)) && <>Updated {new Date(state.doc.updatedAt).toLocaleString()}. </>}
          Questions about a shift? Ask your planner.
        </footer>
      </div>
    </main>
  );
};
