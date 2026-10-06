/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * An edit made on an older copy of a list, applied to the latest copy. Dialogs
 * (templates, fairness moves, swaps) work out their changes, then wait for a
 * confirmation; if someone else's change arrived meanwhile, saving the
 * dialog's whole list would undo it. Instead only what the dialog removed,
 * added or changed is applied to the list as it is now.
 */

import { fingerprint } from '../repository/collectionSyncer';

export function rebaseEdit<T extends { id: string }>(base: T[], edited: T[], latest: T[]): T[] {
  if (base === latest) return edited;
  const before = new Map(base.map((x) => [x.id, fingerprint(x)]));
  const editedIds = new Set(edited.map((x) => x.id));
  const removed = new Set(base.filter((x) => !editedIds.has(x.id)).map((x) => x.id));
  const changed = edited.filter((x) => before.get(x.id) !== fingerprint(x));
  const changedIds = new Set(changed.map((x) => x.id));
  return [...latest.filter((x) => !removed.has(x.id) && !changedIds.has(x.id)), ...changed];
}
