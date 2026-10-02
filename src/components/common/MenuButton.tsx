/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * A button that opens a small menu of actions. Arrow keys move between items,
 * Escape or a click outside closes it, and focus returns to the button.
 */

import React, { useEffect, useId, useRef, useState } from 'react';

export interface MenuItem {
  label: string;
  /** A second line in smaller text. */
  hint?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  disabled?: boolean;
  /** Red text, for actions that remove things. */
  danger?: boolean;
  /** Draws a line above this item. */
  separatorBefore?: boolean;
}

interface MenuButtonProps {
  label: React.ReactNode;
  /** Read by screen readers when the label is only an icon. */
  ariaLabel?: string;
  items: MenuItem[];
  className: string;
  title?: string;
  align?: 'left' | 'right';
  disabled?: boolean;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ label, ariaLabel, items, className, title, align = 'left', disabled }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    // Focus the first item that can be used.
    const first = items.findIndex((i) => !i.disabled);
    if (first >= 0) itemRefs.current[first]?.focus();
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const move = (from: number, step: number) => {
    for (let n = 1; n <= items.length; n++) {
      const i = (from + step * n + items.length) % items.length;
      if (!items[i].disabled) {
        itemRefs.current[i]?.focus();
        return;
      }
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={ariaLabel}
        title={title}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={className}
      >
        {label}
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          onKeyDown={(e) => {
            const index = itemRefs.current.findIndex((el) => el === document.activeElement);
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              close();
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              move(index, 1);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              move(index < 0 ? 0 : index, -1);
            } else if (e.key === 'Tab') {
              setOpen(false);
            }
          }}
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1 w-64 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-40 text-xs`}
        >
          {items.map((item, i) => (
            <button
              key={item.label}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                close(false);
                item.onSelect();
              }}
              className={`w-full text-left px-3 py-2 flex items-start gap-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:bg-indigo-50 hover:bg-indigo-50 ${
                item.separatorBefore ? 'border-t border-slate-100' : ''
              } ${item.danger ? 'text-rose-700' : 'text-slate-800'}`}
            >
              {item.icon && <span className="mt-0.5 shrink-0" aria-hidden="true">{item.icon}</span>}
              <span>
                <span className="block font-semibold">{item.label}</span>
                {item.hint && <span className="block text-[11px] text-slate-500 font-normal">{item.hint}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
