/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Settings, Rules saved only by Save (Phase 8, slice 1c): the rules a draft changed, with only
 * the fields it changed, so Save writes nothing else. Adding the standard rules and deleting an
 * old rule happen at once, elsewhere.
 */

import { Rule } from '../../types';

const FIELDS = ['name', 'value', 'severity', 'enabled', 'params'] as const;

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

export function ruleChanges(saved: Rule[], draft: Rule[]): { id: string; updates: Partial<Rule> }[] {
  const byId = new Map(saved.map((r) => [r.id, r]));
  const out: { id: string; updates: Partial<Rule> }[] = [];
  for (const d of draft) {
    const s = byId.get(d.id);
    if (!s) continue;
    const updates: Partial<Rule> = {};
    for (const f of FIELDS) if (!same(s[f], d[f])) (updates as Record<string, unknown>)[f] = d[f];
    if (Object.keys(updates).length > 0) out.push({ id: d.id, updates });
  }
  return out;
}
