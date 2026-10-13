/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Who else has this roster open. Each visible schedule screen keeps a small
 * presence/{uid}_{tab} record fresh every minute and removes it when closed;
 * records not refreshed for a while are treated as gone. Only the records for
 * this roster are listened to.
 */

import { useEffect, useRef, useState } from 'react';
import { getRepository } from '../repository';
import { authService } from '../auth/authService';
import { PresenceRecord } from '../../types';
import { othersOnRoster, samePeople } from './presenceRules';

const BEAT_MS = 60 * 1000;
// One id per browser tab, so two tabs don't overwrite each other's record.
const TAB_ID = Math.random().toString(36).slice(2, 12);

export function usePresence(scheduleId: string | null): PresenceRecord[] {
  // Only the list of people shown is state: a heartbeat (mine every minute, or another
  // planner's) changes nothing on screen, so it does not draw the roster screen again.
  const [others, setOthers] = useState<PresenceRecord[]>([]);
  const recordsRef = useRef<PresenceRecord[]>([]);
  const user = authService.getCurrentUser();
  const uid = user?.uid;
  const refresh = () => {
    const next = othersOnRoster(recordsRef.current, uid, scheduleId, Date.now());
    setOthers((prev) => (samePeople(prev, next) ? prev : next));
  };

  // My heartbeat, while this tab is visible.
  useEffect(() => {
    if (!uid || !scheduleId) return;
    const repo = getRepository();
    const id = `${uid}_${TAB_ID}`;
    const beat = () => {
      refresh(); // records that went stale drop off the list
      if (document.hidden) return;
      const record: PresenceRecord = {
        id,
        uid,
        name: (user?.name || user?.email || 'A planner').slice(0, 100),
        email: user?.email || '',
        scheduleId,
        at: Date.now(),
      };
      // Best effort: presence is a courtesy, a failed write only hides me from others.
      repo.create('presence', record).catch(() => {});
    };
    const leave = () => {
      repo.remove('presence', id).catch(() => {});
    };
    const onVisibility = () => (document.hidden ? leave() : beat());
    beat();
    const timer = window.setInterval(beat, BEAT_MS);
    window.addEventListener('pagehide', leave);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('pagehide', leave);
      document.removeEventListener('visibilitychange', onVisibility);
      leave();
    };
  }, [uid, scheduleId]);

  // Everyone else's records for this roster.
  useEffect(() => {
    if (!uid || !scheduleId) {
      recordsRef.current = [];
      refresh();
      return;
    }
    return getRepository().subscribe('presence', (items) => {
      recordsRef.current = items as PresenceRecord[];
      refresh();
    }, {
      field: 'scheduleId',
      operator: '==',
      value: scheduleId,
    });
  }, [uid, scheduleId]);

  return others;
}
