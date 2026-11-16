// Approved availability and publication freshness checks with the fake browser repository.
// Run: NODE_PATH=$(npm root -g) node publication-availability.cjs [--base http://localhost:5179]
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
(async () => {
  const browser = await chromium.launch();
  const errors = []; let checks = 0;
  const check = (ok, message) => { assert.ok(ok, message); checks++; console.log('PASS ' + message); };
  async function fixture(status) {
    const page = await browser.newPage({ viewport: { width: 1366, height: 950 } });
    page.on('pageerror', e => errors.push(String(e)));
    await page.route('https://fonts.googleapis.com/**', r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await page.route('**/favicon.ico', r => r.fulfill({ status: 204 }));
    await page.goto(base + '/?view=app&seed=clean#nurses');
    await page.getByRole('button', { name: 'Edit Amy', exact: true }).waitFor();
    await page.evaluate(async status => {
      if (status) await window.__repo.create('availabilityRequests', {
        id: 'dayoff', nurseId: 'amy', date: '2026-11-18', available: false, status,
        submittedByNurseId: 'amy', submittedAt: '2026-11-15T10:00:00Z',
      });
      if (status === 'APPROVED') await window.__repo.create('availabilityRequests', {
        id: 'shift-preference', nurseId: 'amy', date: '2026-11-18', available: true, status: 'APPROVED', preferredDutyWindowId: 'd921',
        submittedByNurseId: 'amy', submittedAt: '2026-11-15T11:00:00Z',
      });
      location.hash = 'schedules?roster=nov';
    }, status);
    await page.locator('[data-cell="amy|2026-11-18"]').waitFor();
    return page;
  }
  async function openPublish(page) {
    await page.getByRole('button', { name: /^Publish/ }).first().click();
    await page.getByRole('menuitem', { name: /^Publish the roster/ }).click();
    const dialog = page.getByRole('dialog', { name: /^Publish November/ });
    await dialog.waitFor();
    await dialog.getByRole('button', { name: 'Continue', exact: true }).waitFor();
    return dialog;
  }
  const approved = await fixture('APPROVED');
  const approvedDialog = await openPublish(approved);
  await approvedDialog.getByText(/Amy has an approved day off/).waitFor();
  check(await approvedDialog.getByRole('button', { name: 'Continue', exact: true }).isDisabled(), 'an approved day off without a pin blocks publication');
  check(await approved.evaluate(() => [...window.__repo.col('locks').values()].length) === 0, 'approved availability is enforced without creating a pin');
  await approved.close();
  for (const status of ['PENDING', 'REJECTED']) {
    const page = await fixture(status); const dialog = await openPublish(page);
    check(await dialog.getByRole('button', { name: 'Continue', exact: true }).isEnabled(), status.toLowerCase() + ' wishes do not become hard publication restrictions');
    await page.close();
  }
  const unavailable = await fixture();
  await unavailable.evaluate(() => {
    const repo = window.__repo, original = repo.list.bind(repo);
    repo.list = async (collection, ...args) => {
      if (collection === 'availabilityRequests') throw new Error('Availability unavailable for browser check');
      return original(collection, ...args);
    };
  });
  const unavailableDialog = await openPublish(unavailable);
  await unavailableDialog.getByText(/Clinic availability and roster history could not be checked/).waitFor();
  check(await unavailableDialog.getByRole('button', { name: 'Continue', exact: true }).isDisabled(), 'unavailable availability data blocks publication instead of acting empty');
  check(await unavailable.evaluate(() => [...window.__repo.col('versions').values()].filter(v => v.isPublished).length) === 0, 'a failed input read saves no published version');
  await unavailable.close();
  const stale = await fixture(); const staleDialog = await openPublish(stale);
  check(await staleDialog.getByRole('button', { name: 'Continue', exact: true }).isEnabled(), 'the checked clean roster can reach the preview');
  await staleDialog.getByRole('button', { name: 'Continue', exact: true }).click();
  await staleDialog.getByLabel('Note for this version').fill('Availability freshness test');
  await staleDialog.getByRole('button', { name: 'Preview the emails', exact: true }).click();
  const before = await stale.evaluate(() => ({ versions: [...window.__repo.col('versions').values()].filter(v => v.isPublished).length,
    logs: window.__repo.col('emailLog').size, links: window.__repo.col('shareLinks').size }));
  await stale.evaluate(() => window.__repo.col('availabilityRequests').set('approved-after-preview', {
    id: 'approved-after-preview', nurseId: 'amy', date: '2026-11-18', available: false, status: 'APPROVED',
    submittedByNurseId: 'amy', submittedAt: '2026-11-15T10:00:00Z',
  }));
  await staleDialog.getByRole('button', { name: /^Publish (and email|without emails)/ }).click();
  await stale.getByText(/roster or clinic details changed/).first().waitFor();
  const after = await stale.evaluate(() => ({ versions: [...window.__repo.col('versions').values()].filter(v => v.isPublished).length,
    logs: window.__repo.col('emailLog').size, links: window.__repo.col('shareLinks').size }));
  check(JSON.stringify(before) === JSON.stringify(after), 'an approval after preview creates no published version, email log or share link');
  await stale.close();
  const unfilled = await fixture();
  const savedBefore = await unfilled.evaluate(() => JSON.stringify({ shifts: [...window.__repo.col('assignments').values()], versions: [...window.__repo.col('versions').values()] }));
  await unfilled.evaluate(() => {
    const repo = window.__repo, list = repo.list.bind(repo);
    repo.list = async (collection, ...args) => { if (collection === 'availabilityRequests') throw new Error('Availability unavailable for fill'); return list(collection, ...args); };
  });
  await unfilled.getByRole('button', { name: /Fill roster/ }).click();
  await unfilled.getByRole('menuitem', { name: /Fill empty cells only/ }).click();
  const blockedFill = unfilled.getByRole('dialog', { name: /Fill/ });
  await blockedFill.waitFor();await blockedFill.getByRole('button', { name: /^Fill/ }).last().click();
  await unfilled.getByText(/Not filled: the clinic details could not be loaded/).first().waitFor();
  check(true, 'a failed availability read stops filling before any changes');
  check(savedBefore === await unfilled.evaluate(() => JSON.stringify({ shifts: [...window.__repo.col('assignments').values()], versions: [...window.__repo.col('versions').values()] })), 'a failed fill changes neither saved shifts nor backup versions');
  await unfilled.close();
  const refreshed = await fixture('PENDING');
  await refreshed.evaluate(async () => {
    const repo = window.__repo;
    const duty = [...repo.col('assignments').values()].find(a => a.nurseId === 'amy');
    await repo.update('assignments', duty.id, { source: 'MANUAL' });
    const requests = repo.col('availabilityRequests');
    requests.set('dayoff', { ...requests.get('dayoff'), status: 'APPROVED' });
  });
  await refreshed.getByRole('button', { name: /Fill roster/ }).click();
  await refreshed.getByRole('menuitem', { name: /Fill empty cells only/ }).click();
  const fill = refreshed.getByRole('dialog', { name: /Fill/ });
  await fill.waitFor();await fill.getByRole('button', { name: /^Fill/ }).last().click();
  await fill.waitFor({ state: 'detached', timeout: 60000 });
  await refreshed.evaluate(() => { location.hash = 'schedules?roster=nov&sheet=problems'; });
  await refreshed.getByText(/Amy has an approved day off/).first().waitFor({ timeout: 5000 });
  check(true, 'a fill refreshes stale pending availability before checking the saved duties');
  check(await refreshed.getByText(/Amy asked for.*waiting for approval/).count() === 0, 'the roster does not keep the old pending request after the fresh fill');
  await refreshed.close();
  check(errors.length === 0, 'no browser page errors');
  console.log('TOTAL ' + checks + ' checks');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
