// Reports in plain words (UI overhaul Phase 8): the headings Goal, Worked, Leave and Difference
// (no OT or DEF), status words in normal case, the shared table and filters, a nurse's name that
// opens the timesheet, the three tabs kept in the address with Back, thin bars with their values,
// dates as DD-MM-YYYY, no text under 12 px, and no sideways scrolling on a phone.
// Run: NODE_PATH=$(npm root -g) node reports.cjs [--base http://localhost:5180] [--shots <folder>]
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
    root.evaluate((d) => [...d.querySelectorAll('*')].filter((el) => el.offsetParent !== null && [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 12).map((el) => el.textContent.trim().slice(0, 30)));

  await page.goto(`${base}/?view=app#reports`);
  await page.getByRole('heading', { name: 'Reports', level: 1 }).waitFor({ timeout: 60000 });
  const table = page.getByRole('table', { name: /^Hours for / });
  await table.waitFor({ timeout: 20000 });
  await page.waitForTimeout(500);
  const main = page.locator('main');
  if (shots) await page.screenshot({ path: `${shots}/reports-hours.png`, fullPage: true });

  // 1. Plain headings: Goal, Worked, Leave, Difference; no OT, DEF or capital status words.
  const terms = await main.locator('dt').allInnerTexts();
  check('the totals say Goal, Worked, Leave and Difference', ['Goal', 'Worked', 'Leave', 'Difference'].every((t) => terms.includes(t)), terms.join(', '));
  const headers = await table.locator('thead th').allInnerTexts();
  check('the columns say Goal, Worked, Leave, Difference and Status', ['Nurse', 'Goal', 'Worked', 'Leave', 'Difference', 'Status'].every((h) => headers.some((x) => x.trim() === h)), headers.join(' | '));
  const text = await main.innerText();
  const old = text.match(/\bOT\b|\bDEF\b|ON TARGET|DEFICIT|OVERTIME|EXCESS|Accounting|Ledger|Equity|Quotas|Fulfillment|Pace %/g) || [];
  check('no OT, DEF, capital status words or old jargon', old.length === 0, old.join(', '));
  const badges = await table.locator('tbody td:last-child').allInnerTexts();
  check('status words in normal case', badges.length > 0 && badges.every((b) => /^(On goal|A little short|Very short|A little over|Too many hours)$/.test(b.trim())), badges.slice(0, 4).join(', '));
  check('differences read as hours ahead or short', /\d h (ahead|short)|Even/.test(await table.innerText()));
  const roster = await page.getByLabel('Roster').locator('option').first().innerText();
  check('roster dates are DD-MM-YYYY', /\d{2}-\d{2}-\d{4}/.test(roster) && !/\d{4}-\d{2}-\d{2}/.test(roster), roster);
  check('no text under 12 px', (await smallText(main)).length === 0, (await smallText(main)).slice(0, 5).join(' | '));

  // 2. The filters narrow the table.
  const all = await table.locator('tbody tr').count();
  await page.getByRole('searchbox', { name: 'Search' }).fill('Mary');
  await page.waitForTimeout(300);
  check('the search keeps only Mary', (await table.locator('tbody tr').count()) === 1 && /Mary/.test(await table.innerText()), String(await table.locator('tbody tr').count()));
  await page.getByRole('searchbox', { name: 'Search' }).fill('nobody at all');
  await page.waitForTimeout(300);
  check('no match says so', /No nurse matches/.test(await main.innerText()));
  await page.getByRole('searchbox', { name: 'Search' }).fill('');
  await page.getByLabel('Contract').selectOption('PART');
  await page.waitForTimeout(300);
  const part = (await table.count()) ? await table.locator('tbody tr').count() : 0;
  check('the contract filter narrows the list', part < all, `${part} of ${all}`);
  await page.getByLabel('Contract').selectOption('ALL');

  // 3. A nurse's name opens the timesheet.
  await table.getByRole('button', { name: /: open the timesheet$/ }).first().click();
  const dlg = page.getByRole('dialog');
  await dlg.waitFor({ timeout: 5000 });
  check('a name opens the timesheet', /Share of goal/.test(await dlg.innerText()));
  await page.keyboard.press('Escape');
  await dlg.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});

  // 4. The tabs are in the address, and Back returns.
  await page.getByRole('tab', { name: 'Fairness' }).click();
  await page.waitForTimeout(400);
  check('Fairness is in the address', /#reports\?tab=fairness$/.test(page.url()), page.url());
  const bars = page.getByRole('list', { name: 'Weekend shifts for each nurse' });
  check('one weekend bar for each nurse', (await bars.locator('li').count()) === all, `${await bars.locator('li').count()} of ${all}`);
  const tallest = await bars.evaluate((l) => Math.max(...[...l.querySelectorAll('li > span:nth-child(2) > span')].map((b) => b.getBoundingClientRect().height)));
  check('the bars are thin (24 px or less)', tallest > 0 && tallest <= 24, String(tallest));
  check('each bar shows its value', /\d+ shifts?/.test(await bars.innerText()));
  if (shots) await page.screenshot({ path: `${shots}/reports-fairness.png`, fullPage: true });
  await page.goBack();
  await page.waitForTimeout(400);
  check('Back returns to Hours', (await page.getByRole('tab', { name: /^Hours/ }).getAttribute('aria-selected')) === 'true' && /#reports$/.test(page.url()), page.url());

  await page.getByRole('tab', { name: 'Leave allowance' }).click();
  await page.waitForTimeout(400);
  const leave = page.getByRole('table', { name: 'Leave allowance this year' });
  check('Leave allowance lists days used of the allowance', /\d+ of \d+ days?/.test(await leave.innerText()));
  check('no birth dates or emoji on the leave table', !/DOB|🎂/.test(await leave.innerText()));
  await leave.getByRole('button', { name: /^Timesheet of / }).first().click();
  await dlg.waitFor({ timeout: 5000 });
  check('Timesheet opens from the leave table', await dlg.isVisible());
  await page.keyboard.press('Escape');
  check('no text under 12 px on the other tabs', (await smallText(main)).length === 0, (await smallText(main)).slice(0, 5).join(' | '));

  // 5. A phone: cards instead of a wide table, no sideways scrolling.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { window.location.hash = 'reports'; });
  await page.waitForTimeout(800);
  const wide = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('no sideways scrolling at 390 px', wide <= 0, `${wide} px`);
  if (shots) await page.screenshot({ path: `${shots}/reports-phone.png`, fullPage: true });

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
