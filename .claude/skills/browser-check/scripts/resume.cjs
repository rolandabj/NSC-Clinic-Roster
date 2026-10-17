// Resume a stopped publish (UI overhaul Phase 7, slice 7): a publish whose tab closed partway shows
// "Sending stopped after 1 of 4 nurses" on the roster screen and on Sent rosters; Resume emails only
// the nurses still waiting or not sent, from the same version, then writes the audit entry; and a
// new publish lists every nurse before sending, each with their receipt token.
// Run: NODE_PATH=$(npm root -g) node resume.cjs [--base http://localhost:5180]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const results = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });
  const col = (name) => page.evaluate((n) => [...window.__repo.col(n).values()], name);
  const smallText = (root) =>
    root.evaluate((d) => [...d.querySelectorAll('*')].filter((el) => [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 12).map((el) => el.textContent.trim().slice(0, 30)));

  // A publish that stopped 10 minutes ago: Amy emailed, Nina's email failed, Mary and Sara waiting.
  await page.goto(`${base}/?view=app#dashboard`);
  await page.locator('main').waitFor({ timeout: 60000 });
  await page.evaluate(() => {
    const ago = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const r = (id, status, extra = {}) => ({ email: `${id}@example.com`, nurseId: id, nurseName: id[0].toUpperCase() + id.slice(1), subject: '', bodyPreview: '', fullBodyHtml: '', status, ackToken: `ack-${id}`, ...extra });
    window.__repo.col('emailLog').set('pub-stopped', {
      id: 'pub-stopped', scheduleId: 'nov', versionId: 'v-nov-1', kind: 'PUBLISH', status: 'SENDING', sentAt: ago, updatedAt: ago,
      recipients: [r('amy', 'SENT'), r('mary', 'WAITING'), r('nina', 'FAILED', { errorMessage: 'Mailbox full' }), r('sara', 'WAITING')],
    });
  });
  await page.getByRole('link', { name: 'Rosters' }).first().click();
  await page.waitForSelector('[data-cell="mary|2026-11-16"]', { timeout: 60000 });
  await page.waitForTimeout(1500);

  // 1. The roster screen says it stopped.
  const notice = page.getByText(/^Sending stopped after 1 of 4 nurses/);
  check('the roster screen says sending stopped after 1 of 4 nurses', (await notice.count()) === 1);
  check('and that 3 nurses have not been sent', /3 nurses have not been sent/.test(await page.locator('main').innerText()));

  // 2. Resume.
  const versionsBefore = (await col('versions')).length;
  await page.getByRole('button', { name: 'Resume sending' }).click();
  const d = page.getByRole('dialog', { name: 'Resume sending?' });
  await d.waitFor({ timeout: 5000 });
  check('Resume names who is emailed now', /Mary, Nina, Sara/.test(await d.innerText()), (await d.innerText()).slice(0, 200));
  check('Resume says no new version is made', /No new version is made/.test(await d.innerText()));
  check('the dialog has no text under 12 px', (await smallText(d)).length === 0, (await smallText(d)).join(' | '));
  await d.getByRole('button', { name: 'Email 3 nurses' }).click();
  await d.getByRole('button', { name: 'Done' }).waitFor({ timeout: 60000 });
  check('it finishes and says so', /Sending of version 1 finished/.test(await d.innerText()));
  const log = (await col('emailLog')).find((l) => l.id === 'pub-stopped');
  check('only the waiting and failed nurses were emailed, Amy kept as sent', log.recipients.map((x) => `${x.nurseId}:${x.status}`).join(',') === 'amy:SENT,mary:MOCK_SENT,nina:MOCK_SENT,sara:MOCK_SENT', log.recipients.map((x) => `${x.nurseId}:${x.status}`).join(','));
  check('with the receipt tokens made before', log.recipients.every((x) => x.ackToken === `ack-${x.nurseId}`));
  check('the send is finished', log.status === 'SENT');
  check('no new version', (await col('versions')).length === versionsBefore);
  check('the audit entry is written', (await col('audit')).some((a) => /Resumed sending of version 1/.test(a.note)));
  await d.getByRole('button', { name: 'Done' }).click();
  await page.waitForTimeout(800);
  check('the notice goes', (await page.getByText(/^Sending stopped after/).count()) === 0);

  // 3. Sent rosters shows a stopped send too.
  await page.evaluate(() => {
    const ago = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    window.__repo.col('emailLog').set('pub-stopped-2', {
      id: 'pub-stopped-2', scheduleId: 'nov', versionId: 'v-nov-1', kind: 'CHANGE', status: 'SENDING', sentAt: ago, updatedAt: ago,
      recipients: [{ email: 'amy@example.com', nurseId: 'amy', nurseName: 'Amy', subject: '', bodyPreview: '', fullBodyHtml: '', status: 'WAITING', ackToken: 'ack-amy-2' }],
    });
  });
  await page.getByRole('link', { name: 'Sent rosters' }).first().click();
  await page.getByRole('heading', { name: 'Sent rosters', level: 1 }).waitFor({ timeout: 10000 });
  await page.waitForTimeout(1200);
  check('Sent rosters says sending stopped after 0 of 1 nurse', (await page.getByText(/^Sending stopped after 0 of 1 nurse/).count()) === 1);
  check('and offers Resume sending', (await page.getByRole('button', { name: 'Resume sending' }).count()) === 1);

  // 3b. Checkpoint 7: when nobody waiting can be emailed any more, the send is recorded as finished.
  await page.getByRole('button', { name: 'Resume sending' }).click();
  const d2 = page.getByRole('dialog', { name: 'Resume sending?' });
  await d2.getByRole('button', { name: 'Email 1 nurse' }).click();
  await d2.getByRole('button', { name: 'Done' }).waitFor({ timeout: 60000 });
  await d2.getByRole('button', { name: 'Done' }).click();
  await page.evaluate(() => {
    const ago = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    window.__repo.col('emailLog').set('pub-ghost', {
      id: 'pub-ghost', scheduleId: 'nov', versionId: 'v-nov-1', kind: 'PUBLISH', status: 'SENDING', sentAt: ago, updatedAt: ago,
      recipients: [{ email: 'gone@example.com', nurseId: 'gone', nurseName: 'Gone', subject: '', bodyPreview: '', fullBodyHtml: '', status: 'WAITING', ackToken: 'ack-gone' }],
    });
  });
  await page.getByRole('link', { name: 'Dashboard' }).first().click();
  await page.waitForTimeout(500);
  await page.getByRole('link', { name: 'Sent rosters' }).first().click();
  await page.getByRole('heading', { name: 'Sent rosters', level: 1 }).waitFor({ timeout: 10000 });
  await page.waitForTimeout(1200);
  await page.getByRole('button', { name: 'Resume sending' }).click();
  const d3 = page.getByRole('dialog', { name: 'Resume sending?' });
  check('nobody left to email offers Record as finished', /Gone: no longer listed/.test(await d3.innerText()) && (await d3.getByRole('button', { name: 'Record as finished' }).isEnabled()));
  await d3.getByRole('button', { name: 'Record as finished' }).click();
  await d3.getByRole('button', { name: 'Done' }).waitFor({ timeout: 30000 });
  await d3.getByRole('button', { name: 'Done' }).click();
  await page.waitForTimeout(800);
  check('and the notice goes', (await page.getByText(/^Sending stopped after/).count()) === 0 && (await col('emailLog')).find((l) => l.id === 'pub-ghost').status === 'FAILED');

  // 4. A new publish lists every nurse before sending, each with a receipt token.
  await page.goto(`${base}/?view=app&seed=clean#schedules?roster=nov`);
  await page.waitForSelector('[data-cell="amy|2026-11-18"]', { timeout: 60000 });
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: /^Publish/ }).first().click();
  await page.getByRole('menuitem', { name: /^Publish the roster/ }).click();
  const p = page.getByRole('dialog', { name: /^Publish November/ });
  await p.getByRole('button', { name: 'Continue' }).waitFor({ timeout: 15000 });
  await page.waitForFunction(() => ![...document.querySelectorAll('[role="dialog"] button')].some((b) => b.textContent.includes('Checking')), null, { timeout: 15000 }).catch(() => {});
  await p.getByRole('button', { name: 'Continue' }).click();
  await p.getByRole('button', { name: 'Preview the emails' }).click();
  await p.getByRole('button', { name: /^Publish and email/ }).click();
  await p.getByRole('button', { name: 'Done', exact: true }).waitFor({ timeout: 60000 });
  const pub = (await col('emailLog')).filter((l) => l.kind === 'PUBLISH').sort((a, b) => b.sentAt.localeCompare(a.sentAt))[0];
  check('the new publish kept a receipt token for each nurse', pub && pub.recipients.length > 0 && pub.recipients.every((x) => /^ack-/.test(x.ackToken)));
  check('and the time of its last email', pub && !!pub.updatedAt);

  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})();
