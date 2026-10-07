import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import type { AddressInfo } from 'node:net';
import { authRouter } from '../../server/routes/auth';

// The server's own copy of the privileges (GET /api/auth/me) must say what firestore.rules
// allow, like computePrivileges in the browser: planners and managers approve requests,
// only planners approve swaps, planners and managers download reports.
async function privilegesOf(user: Record<string, unknown>) {
  const app = express();
  app.use((req, _res, next) => {
    (req as any).user = user;
    next();
  });
  app.use('/api/auth', authRouter);
  const server = app.listen(0);
  try {
    const { port } = server.address() as AddressInfo;
    const res = await fetch(`http://127.0.0.1:${port}/api/auth/me`);
    return (await res.json()).privileges;
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

test('the server says a planner approves requests and swaps and downloads reports', async () => {
  const p = await privilegesOf({ uid: 'u2', email: 'planner@example.com', role: 'EDITOR', isManager: false });
  assert.deepEqual([p.canApproveLeave, p.canApproveAvailability, p.canApproveSwaps, p.canExportReports], [true, true, true, true]);
});

test('the server says a manager approves requests and downloads reports, but not swaps', async () => {
  const p = await privilegesOf({ uid: 'u3', email: 'manager@example.com', role: 'VIEWER', isManager: true });
  assert.deepEqual([p.canApproveLeave, p.canApproveAvailability, p.canApproveSwaps, p.canExportReports], [true, true, false, true]);
});

test('the server says a nurse approves nothing and downloads nothing', async () => {
  const p = await privilegesOf({ uid: 'u4', email: 'mary@example.com', role: 'VIEWER', isManager: false });
  assert.deepEqual([p.canApproveLeave, p.canApproveSwaps, p.canExportReports, p.canEditRosterAssignments], [false, false, false, false]);
});
