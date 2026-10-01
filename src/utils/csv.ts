/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CSV helpers shared by every export.
 *
 * Each cell is quoted, with quotes inside doubled, so names with commas,
 * quotes or line breaks stay in one cell. Text that a spreadsheet would run
 * as a formula (starting with =, +, -, @, tab or carriage return) gets a
 * leading apostrophe, so a nurse named "=HYPERLINK(...)" can't run anything
 * when a manager opens the file in Excel. Real numbers are left as numbers.
 */

export type CsvValue = string | number | boolean | null | undefined;

const FORMULA_START = /^[=+\-@\t\r]/;

export function csvCell(value: CsvValue): string {
  if (value === null || value === undefined) return '""';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : '""';
  let text = String(value);
  if (FORMULA_START.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function toCsv(rows: CsvValue[][]): string {
  return rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
}

/** Downloads CSV text as a file (with a byte order mark so Excel reads UTF-8 names). */
export function downloadCsv(fileName: string, content: string): void {
  if (typeof document === 'undefined') return;
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
