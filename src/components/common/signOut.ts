/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Signing out from the top bar or the account dialog. Roster changes that are
 * not saved yet are kept while the app is open (see rosterSaveQueues); signing
 * out asks first, then drops them, so they are never saved under the next
 * account that signs in on this browser.
 */

import { authService } from '../../services/auth/authService';
import { getRepository } from '../../services/repository';
import { rosterSaveQueues } from '../../services/repository/rosterSaveQueues';
import { confirmDialog } from './dialogs';

export async function signOutSafely(): Promise<void> {
  const queues = rosterSaveQueues(getRepository());
  if (queues.hasUnsaved()) {
    const ok = await confirmDialog({
      title: 'Sign out with unsaved changes?',
      message: 'Some roster changes are not saved yet. If you sign out now they are dropped.',
      confirmLabel: 'Sign out',
      danger: true,
    });
    if (!ok) return;
  }
  queues.reset();
  await authService.signOut();
}
