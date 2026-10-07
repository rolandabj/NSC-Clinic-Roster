import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GEMINI_MODEL, isGeminiKeyConfigured } from '../../server/services/gemini/geminiClient';
import express from 'express';
import type { AddressInfo } from 'node:net';
import { createApiApp } from '../../server/apiApp';
import { geminiRouter } from '../../server/routes/gemini';

test('Gemini model is configured to gemini-3.8-flash', () => {
  assert.equal(GEMINI_MODEL, 'gemini-3.8-flash');
});

test('isGeminiKeyConfigured handles presence or absence correctly', () => {
  const origKey = process.env.GEMINI_API_KEY;
  try {
    delete process.env.GEMINI_API_KEY;
    assert.equal(isGeminiKeyConfigured(), false);

    process.env.GEMINI_API_KEY = 'MY_GEMINI_API_KEY';
    assert.equal(isGeminiKeyConfigured(), false);

    process.env.GEMINI_API_KEY = 'valid-test-key-12345';
    assert.equal(isGeminiKeyConfigured(), true);
  } finally {
    if (origKey !== undefined) {
      process.env.GEMINI_API_KEY = origKey;
    } else {
      delete process.env.GEMINI_API_KEY;
    }
  }
});

/** Serves an app on a free port for one test, then closes it. */
async function withServer(app: express.Express, run: (base: string) => Promise<void>) {
  const server = app.listen(0);
  const { port } = server.address() as AddressInfo;
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

/** The Gemini routes alone, behind a signed in user (the full API checks the sign in itself). */
function signedInGeminiApp() {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { uid: 'u1', email: 'nurse@example.com', role: 'VIEWER' };
    next();
  });
  app.use('/api/gemini', geminiRouter);
  return app;
}

// The owner's decision of 2026-10-07: only signed in users may use the clinic's Gemini key.
test('the Gemini routes refuse anyone who is not signed in', async () => {
  await withServer(createApiApp(), async (base) => {
    const calls: Array<[string, string]> = [
      ['GET', '/api/gemini/status'],
      ['POST', '/api/gemini/generate'],
      ['POST', '/api/gemini/insights'],
    ];
    for (const [method, path] of calls) {
      const res = await fetch(`${base}${path}`, {
        method,
        headers: method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
        body: method === 'POST' ? JSON.stringify({ prompt: 'hello', scheduleName: 'November' }) : undefined,
      });
      assert.equal(res.status, 401, `${method} ${path} needs sign in`);
      assert.equal((await res.json()).error, 'Unauthorized');
    }
  });
});

test('GET /api/gemini/status returns 200 with model information to a signed in user', async () => {
  await withServer(signedInGeminiApp(), async (base) => {
    const res = await fetch(`${base}/api/gemini/status`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'ok');
    assert.equal(data.model, 'gemini-3.8-flash');
    assert.equal(typeof data.isKeyConfigured, 'boolean');
  });
});

test('POST /api/gemini/generate validates prompt input', async () => {
  await withServer(signedInGeminiApp(), async (base) => {
    const res = await fetch(`${base}/api/gemini/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
    assert.equal((await res.json()).error, 'BadRequest');
  });
});

test('POST /api/gemini/insights validates scheduleName input', async () => {
  await withServer(signedInGeminiApp(), async (base) => {
    const res = await fetch(`${base}/api/gemini/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
    assert.equal((await res.json()).error, 'BadRequest');
  });
});
