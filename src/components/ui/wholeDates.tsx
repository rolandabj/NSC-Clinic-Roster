/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Keeps each DD-MM-YYYY date in a piece of text on one line, so a message never shows
 * "22-" at the end of a line and "12-2026" on the next.
 */

import React from 'react';

const DATE = /(\d{2}-\d{2}-\d{4})/;

export function wholeDates(text: string): React.ReactNode {
  const parts = text.split(DATE);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    )
  );
}
