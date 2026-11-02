// Settings, Time periods (UI overhaul Phase 8, slice 1d): the usual periods load, dates show as
// DD-MM-YYYY, a new period starts at the next cycle with its name and year filled in, and the
// goal hours tester starts on the period that holds today.
// Run: NODE_PATH=$(npm root -g) node time-periods.cjs [--base http://localhost:5180]
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
  const smallText = (root) =>
    root.evaluate((d) => [...d.querySelectorAll('*')].filter((el) => [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 12).map((el) => el.textContent.trim().slice(0, 30)));
  const main = page.locator('main');

  await page.goto(`${base}/?view=app&as=owner#settings?tab=working-hours-periods`);
  await page.getByRole('heading', { name: 'Time periods', level: 2 }).waitFor({ timeout: 60000 });
  await page.waitForTimeout(600);
  check('with no periods, it says so', /No time periods yet/.test(await main.innerText()));

  await main.getByRole('button', { name: 'Load the usual periods' }).click();
  await page.getByRole('dialog', { name: /^Load the usual periods/ }).getByRole('button', { name: 'Load the usual periods' }).click();
  await page.waitForTimeout(1000);
  const table = page.getByRole('table', { name: 'Time periods' });
  check('the usual 12 periods are listed', (await table.locator('tbody tr').count()) === 12);
  check('dates are DD-MM-YYYY', /19-01-2026 to 18-02-2026/.test(await table.innerText()) && !/2026-01-19/.test(await main.innerText()));
  check('no text under 12 px', (await smallText(main)).length === 0, (await smallText(main)).slice(0, 5).join(' | '));

  // The usual periods end on 18-12-2026, so the next one starts on 19-12-2026.
  await main.getByRole('button', { name: 'New time period' }).click();
  const d = page.getByRole('dialog', { name: 'New time period' });
  await d.waitFor({ timeout: 5000 });
  check('a new period starts the day after the latest ends', (await d.getByLabel('First day').inputValue()) === '19-12-2026');
  check('and runs one cycle', (await d.getByLabel('Last day').inputValue()) === '18-01-2027');
  check('its name and year are filled in', (await d.getByLabel('Name', { exact: true }).inputValue()) === 'Dec19-Jan18' && (await d.getByLabel('Year', { exact: true }).inputValue()) === '2026-2027');
  check('the hours are left to type', (await d.getByLabel('Goal hours for a full time nurse').inputValue()) === '');
  await d.getByLabel('Goal hours for a full time nurse').fill('215');
  await d.getByRole('button', { name: 'Add the period' }).click();
  await d.waitFor({ state: 'detached', timeout: 5000 });
  const saved = await page.evaluate(() => [...window.__repo.col('workingHoursPeriods').values()].find((p) => p.name === 'Dec19-Jan18' && p.year === '2026-2027'));
  check('the new period is saved', saved && saved.startDate === '2026-12-19' && saved.endDate === '2027-01-18' && saved.workingHours === 215);

  // The tester starts on the period holding today.
  const from = await page.getByLabel('From', { exact: true }).inputValue();
  check('the tester starts on a period, not on 19-01-2026', /^19-\d{2}-2026$/.test(from) && from !== '19-01-2026', from);
  check('and shows its goal in hours', /\d+ h/.test(await page.getByRole('region', { name: /Goal hours for any dates/ }).innerText().catch(() => main.innerText())));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  check('no sideways scroll on a phone', (await page.evaluate(() => document.documentElement.scrollWidth)) <= 390);

  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})();
