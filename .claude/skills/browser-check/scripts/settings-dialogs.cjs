// The Settings dialogs on the shared Dialog (UI overhaul Phase 7, slice 4): kinds of leave,
// shifts, nurse levels, nurse skills, specialties, public holidays, time periods, data and
// backup, and adding a person. Each opens with its title, has no text under 12 px, and Esc
// closes it; a few save, to show the fields still work.
// Run: NODE_PATH=$(npm root -g) node settings-dialogs.cjs [--base http://localhost:5180] [--shots <folder>]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const results = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });
  const smallText = (root) =>
    root.evaluate((d) => [...d.querySelectorAll('*')].filter((el) => [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 12).map((el) => el.textContent.trim().slice(0, 30)));
  const smallTargets = (root) =>
    root.evaluate((d) => [...d.querySelectorAll('button, input:not([type="hidden"]):not([aria-hidden="true"]), select')].filter((b) => { const r = (b.closest('label') || b).getBoundingClientRect(); return r.width && (r.width < 24 || r.height < 24); }).length);

  await page.goto(`${base}/?view=app&as=owner#dashboard`);
  await page.locator('main').waitFor({ timeout: 60000 });
  const open = async (tab, button, title) => {
    await page.evaluate((t) => { window.location.hash = `settings?tab=${t}`; }, tab);
    await page.waitForTimeout(800);
    await page.getByRole('button', { name: button }).first().click();
    const d = page.getByRole('dialog', { name: title }).or(page.getByRole('alertdialog', { name: title }));
    const ok = await d.first().waitFor({ timeout: 5000 }).then(() => true, () => false);
    check(`${title} opens`, ok);
    if (!ok) return null;
    // Measured after the dialog's zoom in (it opens at 95%).
    await page.waitForTimeout(400);
    const small = await smallText(d.first());
    check(`${title} has no text under 12 px`, small.length === 0, small.join(' | '));
    check(`${title} has no target under 24 px`, (await smallTargets(d.first())) === 0);
    return d.first();
  };
  const esc = async (d, title) => {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    check(`Esc closes ${title}`, (await d.count()) === 0);
  };

  let d = await open('leave', /^Add Leave Type/, 'Add a kind of leave');
  if (d) {
    await d.getByLabel('Name', { exact: true }).fill('Study leave');
    await d.getByLabel('Short name').fill('ST');
    await d.getByRole('button', { name: /^Use the colour / }).first().click();
    check('a ready colour shows as chosen', (await d.locator('button[aria-pressed="true"]').count()) === 1);
    if (shots) await page.screenshot({ path: `${shots}/settings-leave.png` });
    await d.getByRole('button', { name: 'Add the kind of leave' }).click();
    await page.waitForTimeout(600);
    check('the kind of leave is saved', await page.evaluate(() => [...window.__repo.col('leaveTypes').values()].some((l) => l.acronym === 'ST' && l.name === 'Study leave')));
  }
  d = await open('duties', /^Add shift/, 'Add a shift');
  if (d) await esc(d, 'Add a shift');
  d = await open('seniority', /^Add Seniority Level/, 'Add a nurse level');
  if (d) await esc(d, 'Add a nurse level');
  d = await open('clinical-roles', /^Add skill/, 'Add a nurse skill');
  if (d) await esc(d, 'Add a nurse skill');
  d = await open('specialties', /^Add Specialty/, 'Add a specialty');
  if (d) await esc(d, 'Add a specialty');
  d = await open('holidays', /^Add Public Holiday/, 'Add a public holiday');
  if (d) {
    await d.getByLabel('Name', { exact: true }).fill('Test Day');
    await d.getByLabel('Date', { exact: true }).fill('02-12-2026');
    await d.getByRole('button', { name: 'Add the public holiday' }).click();
    await page.waitForTimeout(600);
    check('the holiday date typed as DD-MM-YYYY is saved', await page.evaluate(() => [...window.__repo.col('holidays').values()].some((h) => h.name === 'Test Day' && h.date === '2026-12-02')));
  }
  d = await open('working-hours-periods', /^Add Dedicated Period/, 'New time period');
  if (d) {
    await d.getByLabel('Year', { exact: true }).fill('2027');
    await d.getByLabel('Name', { exact: true }).fill('Test');
    await d.getByLabel('First day').fill('10-01-2027');
    await d.getByLabel('Last day').fill('01-01-2027');
    await d.getByLabel('Goal hours for a full time nurse').fill('200');
    await d.getByRole('button', { name: 'Add the period' }).click();
    check('a period that ends before it starts is refused in the dialog', /The last day is before the first day/.test(await d.innerText()));
    await esc(d, 'New time period');
  }
  d = await open('database', /^Delete all clinic data/, 'Delete all clinic data?');
  if (d) {
    check('Delete waits for CLEAR', await d.getByRole('button', { name: 'Download a backup and delete' }).isDisabled());
    await esc(d, 'Delete all clinic data?');
  }
  d = await open('database', /^Restore from a backup/, 'Restore from a backup');
  if (d) await esc(d, 'Restore from a backup');
  d = await open('access-roles', /^Pre-Approve User/, 'Add a person');
  if (d) {
    if (shots) await page.screenshot({ path: `${shots}/settings-person.png` });
    await esc(d, 'Add a person');
  }

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
