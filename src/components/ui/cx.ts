/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Joins class names, leaving out the empty ones: cx('a', isOn && 'b').
 */
export const cx = (...parts: (string | false | null | undefined)[]): string => parts.filter(Boolean).join(' ');
