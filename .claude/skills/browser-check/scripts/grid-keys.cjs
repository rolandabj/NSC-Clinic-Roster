// The roster grid's keyboard and spoken names (UI overhaul Phase 4, slice 4): one Tab stop in the
// grid, the arrow keys reaching the nurses' hours and the days' totals, the line under the grid,
// the zoom buttons, and axe's check that each cell's name starts with what it shows.
// Run: NODE_PATH=$(npm root -g) node grid-keys.cjs [--base http://localhost:5180]
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
  const focused = () => page.evaluate(() => document.activeElement?.getAttribute('data-cell'));
  const status = () => page.evaluate(() => document.querySelector('[role=grid]').closest('.flex-col').lastElementChild?.textContent || '');

  await page.goto(`${base}/?view=schedules`);
  await page.waitForSelector('[data-cell="mary|2026-11-16"]', { timeout: 60000 });
  await page.waitForTimeout(800);

  // 1. One Tab stop in the whole grid: the problem marks in the headings are not Tab stops.
  const stops = await page.evaluate(() => [...document.querySelectorAll('[role=grid] [tabindex="0"], [role=grid] button:not([tabindex="-1"])')].length);
  check('one Tab stop in the grid', stops === 1, `${stops}`);
  check('the headings have problem marks (for the mouse)', (await page.locator('thead button[tabindex="-1"]').count()) > 0);

  // 2. The arrow keys reach a nurse's hours and a day's totals, which read out their problems.
  await page.focus('[data-cell="sara|2026-11-29"]');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  check('Arrow right from the last day reaches the hours', (await focused()) === 'sara|hours');
  const hours = await page.evaluate(() => document.activeElement.textContent);
  check('the hours are read out in words', /^Hours, Sara: \d+ hours on these days/.test(hours), hours.slice(0, 80));
  check('the line under the grid names the hours', /Hours, Sara/.test(await status()));
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(200);
  check('the empty corner is not reached', (await focused()) === 'sara|hours');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(200);
  check('Arrow down from the last nurse reaches the day totals', (await focused()) === 'totals|2026-11-29');
  const totals = await page.evaluate(() => document.activeElement.textContent);
  check('the totals are read out with the day\'s problems', /^Day totals, Sun 29-11-2026: .*problems?, (must fix|to check): /.test(totals), totals.slice(0, 120));
  await page.keyboard.press('Enter');
  await page.keyboard.press('Delete');
  await page.waitForTimeout(300);
  check('Enter and Delete do nothing on the totals', (await page.locator('[role=dialog]').count()) === 0 && (await focused()) === 'totals|2026-11-29');
  await page.keyboard.press('ArrowUp');
  await page.waitForTimeout(200);
  check('Arrow up goes back to the cells', (await focused()) === 'sara|2026-11-29');

  // 3. The line under the grid says what the selected cell holds.
  await page.focus('[data-cell="mary|2026-11-16"]');
  await page.waitForTimeout(200);
  check('the line under the grid says what the cell holds', /Mary, 16-11-2026: Lee #1 09:00 to 17:00, \w+ shift/.test(await status()), (await status()).slice(0, 100));

  // 4. The zoom buttons say which level is on.
  check('100 % is pressed', (await page.getByRole('button', { name: '100%' }).getAttribute('aria-pressed')) === 'true');
  await page.getByRole('button', { name: '115%' }).click();
  check('115 % is pressed after a click', (await page.getByRole('button', { name: '115%' }).getAttribute('aria-pressed')) === 'true' && (await page.getByRole('button', { name: '100%' }).getAttribute('aria-pressed')) === 'false');
  await page.getByRole('button', { name: '100%' }).click();

  // 5. Each cell's spoken name starts with what it shows.
  const mismatched = await page.evaluate(() =>
    [...document.querySelectorAll('td[data-cell][aria-label]')].filter((td) => {
      const shown = td.innerText.replace(/\s+/g, ' ').trim();
      return shown !== '—' && shown !== '' && !td.getAttribute('aria-label').startsWith(shown);
    }).map((td) => `${td.dataset.cell}: "${td.innerText.replace(/\s+/g, ' ')}"`)
  );
  check('every spoken cell name starts with what the cell shows', mismatched.length === 0, mismatched.slice(0, 3).join('; '));

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
