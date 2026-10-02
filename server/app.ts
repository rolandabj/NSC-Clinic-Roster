/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ClinicRoster Server
 * All clinic data lives in Cloud Firestore and is read and written by the
 * browser, protected by the Firestore security rules. This server only:
 *   - serves the web app (Vite middleware in development, the built bundle in production)
 *   - sends email through Google SMTP (credentials from AI Studio Secrets)
 *   - serves each nurse's private calendar feed (/calendar/TOKEN.ics)
 */

import express, { Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { authMiddleware, requireAuth } from './middleware/auth';
import { authRouter } from './routes/auth';
import { emailRouter } from './routes/email';
import { calendarRouter } from './routes/calendar';

export async function startServer() {
  const app = express();
  // The app runs behind one hosting proxy: use the visitor's address it passes on,
  // so each visitor gets their own rate limit instead of everyone sharing one.
  app.set('trust proxy', 1);
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProduction = process.env.NODE_ENV === 'production';

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

  // Frontend Integration: Vite middleware in development, static bundle in production
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    // The bundled server code lives in dist/ too; never serve it to browsers.
    app.use((req: Request, res: Response, next) => {
      if (/^\/server\.js(\.map)?$/i.test(req.path)) {
        res.status(404).end();
        return;
      }
      next();
    });
    app.use(express.static(distPath));
    // A missing script or style file must be a real 404, not the app page:
    // the browser then reports a load error that the app can recover from.
    app.use('/assets', (_req: Request, res: Response) => {
      res.status(404).end();
    });
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `ClinicRoster server listening on http://0.0.0.0:${PORT} [${isProduction ? 'production' : 'development'}]`
    );
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting ClinicRoster server:', err);
  process.exit(1);
});
