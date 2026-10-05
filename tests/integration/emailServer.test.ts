/** Run after npm run build. Starts local servers only; never sends an email. */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { existsSync } from 'node:fs';

assert.equal(existsSync('build/server.js'), true, 'build the backend outside the public assets');
assert.equal(existsSync('dist/server.js'), false, 'the public build must contain no backend bundle');

async function availablePort(): Promise<number> {
  const socket = createServer();
  await new Promise<void>(resolve => socket.listen(0, '127.0.0.1', resolve));
  const port = (socket.address() as { port: number }).port;
  await new Promise<void>(resolve => socket.close(() => resolve()));
  return port;
}

for (const mode of ['dev', 'start', 'vite', 'preview']) {
  const port = await availablePort();
  const args = mode === 'vite' ? ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port)]
    : mode === 'preview' ? ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)]
    : ['--import', 'tsx', mode === 'dev' ? 'server/app.ts' : 'server.ts'];
  const child = spawn(process.execPath, args, { detached: true, stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PORT: String(port), NODE_ENV: mode === 'start' ? 'production' : 'development', GOOGLE_SMTP_USER: '', GOOGLE_APP_PASSWORD: '', SMTP_USER: '', SMTP_PASS: '' } });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (child.exitCode !== null) throw new Error(`${mode} exited: ${output}`);
      try {
        const response = await fetch(`${base}/api/health`);
        if (response.ok) {
          const json = await response.json();
          assert.equal(json.service, 'ClinicRoster API');
          ready = true; break;
        }
      } catch { /* wait for the local process to listen */ }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.equal(ready, true, `${mode} did not mount the API: ${output}`);
    for (const [path, method] of [['/api/email/test', 'POST'], ['/api/email/check', 'POST'], ['/api/email/status', 'GET']]) {
      const response = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json' }, ...(method === 'POST' ? { body: '{}' } : {}) });
      assert.equal(response.status, 401, `${mode} ${path} requires sign in`);
      assert.match(response.headers.get('content-type') || '', /application\/json/);
      assert.equal((await response.json()).error, 'Unauthorized');
    }
    const invalid = await fetch(base + '/api/email/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).error, 'RequestFailed');
    const page = await fetch(base);
    assert.equal(page.status, 200);
    assert.match(page.headers.get('content-type') || '', /text\/html/);
    for (const path of ['/server.js', '/%73erver.js', '/server%2ejs', '/server.js.map',
      '/build/server.js', '/%62uild%2fserver.js', '/dist/server.js',
      `/@fs${process.cwd()}/build/server.js`]) {
      assert.equal((await fetch(base + path)).status, 404, `${mode}: backend file blocked at ${path}`);
    }
    console.log(`PASS ${mode}: web app and protected email routes share one server; API errors stay JSON`);
  } finally {
    if (child.pid) { try { process.kill(-child.pid, 'SIGTERM'); } catch {} }
    await new Promise<void>(resolve => { if (child.exitCode !== null || child.signalCode !== null) resolve(); else child.once('exit', () => resolve()); });
  }
}
