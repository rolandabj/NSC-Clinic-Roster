/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The small popup that opens next to a roster cell when it is clicked: one tap
 * choices for the day (a doctor, Nurse Clinic, other clinic tasks, leave),
 * Clear, and a way into the full editor. It is not a modal: the grid keeps its
 * arrow keys while the popup is open, and the popup closes on Escape, a click
 * outside it, or a scroll.
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, CircleCheck, CircleSlash, Lock, Edit2, MessageSquare, Trash2, Unlock, X } from 'lucide-react';

export interface QuickWorkOption {
  key: string;
  label: string;
  /** Second line, e.g. the session times and the shift used. */
  detail?: string;
  /** Shown as a small tag, e.g. "Usual" for a doctor the nurse usually works with. */
  tag?: string;
  current?: boolean;
  onSelect: () => void;
}

export interface QuickLeaveOption {
  key: string;
  label: string;
  acronym: string;
  color: string;
  current?: boolean;
  onSelect: () => void;
}

/** Why an empty cell is empty: the nurse is off (with reasons) or free to work (with her shifts). */
export interface QuickDayNote {
  tone: 'off' | 'free';
  /** e.g. "Why this nurse is off:" or "Free to work: E, L (152 / 160 h)". */
  title: string;
  /** Plain sentences shown under the title. */
  lines: string[];
}

/** A nurse's wish for the day: her request (a day off or a shift) or leave waiting for approval. */
export interface QuickWish {
  /** e.g. "Asked for this day off (waiting for approval): family visit". */
  text: string;
  /** The day does not follow the request (shown in amber). */
  notFollowed: boolean;
}

interface QuickCellPopupProps {
  /** The data-cell value of the cell the popup belongs to. */
  cellKey: string;
  nurseName: string;
  dateLabel: string;
  /** What the cell holds now, in words ('' when empty). */
  currentLabel: string;
  problems: string[];
  /** Shown at the top for an empty cell. */
  dayNote?: QuickDayNote;
  /** The nurse's requests and leave waiting for approval, shown first. */
  wishes?: QuickWish[];
  pinned: boolean;
  onUnpin?: () => void;
  workOptions: QuickWorkOption[];
  leaveOptions: QuickLeaveOption[];
  onClear?: () => void;
  onMore: () => void;
  onClose: () => void;
  /** Move keyboard focus into the popup when it opens (opened from the keyboard). */
  focusOnOpen?: boolean;
}

const GAP = 6;
const MARGIN = 8;

