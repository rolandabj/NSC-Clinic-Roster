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
import { CircleCheck, Info, OctagonAlert, TriangleAlert, X } from 'lucide-react';
import { useDialogA11y } from './useDialogA11y';
import { Button } from '../ui/Button';
import { wholeDates } from '../ui/wholeDates';

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

// Messages are dark (the approved look); each tone has its own icon, light enough to read on it.
const TONE_ICONS: Record<NoticeTone, React.ReactNode> = {
  info: <Info className="size-5 text-cyan-300" aria-hidden="true" />,
  success: <CircleCheck className="size-5 text-emerald-300" aria-hidden="true" />,
  warning: <TriangleAlert className="size-5 text-amber-300" aria-hidden="true" />,
  error: <OctagonAlert className="size-5 text-red-300" aria-hidden="true" />,
};

const ConfirmBox: React.FC<{ item: PendingConfirm }> = ({ item }) => {
  const titleId = useId();
  const bodyId = useId();
  const ref = useDialogA11y<HTMLDivElement>(true, () => settleConfirm(item.id, false));
  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/50 sm:items-center sm:p-4" onMouseDown={() => settleConfirm(item.id, false)}>
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className="animate-in fade-in zoom-in-95 w-full rounded-t-xl bg-surface p-5 shadow-dialog sm:max-w-md sm:rounded-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="text-lg font-semibold text-ink">
          {item.title || 'Please confirm'}
        </h2>
        <div id={bodyId} className="mt-2 whitespace-pre-line text-sm text-ink-muted">
          {typeof item.message === 'string' ? wholeDates(item.message) : item.message}
        </div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button onClick={() => settleConfirm(item.id, false)}>{item.cancelLabel || 'Cancel'}</Button>
          <Button variant={item.danger ? 'danger' : 'primary'} autoFocus onClick={() => settleConfirm(item.id, true)}>
            {item.confirmLabel || 'OK'}
          </Button>
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
            className="animate-in fade-in slide-in-from-bottom-2 pointer-events-auto flex items-start gap-3 rounded-lg bg-ink px-4 py-3 text-sm text-white shadow-pop"
          >
            <span className="shrink-0">{TONE_ICONS[n.tone]}</span>
            <p className="flex-1 whitespace-pre-line">{wholeDates(n.message)}</p>
            <button
              type="button"
              aria-label="Close message"
              title="Close message"
              className="-m-1 shrink-0 rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
              onClick={() => dismissNotice(n.id)}
            >
              <X className="size-4" aria-hidden="true" />
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
