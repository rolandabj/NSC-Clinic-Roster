/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * A dialog over the page that fits a 1280 by 720 laptop screen: the title and one line of
 * description at the top, content that scrolls, and the buttons at the bottom right (Cancel,
 * then the main action). On a phone it rises from the bottom. It keeps focus inside, Esc
 * closes it and focus goes back to what opened it (useDialogA11y).
 *
 *   <Dialog open={open} onClose={close} title="Publish the November roster?"
 *     footer={<><Button onClick={close}>Cancel</Button><Button variant="primary">Publish</Button></>}>
 *     ...
 *   </Dialog>
 */

import React, { useId } from 'react';
import { X } from 'lucide-react';
import { useDialogA11y } from '../common/useDialogA11y';
import { IconButton } from './Button';
import { cx } from './cx';

const WIDTHS = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' };

export const Dialog: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  /** The buttons; leave out for a dialog that only shows something. */
  footer?: React.ReactNode;
  size?: keyof typeof WIDTHS;
  /** alertdialog for a question that needs an answer before anything else. */
  role?: 'dialog' | 'alertdialog';
  children: React.ReactNode;
}> = ({ open, onClose, title, description, footer, size = 'md', role = 'dialog', children }) => {
  const ref = useDialogA11y<HTMLDivElement>(open, onClose);
  const titleId = useId();
  const descriptionId = useId();
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[150] flex items-end justify-center bg-ink/50 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cx(
          'animate-in fade-in zoom-in-95 flex max-h-[calc(100dvh-2rem)] w-full flex-col rounded-t-xl bg-surface shadow-dialog sm:rounded-xl',
          WIDTHS[size]
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-semibold text-ink">
              {title}
            </h2>
            {description && (
              <div id={descriptionId} className="mt-1 text-sm text-ink-muted">
                {description}
              </div>
            )}
          </div>
          <IconButton label="Close" icon={X} onClick={onClose} className="-mt-1 -mr-2" />
        </div>
        <div className="min-h-0 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-3 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
};
