/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Request decision emails (UI overhaul Phase 5, slice 4)
 * POST /api/requests/:id/notify  { kind: 'leave' | 'day' }
 * After a planner or manager approves or declines a request, the browser asks the
 * server to tell the nurse. The server reads the request, the nurse and the clinic's
 * email settings with the caller's own token (the Firestore rules apply as in their
 * browser), writes the email itself and sends it to that nurse only. Nothing in the
 * email, and not the recipient, comes from the request body.
 */

import { Router, Request, Response } from 'express';
import { EmailService, isGoogleAccountEmail, SendEmailPayload, SendEmailResult } from '../services/email/emailService';
import { getDocumentAs } from '../services/firestore/firestoreRest';
import { decisionEmail, DecidedRequest } from '../../src/services/requests/decisionEmail';

export interface RequestNotifyDeps {
  readDocument(collection: string, id: string, idToken: string): Promise<Record<string, any> | null>;
  send(payload: SendEmailPayload): Promise<SendEmailResult>;
  now(): number;
}

const defaultDeps: RequestNotifyDeps = {
  readDocument: getDocumentAs,
  send: (payload) => EmailService.send(payload),
  now: () => Date.now(),
};

/** A decision is emailed only soon after it was made, so old decisions cannot be sent again later. */
const RECENT_DECISION_MS = 15 * 60 * 1000;
const SENT_MEMORY = 1000;
const ID_PATTERN = /^[A-Za-z0-9_-]{1,200}$/;

const COLLECTION = { leave: 'leaveEntries', day: 'availabilityRequests' } as const;

export function createRequestsRouter(deps: RequestNotifyDeps = defaultDeps) {
  const router = Router();
  // Decisions already emailed by this server, so a repeated call sends nothing.
  const sent = new Set<string>();

  router.post('/:id/notify', async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized', message: 'Sign in required.' });
      return;
    }
    // The same people as canApprove() in firestore.rules: the owner, editors and managers.
    const canApprove = user.role === 'OWNER' || user.role === 'PLANNER' || user.role === 'EDITOR' || user.isManager === true;
    if (!canApprove) {
      res.status(403).json({ error: 'Forbidden', message: 'Only planners and managers can email a decision.' });
      return;
    }

    const kind: unknown = req.body?.kind;
    const id = req.params.id;
    if ((kind !== 'leave' && kind !== 'day') || !ID_PATTERN.test(id)) {
      res.status(400).json({ error: 'BadRequest', message: 'Choose which request to email about.' });
      return;
    }

    const token: string = (req as any).firebaseIdToken || '';
    try {
      const settings = await deps.readDocument('systemMetadata', 'email_settings', token);
      // The switch in Settings, Email starts off.
      if (settings?.emailRequestDecisions !== true) {
        res.json({ data: { status: 'OFF' } });
        return;
      }

      const request = await deps.readDocument(COLLECTION[kind], id, token);
      if (!request) {
        res.status(404).json({ error: 'NotFound', message: 'The request was not found.' });
        return;
      }
      const status = request.status;
      if (status !== 'APPROVED' && status !== 'REJECTED') {
        res.status(409).json({ error: 'NotDecided', message: 'This request is still Waiting. Only an approved or declined request can be emailed.' });
        return;
      }
      const decidedAt = Date.parse(String(request.reviewedAt || ''));
      if (!Number.isFinite(decidedAt) || deps.now() - decidedAt > RECENT_DECISION_MS) {
        res.status(409).json({ error: 'NotRecent', message: 'Only a decision made in the last 15 minutes can be emailed.' });
        return;
      }
      const key = `${kind}/${id}/${status}/${request.reviewedAt}`;
      if (sent.has(key)) {
        res.json({ data: { status: 'ALREADY_SENT' } });
        return;
      }

      const nurse = request.nurseId ? await deps.readDocument('nurses', String(request.nurseId), token) : null;
      const to = String(nurse?.gmail || '').trim().toLowerCase();
      if (!nurse || !isGoogleAccountEmail(to)) {
        res.status(422).json({ error: 'NoEmail', message: 'No email was sent: the nurse has no email address on file.' });
        return;
      }

      let decided: DecidedRequest;
      if (kind === 'leave') {
        const leaveType = request.leaveTypeId ? await deps.readDocument('leaveTypes', String(request.leaveTypeId), token) : null;
        decided = { kind, leaveTypeName: leaveType?.name, startDate: String(request.startDate || ''), endDate: String(request.endDate || '') };
      } else {
        const shift = request.available && request.preferredDutyWindowId
          ? await deps.readDocument('dutyWindows', String(request.preferredDutyWindowId), token)
          : null;
        decided = { kind, available: request.available === true, shiftName: shift?.name, date: String(request.date || '') };
      }

      const senderName = String(settings.emailSenderName || '');
      const email = decisionEmail({
        request: decided,
        status,
        nurseName: String(nurse.fullName || ''),
        reviewerName: request.reviewedByUserName,
        reviewNote: request.reviewNotes,
        senderName,
      });
      const result = await deps.send({
        to,
        ...email,
        nurseId: String(request.nurseId),
        // Sandbox or Live is the clinic's shared choice, never the caller's.
        config: { mockMode: settings.emailMockMode !== false, ...(senderName ? { senderName } : {}) },
      });
      if (!result.success) {
        res.status(502).json({ error: 'SendFailed', message: result.error || 'The email could not be sent.' });
        return;
      }
      sent.add(key);
      if (sent.size > SENT_MEMORY) sent.delete(sent.values().next().value as string);
      res.json({ data: { status: result.status } });
    } catch (err: any) {
      console.error('[RequestsAPI] notify failed:', err?.message || err);
      res.status(503).json({ error: 'LookupFailed', message: 'The request could not be read. Try again.' });
    }
  });

  return router;
}

export const requestsRouter = createRequestsRouter();
