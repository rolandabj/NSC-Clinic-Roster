/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Nurse Calendar Feed
 * GET /calendar/:token.ics serves a nurse's private page (nurseRosters/{token})
 * as an iCalendar feed, so her phone's calendar can subscribe and stay up to
 * date. No sign in: the token in the link is the proof, exactly as for the
 * page itself, and the Firestore rules refuse revoked links.
 */

import { Router, Request, Response } from 'express';
import { getPublicDocument } from '../services/firestore/firestoreRest';
import { buildNurseRosterIcs } from '../../src/services/export/icsExportService';
import type { NurseRosterDoc } from '../../src/types';

export const calendarRouter = Router();

/** Exactly the tokens the app makes: nr_ followed by a random UUID. */
const TOKEN_PATTERN = /^nr_[0-9a-f-]{36}$/;

calendarRouter.get('/calendar/:file', async (req: Request, res: Response) => {
  const match = /^(.+)\.ics$/.exec(req.params.file || '');
  const token = match?.[1] || '';
  if (!TOKEN_PATTERN.test(token)) {
    res.status(404).type('text/plain').send('Calendar not found.');
    return;
  }
  try {
    const doc = (await getPublicDocument('nurseRosters', token)) as NurseRosterDoc | null;
    if (!doc || doc.revoked === true || doc.token !== token) {
      res.status(404).type('text/plain').send('This calendar link no longer works. Ask your planner for a new one.');
      return;
    }
    const ics = buildNurseRosterIcs({
      nurseId: String(doc.nurseId || ''),
      nurseName: String(doc.nurseName || 'My'),
      clinicName: String(doc.clinicName || ''),
      timezone: String(doc.timezone || 'Asia/Dubai'),
      shifts: Array.isArray(doc.shifts) ? doc.shifts : [],
      leaveDays: Array.isArray(doc.leaveDays) ? doc.leaveDays : [],
    });
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="shifts.ics"');
    res.setHeader('Cache-Control', 'private, max-age=900');
    res.setHeader('X-Robots-Tag', 'noindex');
    res.send(ics);
  } catch (err) {
    console.warn('[calendar] Could not read the nurse roster:', (err as Error).message);
    res.status(503).type('text/plain').send('The calendar is not available right now. Please try again later.');
  }
});
