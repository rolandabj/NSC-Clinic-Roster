/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * In-app replacements for window.alert and window.confirm, which block the
 * whole page, can't be styled, and are hidden or suppressed in some browsers
 * and embedded previews.
 *
 *   notify('Saved', 'success')                 a short message in the corner
 *   if (!(await confirmDialog({ ... }))) return  asks and waits for the answer
 *
 * <DialogHost /> must be mounted once (App.tsx does this).
 */

import React, { useEffect, useId, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useDialogA11y } from './useDialogA11y';

export type NoticeTone = 'info' | 'success' | 'warning' | 'error';

export interface ConfirmOptions {
  title?: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red confirm button, for actions that delete or overwrite data. */
  danger?: boolean;
}

interface Notice {
  id: number;
  message: string;
  tone: NoticeTone;
}

interface PendingConfirm extends ConfirmOptions {
  id: number;
  resolve: (ok: boolean) => void;
}

interface DialogState {
  notices: Notice[];
  confirms: PendingConfirm[];
}

let state: DialogState = { notices: [], confirms: [] };
let nextId = 1;
const listeners = new Set<(s: DialogState) => void>();
let hostMounted = false;

function setState(next: DialogState) {
  state = next;
  listeners.forEach((l) => l(state));
}

function dismissNotice(id: number) {
  setState({ ...state, notices: state.notices.filter((n) => n.id !== id) });
}

/** Shows a short message that closes by itself (errors stay a little longer). */
export function notify(message: string, tone: NoticeTone = 'info'): void {
  if (!hostMounted) {
    // Nothing on screen can show it (e.g. very early start up): keep the old behaviour.
    if (typeof window !== 'undefined') window.alert(message);
    return;
  }
  const id = nextId++;
  setState({ ...state, notices: [...state.notices, { id, message, tone }].slice(-4) });
  setTimeout(() => dismissNotice(id), tone === 'error' || tone === 'warning' ? 9000 : 5000);
}

/** Asks the user to confirm; resolves true for confirm, false for cancel or Esc. */
export function confirmDialog(options: ConfirmOptions | string): Promise<boolean> {
  const opts: ConfirmOptions = typeof options === 'string' ? { message: options } : options;
  if (!hostMounted) {
    const text = typeof opts.message === 'string' ? opts.message : opts.title || 'Are you sure?';
    return Promise.resolve(typeof window !== 'undefined' ? window.confirm(text) : false);
  }
  // The same question already waiting (e.g. a double click): answer the
  // second request "no", so the action can't run twice.
  if (state.confirms.some((c) => c.message === opts.message && c.title === opts.title)) {
    return Promise.resolve(false);
  }
  return new Promise<boolean>((resolve) => {
    const id = nextId++;
    setState({ ...state, confirms: [...state.confirms, { ...opts, id, resolve }] });
  });
}

function settleConfirm(id: number, ok: boolean) {
  const item = state.confirms.find((c) => c.id === id);
  setState({ ...state, confirms: state.confirms.filter((c) => c.id !== id) });
  item?.resolve(ok);
}

const TONE_STYLES: Record<NoticeTone, { box: string; icon: React.ReactNode }> = {
  info: { box: 'border-slate-200 bg-white text-slate-800', icon: <Info className="h-4 w-4 text-indigo-600" aria-hidden="true" /> },
  success: {
    box: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />,
  },
  warning: {
    box: 'border-amber-200 bg-amber-50 text-amber-900',
    icon: <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />,
  },
  error: { box: 'border-rose-200 bg-rose-50 text-rose-900', icon: <XCircle className="h-4 w-4 text-rose-600" aria-hidden="true" /> },
};

const ConfirmBox: React.FC<{ item: PendingConfirm }> = ({ item }) => {
  const titleId = useId();
  const bodyId = useId();
  const ref = useDialogA11y<HTMLDivElement>(true, () => settleConfirm(item.id, false));
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 p-4" onMouseDown={() => settleConfirm(item.id, false)}>
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="text-base font-semibold text-slate-900">
          {item.title || 'Please confirm'}
        </h2>
        <div id={bodyId} className="mt-2 whitespace-pre-line text-sm text-slate-600">
          {item.message}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            onClick={() => settleConfirm(item.id, false)}
          >
            {item.cancelLabel || 'Cancel'}
          </button>
          <button
            type="button"
            autoFocus
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              item.danger ? 'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500' : 'bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500'
            }`}
            onClick={() => settleConfirm(item.id, true)}
          >
            {item.confirmLabel || 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

/** Renders notices and confirm dialogs. Mount once near the root. */
export const DialogHost: React.FC = () => {
  const [view, setView] = useState<DialogState>(state);

  useEffect(() => {
    hostMounted = true;
    listeners.add(setView);
    setView(state);
    return () => {
      listeners.delete(setView);
      hostMounted = listeners.size > 0;
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed bottom-4 right-4 z-[210] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
        {view.notices.map((n) => (
          <div
            key={n.id}
            role={n.tone === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm shadow-lg ${TONE_STYLES[n.tone].box}`}
          >
            <span className="mt-0.5 shrink-0">{TONE_STYLES[n.tone].icon}</span>
            <p className="flex-1 whitespace-pre-line">{n.message}</p>
            <button
              type="button"
              aria-label="Dismiss message"
              className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              onClick={() => dismissNotice(n.id)}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      {view.confirms.slice(0, 1).map((c) => (
        <ConfirmBox key={c.id} item={c} />
      ))}
    </>
  );
};
