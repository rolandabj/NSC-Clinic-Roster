// A nurse's own requests on a phone (UI overhaul Phase 5, slice 2): the checks before sending,
// a sent request as a Waiting card that can be cancelled, and decided ones with the reviewer's note.
// Run: NODE_PATH=$(npm root -g) node my-requests.cjs [--base http://localhost:5180] [--shots <folder>]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const results = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });
  const cards = () => page.getByRole('region', { name: 'Coming up' }).getByRole('listitem').allInnerTexts();

  await page.goto(`${base}/?view=app&as=nurse#availability`);
  await page.getByRole('heading', { level: 1, name: 'My requests' }).waitFor({ timeout: 60000 });
  check('a nurse sees their requests as the page, without the planner heading', (await page.getByText('Availability, Leave').count()) === 0);
  // Decided requests, as the planner left them (shown once the list loads again).
  await page.evaluate(() => {
    window.__repo.col('leaveEntries').set('l-ok', { id: 'l-ok', nurseId: 'mary', leaveTypeId: 'lt-al', startDate: '2026-12-14', endDate: '2026-12-18', approved: true, status: 'APPROVED', reviewedByUserName: 'Pat Planner', reviewNotes: 'Enjoy the break.' });
    window.__repo.col('availabilityRequests').set('d-no', { id: 'd-no', nurseId: 'mary', date: '2026-12-23', available: false, status: 'REJECTED', reviewedByUserName: 'Pat Planner', reviewNotes: 'Please ask for another day.' });
  });

  // 1. Leave: the last day before the first is refused, under the field, with the focus on it.
  await page.getByRole('button', { name: 'Ask for leave' }).click();
  const leave = page.getByRole('dialog', { name: 'Ask for leave' });
  await leave.getByLabel('First day').fill('20-11-2026');
  await leave.getByLabel('Last day').fill('18-11-2026');
  await leave.getByRole('button', { name: 'Send request' }).click();
  await page.waitForTimeout(300);
  check('a last day before the first is refused, under the field', /The last day is before the first day/.test(await leave.innerText()));
  check('the focus goes to the field with the error', (await page.evaluate(() => document.activeElement?.getAttribute('aria-invalid'))) === 'true');
  if (shots) await page.screenshot({ path: `${shots}/requests-error.png` });
  await leave.getByLabel('Last day').fill('21-11-2026');
  await leave.getByRole('button', { name: 'Send request' }).click();
  await leave.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(800);
  let list = await cards();
  check('the sent leave is a Waiting card of the kind chosen', list.some((t) => /^Annual Leave/.test(t) && /20-11-2026 to 21-11-2026/.test(t) && /Waiting/.test(t)), list.join(' | ').slice(0, 200));
  check('decided requests show their status and the reviewer\'s note', list.some((t) => /Approved/.test(t) && /Pat Planner: Enjoy the break/.test(t)) && list.some((t) => /Declined/.test(t) && /another day/.test(t)));

  // 2. The same days again are refused.
  await page.getByRole('button', { name: 'Ask for leave' }).click();
  await leave.getByLabel('First day').fill('21-11-2026');
  await leave.getByLabel('Last day').fill('22-11-2026');
  await leave.getByRole('button', { name: 'Send request' }).click();
  await page.waitForTimeout(300);
  check('leave over days already asked for is refused', /You already asked for leave from 20-11-2026 to 21-11-2026/.test(await leave.innerText()));
  await leave.getByRole('button', { name: 'Cancel', exact: true }).click();

  // 3. A day off: a passed day is refused; a new one is sent.
  await page.getByRole('button', { name: 'Ask for a day off or a shift' }).click();
  const day = page.getByRole('dialog', { name: 'Ask for a day off or a shift' });
  await day.getByLabel('Day', { exact: true }).fill('01-01-2026');
  await day.getByRole('button', { name: 'Send request' }).click();
  await page.waitForTimeout(300);
  check('a day that has passed is refused', /This day has passed/.test(await day.innerText()));
  await day.getByLabel('Day', { exact: true }).fill('27-11-2026');
  await day.getByRole('button', { name: 'Send request' }).click();
  await day.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(800);
  list = await cards();
  check('the day off is a Waiting card', list.some((t) => /Day off/.test(t) && /27-11-2026/.test(t) && /Waiting/.test(t)));
  if (shots) await page.screenshot({ path: `${shots}/requests-390.png`, fullPage: true });

  // 4. A waiting request can be cancelled.
  const before = list.length;
  const dayCard = page.getByRole('region', { name: 'Coming up' }).getByRole('listitem').filter({ hasText: '27-11-2026' });
  await dayCard.getByRole('button', { name: 'Cancel request' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Cancel request' }).click({ timeout: 5000 });
  await page.waitForTimeout(1000);
  check('a waiting request can be cancelled', (await cards()).length === before - 1);

  // 5. When the requests cannot be loaded the page says so, with Try again, and sending waits (Checkpoint 5).
  await page.evaluate(() => { window.__repo.failReads = true; });
  await page.getByRole('button', { name: 'Ask for a day off or a shift' }).click();
  await day.getByLabel('Day', { exact: true }).fill('28-11-2026');
  await day.getByRole('button', { name: 'Send request' }).click();
  await day.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  await page.getByText("Your requests couldn't be loaded").waitFor({ timeout: 5000 }).catch(() => {});
  check('a failed load says so, not "no requests"', (await page.getByText("Your requests couldn't be loaded").count()) === 1 && (await page.getByText('You have no requests').count()) === 0);
  check('no new request can be sent until they load', await page.getByRole('button', { name: 'Ask for leave' }).isDisabled());
  await page.evaluate(() => { window.__repo.failReads = false; });
  await page.getByRole('button', { name: 'Try again' }).click();
  await page.waitForTimeout(800);
  check('Try again loads them', (await cards()).some((t) => /28-11-2026/.test(t)) && !(await page.getByRole('button', { name: 'Ask for leave' }).isDisabled()));

  const sizes = await page.evaluate(() => ({
    low: [...document.querySelectorAll('main button')].filter((b) => b.getBoundingClientRect().height < 44 && b.getBoundingClientRect().height > 0).map((b) => b.textContent.trim()),
    wide: document.documentElement.scrollWidth > window.innerWidth + 1,
  }));
  check('buttons are at least 44 px high', sizes.low.length === 0, sizes.low.join(', '));
  check('the page does not scroll sideways', !sizes.wide);
  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
