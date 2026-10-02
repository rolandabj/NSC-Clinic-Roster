/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Who else has this roster open. Each open schedule screen writes a small
 * presence/{uid} record every 30 seconds; records older than 75 seconds are
 * treated as gone (a closed tab simply stops refreshing).
 */

import { useEffect, useState } from 'react';
import { getRepository } from '../repository';
import { authService } from '../auth/authService';
import { PresenceRecord } from '../../types';
import { othersOnRoster } from './presenceRules';

const BEAT_MS = 30 * 1000;

export function usePresence(scheduleId: string | null): PresenceRecord[] {
  const [records, setRecords] = useState<PresenceRecord[]>([]);
  const [now, setNow] = useState(Date.now());
  const user = authService.getCurrentUser();
  const uid = user?.uid;

  // My heartbeat.
  useEffect(() => {
    if (!uid) return;
    const repo = getRepository();
    const beat = () => {
      const record: PresenceRecord = {
        id: uid,
        name: user?.name || user?.email || 'A planner',
        email: user?.email || '',
        scheduleId,
        at: new Date().toISOString(),
      };
      // Best effort: presence is a courtesy, a failed write only hides me from others.
      repo.create('presence', record).catch(() => {});
      setNow(Date.now());
    };
    beat();
    const timer = window.setInterval(beat, BEAT_MS);
    const leave = () => {
      repo.remove('presence', uid).catch(() => {});
    };
    window.addEventListener('pagehide', leave);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('pagehide', leave);
    };
  }, [uid, scheduleId]);

  // Everyone else's.
  useEffect(() => {
    if (!uid) return;
    return getRepository().subscribe('presence', (items) => setRecords(items as PresenceRecord[]));
  }, [uid]);

  return othersOnRoster(records, uid, scheduleId, now);
}
