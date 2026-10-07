import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GEMINI_MODEL, isGeminiKeyConfigured } from '../../server/services/gemini/geminiClient';
import { createApiApp } from '../../server/apiApp';

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

test('GET /api/gemini/status returns 200 with model information', async () => {
  const app = createApiApp();
  const server = app.listen(0);
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 3000;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/gemini/status`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'ok');
    assert.equal(data.model, 'gemini-3.8-flash');
    assert.equal(typeof data.isKeyConfigured, 'boolean');
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test('POST /api/gemini/generate validates prompt input', async () => {
  const app = createApiApp();
  const server = app.listen(0);
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 3000;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/gemini/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.error, 'BadRequest');
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test('POST /api/gemini/insights validates scheduleName input', async () => {
  const app = createApiApp();
  const server = app.listen(0);
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 3000;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/gemini/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.error, 'BadRequest');
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
