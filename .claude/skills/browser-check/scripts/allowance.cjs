// Only the allowances set count (the owner's rule of 17-10-2026): a nurse whose box for a kind of
// leave is empty has 0 days of it, so the leave editor refuses that leave and the hours report
// shows 0 of 0 days, never an assumed 30. A box set to 0 saves as 0 and opens as 0.
// Run: NODE_PATH=$(npm root -g) node allowance.cjs [--base http://localhost:5180] [--shots <folder>]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  await context.addInitScript(() => {
    // October 2026 on every run, whatever the real date.
    const fixed = new Date('2026-10-14T09:00:00').getTime();
    const RealDate = Date;
    // eslint-disable-next-line no-global-assign
    Date = class extends RealDate {
      constructor(...a) {
        super(...(a.length ? a : [fixed]));
      }
      static now() {
        return fixed;
      }
    };
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const results = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });
  const go = async (hash, heading) => {
    await page.evaluate((h) => { window.location.hash = h; }, hash);
    await page.getByRole('heading', { level: 1, name: heading }).waitFor({ timeout: 10000 });
    await page.waitForTimeout(500);
  };

  await page.goto(`${base}/?view=app#nurses`);
  await page.getByRole('heading', { level: 1, name: 'Nurses' }).waitFor({ timeout: 60000 });

  // 1. The editor: an empty box saves as no allowance, and its hint says that means none.
  await page.getByRole('button', { name: 'Edit Sara' }).click();
  const sara = page.getByRole('dialog', { name: 'Edit Sara' });
  check('the hint says an empty box or 0 means 0 days', /An empty box or 0 means 0 days, so that leave is refused until days are set/.test(await sara.innerText()));
  await sara.getByLabel(/^Annual Leave/).fill('');
  await sara.getByRole('button', { name: 'Save changes' }).click();
  await sara.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  const saraQuotas = await page.evaluate(() => window.__repo.col('nurses').get('sara').leaveQuotas);
  check('an empty box saves no allowance', saraQuotas && saraQuotas['lt-al'] === undefined, JSON.stringify(saraQuotas));

  // 2. A box set to 0 saves as 0 and opens as 0 (it was dropped before).
  await page.getByRole('button', { name: 'Edit Amy' }).click();
  const amy = page.getByRole('dialog', { name: 'Edit Amy' });
  await amy.getByLabel(/^Annual Leave/).fill('0');
  await amy.getByRole('button', { name: 'Save changes' }).click();
  await amy.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  check('a box set to 0 saves as 0', (await page.evaluate(() => window.__repo.col('nurses').get('amy').leaveQuotas['lt-al'])) === 0);
  await page.getByRole('button', { name: 'Edit Amy' }).click();
  check('and opens as 0', (await page.getByRole('dialog', { name: 'Edit Amy' }).getByLabel(/^Annual Leave/).inputValue()) === '0');
  await page.keyboard.press('Escape');

  // 3. The leave editor refuses leave without an allowance, and says why.
  await go('availability', 'Leave and days off');
  await page.getByRole('button', { name: 'Sara, Thu 22-10-2026: no leave', exact: true }).click();
  await page.getByRole('button', { name: 'Sara, Thu 22-10-2026: no leave, first day of the new leave', exact: true }).click();
  const dlg = page.getByRole('dialog');
  await dlg.waitFor({ timeout: 5000 });
  await dlg.getByLabel('Leave Type').selectOption('lt-al');
  const dlgText = await dlg.innerText();
  check('the leave editor says Sara has no Annual Leave allowance', /Sara has no Annual Leave allowance for 2026/.test(dlgText), dlgText.slice(0, 300));
  check('and Save is turned off', await dlg.getByRole('button', { name: 'Save Leave Entry' }).isDisabled());
  if (shots) await page.screenshot({ path: `${shots}/allowance-refused.png` });
  await page.keyboard.press('Escape');
  await dlg.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  const saraLeave = await page.evaluate(() => [...window.__repo.col('leaveEntries').values()].filter((l) => l.nurseId === 'sara').length);
  check('no leave was saved for Sara', saraLeave === 0, String(saraLeave));

  // 4. A nurse with an allowance can still take leave.
  await page.getByRole('button', { name: 'Mary, Thu 22-10-2026: no leave', exact: true }).click();
  await page.getByRole('button', { name: 'Mary, Thu 22-10-2026: no leave, first day of the new leave', exact: true }).click();
  await dlg.waitFor({ timeout: 5000 });
  await dlg.getByLabel('Leave Type').selectOption('lt-al');
  check('a nurse with 30 days can take leave', /1 \/ 30 days used|0 \/ 30 days used/.test(await dlg.innerText()) && !(await dlg.getByRole('button', { name: 'Save Leave Entry' }).isDisabled()));
  await page.keyboard.press('Escape');

  // 5. The hours report shows the allowances as set: 0 for Sara, never an assumed 30.
  await go('reports', 'Hours Accounting & Payroll Ledger');
  await page.getByRole('button', { name: /Leave Quotas/ }).click();
  await page.waitForTimeout(500);
  const row = (name) => page.locator('tbody tr').filter({ hasText: name }).first().innerText();
  const saraRow = await row('Sara');
  check("Sara's row shows 0 of 0 days", /0 \/ 0 days/.test(saraRow) && !/\/ 30 days/.test(saraRow), saraRow.replace(/\s+/g, ' '));
  const maryRow = await row('Mary');
  check("Mary's row shows her 30 days", /\/ 30 days/.test(maryRow), maryRow.replace(/\s+/g, ' '));
  if (shots) await page.screenshot({ path: `${shots}/allowance-report.png` });

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
