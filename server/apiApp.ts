/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shared ClinicRoster API
 * All clinic data lives in Cloud Firestore and is read and written by the
 * browser, protected by the Firestore security rules. This server only:
 *   - sends email through Google SMTP (credentials from AI Studio Secrets)
 *   - serves each nurse's private calendar feed (/calendar/TOKEN.ics)
 */

import express, { Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authMiddleware, requireAuth } from './middleware/auth';
import { authRouter } from './routes/auth';
import { emailRouter } from './routes/email';
import { calendarRouter } from './routes/calendar';

export function createApiApp() {
  const app = express();
  // The backend lives outside dist. Also block legacy bundles and Vite file
  // URLs, decoding first to match the static server's interpretation of a URL.
  app.use((req: Request, res: Response, next) => {
    let requestPath: string;
    try { requestPath = decodeURIComponent(req.path).replace(/\\/g, '/'); }
    catch { res.status(400).end(); return; }
    if (/(?:^|\/)(?:build|server\.js(?:\.map)?)(?:\/|$)/i.test(requestPath)) {
      res.status(404).end(); return;
    }
    next();
  });
  // The app runs behind one hosting proxy: use the visitor's address it passes on,
  // so each visitor gets their own rate limit instead of everyone sharing one.
  app.set('trust proxy', 1);

  // Security Headers via Helmet
  // Configured to allow iframe rendering in AI Studio preview and seamless Firebase Auth signInWithPopup
  // COOP (Cross-Origin-Opener-Policy) MUST be false so popup window.opener is not severed by the browser
  app.use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      originAgentCluster: false,
    })
  );

  // Explicitly ensure no Cross-Origin-Opener-Policy header is attached that would block Firebase popups
  app.use((_req: Request, res: Response, next) => {
    res.removeHeader('Cross-Origin-Opener-Policy');
    res.removeHeader('Cross-Origin-Embedder-Policy');
    next();
  });

  // Limit on authentication and email endpoints
  const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'TooManyRequests',
      message: 'Rate limit exceeded: please wait a minute and try again.',
    },
  });

  // No CORS middleware: the browser app is served from this same origin, so
  // cross origin calls to the API are not needed and are not allowed.
  app.use(express.json({ limit: '5mb' }));
  // Publishing sends one request per nurse, so roster emails get their own, higher limit
  // (a clinic of 60+ nurses would otherwise be cut off partway through a publish).
  const emailRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'TooManyRequests', message: 'Too many emails in a minute: please wait a minute and retry the ones not sent.' },
  });
  app.use('/api/email', emailRateLimiter);
  app.use('/api', (req: Request, res: Response, next) => (req.path.startsWith('/email/') ? next() : apiRateLimiter(req, res, next)));
  // Nurse calendar feeds (no sign in). Calendar apps check every few hours, so a
  // modest limit is plenty and stops anyone trying tokens in bulk.
  const calendarRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many calendar requests: please wait a minute and try again.',
  });
  app.use('/calendar', calendarRateLimiter);
  app.use(calendarRouter);
  app.use(authMiddleware);

  // Every API route requires a signed in, approved user, except these.
  const PUBLIC_API_ROUTES: Array<{ method: string; pattern: RegExp }> = [
    { method: 'GET', pattern: /^\/api\/health$/ },
    { method: 'GET', pattern: /^\/api\/auth\/(me|verify)$/ },
    { method: 'POST', pattern: /^\/api\/auth\/logout$/ },
  ];
  app.use('/api', (req: Request, res: Response, next) => {
    const fullPath = (req.baseUrl + req.path).replace(/\/+$/, '') || '/';
    const isPublic = PUBLIC_API_ROUTES.some((r) => r.method === req.method && r.pattern.test(fullPath));
    if (isPublic) return next();
    return requireAuth(req, res, next);
  });

  // Public liveness check: reveals nothing about the server.
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), service: 'ClinicRoster API' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api', emailRouter);

  // Unknown API routes
  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'NotFound', message: 'Unknown API endpoint.' });
  });

  // Parser and route failures must stay JSON instead of Express HTML error pages.
  app.use('/api', (err: any, _req: Request, res: Response, _next: express.NextFunction) => {
    const status = err?.status === 413 ? 413 : err?.status === 400 ? 400 : 500;
    res.status(status).json({ error: 'RequestFailed', message: status === 413 ? 'The email request is too large.' : status === 400 ? 'The email request could not be read.' : 'The email service could not complete the request.' });
  });
  return app;
}