const findCell = (cellKey: string): HTMLElement | null => {
  const sel = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(cellKey) : cellKey.replace(/"/g, '\\"');
  return document.querySelector<HTMLElement>(`[data-cell="${sel}"]`);
};

export const QuickCellPopup: React.FC<QuickCellPopupProps> = ({
  cellKey,
  nurseName,
  dateLabel,
  currentLabel,
  problems,
  dayNote,
  wishes = [],
  pinned,
  onUnpin,
  workOptions,
  leaveOptions,
  onClear,
  onMore,
  onClose,
  focusOnOpen = false,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const openedAtRef = useRef(Date.now());
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Place the popup next to the cell (right side first, then left), inside the window.
  useLayoutEffect(() => {
    const cell = findCell(cellKey);
    const el = ref.current;
    if (!cell || !el) return;
    const c = cell.getBoundingClientRect();
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = c.right + GAP;
    if (left + w > vw - MARGIN) left = c.left - GAP - w;
    if (left < MARGIN) left = Math.max(MARGIN, Math.min(vw - w - MARGIN, c.left));
    let top = c.top;
    if (top + h > vh - MARGIN) top = vh - h - MARGIN;
    if (top < MARGIN) top = MARGIN;
    setPos({ top, left });
  }, [cellKey, workOptions.length, leaveOptions.length, problems.length, pinned, dayNote?.lines.length, noteOpen, wishes.length]);

  // Keyboard users who opened the popup land on its first choice.
  useEffect(() => {
    if (!focusOnOpen || !pos) return;
    ref.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
    // Only once, when first placed.
  }, [focusOnOpen, pos === null]);

  // Close on a click outside, a scroll, a resize, or Escape.
  useEffect(() => {
    const onPointerDown = (e: Event) => {
      const t = e.target as Node | null;
      if (!t || ref.current?.contains(t)) return;
      // A click on the same cell keeps the popup (a second click of a double click).
      if (findCell(cellKey)?.contains(t)) return;
      onCloseRef.current();
    };
    const onScroll = (e: Event) => {
      const t = e.target as Node | null;
      if (t && t instanceof Node && ref.current?.contains(t)) return;
      // Focusing the clicked cell can scroll it into view just as the popup opens.
      if (Date.now() - openedAtRef.current < 250) return;
      onCloseRef.current();
    };
    const onResize = () => onCloseRef.current();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // A dialog on top (a confirmation) handles its own Escape.
      if (document.querySelector('[aria-modal="true"]')) return;
      // Only the popup closes (not full screen as well).
      e.stopPropagation();
      const inside = !!ref.current?.contains(document.activeElement);
      onCloseRef.current();
      if (inside) findCell(cellKey)?.focus({ preventScroll: true });
    };
    document.addEventListener('mousedown', onPointerDown, true);
    document.addEventListener('touchstart', onPointerDown, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('mousedown', onPointerDown, true);
      document.removeEventListener('touchstart', onPointerDown, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [cellKey]);

  // Up and Down move between the choices; the grid's own keys stay out of the popup.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return;
    const buttons = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') || []);
    if (buttons.length === 0) return;
    e.preventDefault();
    e.stopPropagation();
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    let next = 0;
    if (e.key === 'End') next = buttons.length - 1;
    else if (e.key === 'ArrowDown') next = i < 0 ? 0 : (i + 1) % buttons.length;
    else if (e.key === 'ArrowUp') next = i <= 0 ? buttons.length - 1 : i - 1;
    buttons[next].focus();
  };

  // Focus leaving the popup for somewhere else on the page closes it.
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && !ref.current?.contains(next)) onClose();
  };

  const itemClass =
    'w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 focus:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer flex items-center gap-2';

  return (
    <div
      ref={ref}
      data-quick-popup
      role="dialog"
      aria-label={`Change ${nurseName} on ${dateLabel}`}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className="fixed z-50 w-64 max-h-[calc(100vh-16px)] overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl text-xs font-sans"
      style={pos ? { top: pos.top, left: pos.left } : { top: 0, left: 0, visibility: 'hidden' }}
    >
      <div className="flex items-start justify-between gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50 rounded-t-lg">
        <div className="min-w-0">
          <span className="block font-bold text-slate-900 truncate">{nurseName}</span>
          <span className="block text-[11px] text-slate-500">
            {dateLabel}
            {currentLabel ? ` · ${currentLabel}` : ' · nothing yet'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            onClose();
            findCell(cellKey)?.focus({ preventScroll: true });
          }}
          className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 cursor-pointer shrink-0"
          aria-label="Close"
          title="Close"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {wishes.map((w, i) => (
        <div
          key={i}
          className={`mx-2 mt-2 p-2 rounded border text-[11px] flex items-start gap-1 leading-snug ${
            w.notFollowed ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-sky-200 bg-sky-50 text-sky-900'
          }`}
          role="note"
        >
          <MessageSquare
            className={`w-3.5 h-3.5 shrink-0 mt-px ${w.notFollowed ? 'text-amber-600' : 'text-sky-600'}`}
            aria-hidden="true"
          />
          <span>{w.text}</span>
        </div>
      ))}

      {dayNote && (
        <div
          className={`mx-2 mt-2 p-2 rounded border text-[11px] ${
            dayNote.tone === 'off' ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-emerald-200 bg-emerald-50 text-emerald-900'
          }`}
          role="note"
        >
          <span className="flex items-center gap-1 font-semibold">
            {dayNote.tone === 'off' ? (
              <CircleSlash className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
            ) : (
              <CircleCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
            )}
            {dayNote.title}
          </span>
          {dayNote.lines.length > 0 && (
            <span id={`${cellKey}-day-note`} className={`block leading-snug mt-0.5 ${noteOpen ? '' : 'line-clamp-2'}`}>
              {dayNote.lines.join(' ')}
            </span>
          )}
          {/* Long lists are cut to two lines until asked for. */}
          {(dayNote.lines.length > 2 || dayNote.lines.join(' ').length > 90) && (
            <button
              type="button"
              onClick={() => setNoteOpen((v) => !v)}
              aria-expanded={noteOpen}
              aria-controls={`${cellKey}-day-note`}
              className="mt-0.5 text-[11px] font-semibold text-indigo-700 hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              {noteOpen ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {problems.length > 0 && (
        <div className="mx-2 mt-2 p-2 rounded border border-rose-200 bg-rose-50 text-rose-800 text-[11px] space-y-0.5" role="note">
          <span className="flex items-center gap-1 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
            {problems.length === 1 ? 'Problem' : `${problems.length} problems`}
          </span>
          {problems.map((p, i) => (
            <span key={i} className="block leading-snug">
              {p}
            </span>
          ))}
        </div>
      )}

      <div className="p-1.5 space-y-1">
        {pinned ? (
          <>
            <div className="flex items-start gap-2 px-2.5 py-2 rounded bg-amber-50 border border-amber-200 text-amber-900">
              <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span className="leading-snug">This day is pinned. Unpin it first to change it here.</span>
            </div>
            {onUnpin && (
              <button type="button" onClick={onUnpin} className={`${itemClass} font-semibold text-amber-800`}>
                <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Unpin…</span>
              </button>
            )}
          </>
        ) : (
          <>
            {workOptions.length > 0 && (
              <div role="group" aria-label="Work">
                <span className="block px-2.5 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Work
                </span>
                {workOptions.map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    onClick={o.onSelect}
                    aria-current={o.current ? 'true' : undefined}
                    className={`${itemClass} ${o.current ? 'bg-indigo-50' : ''}`}
                  >
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-1">
                        <span className="font-semibold text-slate-900 truncate">{o.label}</span>
                        {o.tag && (
                          <span className="text-[10px] font-semibold px-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                            {o.tag}
                          </span>
                        )}
                      </span>
                      {o.detail && <span className="block text-[10px] text-slate-500 font-mono">{o.detail}</span>}
                    </span>
                    {o.current && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}

            {leaveOptions.length > 0 && (
              <div role="group" aria-label="Leave" className="pt-1 border-t border-slate-100">
                <span className="block px-2.5 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Leave and days off
                </span>
                {leaveOptions.map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    onClick={o.onSelect}
                    aria-current={o.current ? 'true' : undefined}
                    className={`${itemClass} ${o.current ? 'bg-indigo-50' : ''}`}
                  >
                    <span
                      className="inline-flex items-center justify-center min-w-[24px] px-1 py-0.5 rounded text-[10px] font-bold text-white shrink-0"
                      style={{ backgroundColor: o.color || '#f59e0b' }}
                      aria-hidden="true"
                    >
                      {o.acronym}
                    </span>
                    <span className="flex-1 text-slate-800 truncate">{o.label}</span>
                    {o.current && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}

            {onClear && (
              <div className="pt-1 border-t border-slate-100">
                <button type="button" onClick={onClear} className={`${itemClass} text-red-600 hover:bg-red-50`}>
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Clear</span>
                </button>
              </div>
            )}
          </>
        )}

        <div className="pt-1 border-t border-slate-100">
          <button type="button" onClick={onMore} className={`${itemClass} text-slate-700`}>
            <Edit2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>More options…</span>
          </button>
        </div>
      </div>
    </div>
  );
};
