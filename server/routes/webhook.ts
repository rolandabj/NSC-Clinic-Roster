/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Webhook Administration & Testing Router
 */

import { Router, Request, Response } from 'express';
import { WebhookService } from '../services/notifications/webhookService';
import { requirePlanner } from '../middleware/auth';
import { WebhookEndpoint } from '../../src/types';

export const webhookRouter = Router();

/**
 * Only public https URLs with a host name may be tested, so the server cannot
 * be pointed at itself, internal addresses or the cloud metadata service.
 */
function isAllowedWebhookUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;
  const host = url.hostname.toLowerCase();
  if (!host.includes('.') || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal')) return false;
  // Reject IP address literals (IPv4 and IPv6).
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[') || host.includes(':')) return false;
  return true;
}

/**
 * POST /api/webhook/test
 * Test dispatch to an individual webhook endpoint
 */
webhookRouter.post('/webhook/test', requirePlanner, async (req: Request, res: Response) => {
  try {
    const { endpoint } = req.body as { endpoint: WebhookEndpoint };
    if (!endpoint || !endpoint.url || !isAllowedWebhookUrl(endpoint.url)) {
      res.status(400).json({
        error: 'BadRequest',
        message: 'A public https webhook URL (for example Slack, Teams or Discord) is required.',
      });
      return;
    }

    const result = await WebhookService.testEndpoint(endpoint);
    res.json({ status: 'ok', data: result });
  } catch (err: any) {
    console.error('[WebhookAPI] Test failed:', err);
    res.status(500).json({ error: 'ServerError', message: err.message });
  }
});
