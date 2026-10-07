/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The address after # names the screen, then what is open on it, so a link can open a given
 * roster, sheet, day, nurse or settings tab, and Back can move between tabs:
 *
 *   #schedules?roster=nov&sheet=problems&nurse=mary&date=2026-11-20
 *   #nurses?nurse=mary
 *   #settings?tab=email
 *
 * No router library: AppShell reads the address on load and on hashchange.
 */

export interface Address {
  route: string;
  params: Record<string, string>;
}

/** The order the parts are written in, so the same state always gives the same address. */
const ORDER = ['roster', 'sheet', 'nurse', 'date', 'tab'];

/** { route: 'settings', params: { tab: 'email' } } from '#settings?tab=email'. */
export function readAddress(hash: string): Address {
  const [route, query = ''] = hash.replace(/^#/, '').split('?');
  const params: Record<string, string> = {};
  new URLSearchParams(query).forEach((value, key) => {
    params[key] = value;
  });
  return { route, params };
}

/** '#settings?tab=email' from 'settings' and { tab: 'email' }; empty parts are left out. */
export function addressHash(route: string, params: Record<string, string | undefined> = {}): string {
  const keys = Object.keys(params).sort((a, b) => {
    const [ia, ib] = [ORDER.indexOf(a), ORDER.indexOf(b)];
    return (ia < 0 ? ORDER.length : ia) - (ib < 0 ? ORDER.length : ib);
  });
  const query = keys
    .filter((k) => params[k])
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k]!)}`)
    .join('&');
  return `#${route}${query ? `?${query}` : ''}`;
}

/** The roster's sheets as the address names them; the grid itself needs no name. */
const ROSTER_SHEETS: Record<string, string> = {
  doctors: 'doctors',
  coverage: 'coverage',
  warnings: 'problems',
  leave: 'leave',
  hours: 'hours',
  legend: 'key',
};

export function rosterSheetToAddress(sheet: string): string | undefined {
  return ROSTER_SHEETS[sheet];
}

export function rosterSheetFromAddress(name: string | undefined): string | undefined {
  if (!name) return undefined;
  return Object.keys(ROSTER_SHEETS).find((sheet) => ROSTER_SHEETS[sheet] === name);
}
