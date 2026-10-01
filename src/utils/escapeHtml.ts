/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Escapes a value for safe insertion into HTML text or a quoted attribute.
 * Used for every user supplied value (names, notes, clinic name...) in email HTML.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Returns the value only if it is a plain CSS hex colour, otherwise the fallback.
 * Prevents style attribute injection through colour fields.
 */
export function safeColor(value: unknown, fallback: string): string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(value.trim()) ? value.trim() : fallback;
}
