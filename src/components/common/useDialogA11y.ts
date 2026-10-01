/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Keyboard and screen reader behaviour for a modal dialog panel:
 *   - Esc closes the top most open dialog only (nested dialogs close one at a time)
 *   - Tab and Shift+Tab stay inside the dialog
 *   - focus moves into the dialog when it opens and back to where it was when it closes
 *
 * Usage: const ref = useDialogA11y<HTMLDivElement>(isOpen, onClose);
 *        <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="...">
 */

import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

// Open dialogs, oldest first; only the last one reacts to Esc and Tab.
const openStack: symbol[] = [];

export function useDialogA11y<T extends HTMLElement>(isOpen: boolean, onClose?: () => void) {
  const ref = useRef<T | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const id = Symbol('dialog');
    openStack.push(id);
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE) || []).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );

    // Move focus inside unless something inside already has it (e.g. autoFocus).
    const raf = requestAnimationFrame(() => {
      const panel = ref.current;
      if (!panel || panel.contains(document.activeElement)) return;
      const first = focusables()[0];
      if (first) first.focus();
      else {
        if (!panel.hasAttribute('tabindex')) panel.setAttribute('tabindex', '-1');
        panel.focus();
      }
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (openStack[openStack.length - 1] !== id) return;
      if (e.key === 'Escape') {
        if (onCloseRef.current) {
          e.stopPropagation();
          onCloseRef.current();
        }
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = !!active && !!ref.current?.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      const at = openStack.indexOf(id);
      if (at >= 0) openStack.splice(at, 1);
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus();
    };
  }, [isOpen]);

  return ref;
}
