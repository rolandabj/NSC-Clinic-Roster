/** Serves the shared API and the web app from the same origin. */
import express, { Request, Response } from 'express';
import path from 'path';
import { createApiApp } from './apiApp';

export async function startServer() {
  const app = createApiApp();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProduction = process.env.NODE_ENV === 'production';

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
