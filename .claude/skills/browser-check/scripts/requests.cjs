// Requests as its own screen (UI overhaul Phase 6, slice 4): the menu item with the number
// waiting, the Waiting tab with dates as DD-MM-YYYY and a question before each decision, the
// All tab in the address, "Leave and days off" for planners and "My requests" for others.
// Run: NODE_PATH=$(npm root -g) node requests.cjs [--base http://localhost:5180] [--shots <folder>]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const results = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });
  const open = async (as, hash, size = { width: 1366, height: 900 }) => {
    const page = await browser.newPage({ viewport: size });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`${base}/?view=app&as=${as}#${hash}`);
    await page.locator('main').waitFor({ timeout: 60000 });
    await page.waitForTimeout(500);
    return page;
  };
  const menu = (page) => page.getByRole('navigation').first();

  // 1. A planner: Requests in the menu with the number waiting.
  const page = await open('owner', 'dashboard');
  await page.evaluate(() => {
    window.__repo.col('leaveEntries').set('lv-wait', { id: 'lv-wait', nurseId: 'mary', leaveTypeId: 'lt-al', startDate: '2026-11-20', endDate: '2026-11-22', approved: false, status: 'PENDING', note: 'Family visit' });
    window.__repo.col('availabilityRequests').set('av-wait', { id: 'av-wait', nurseId: 'amy', date: '2026-11-18', available: false, status: 'PENDING' });
  });
  await menu(page).getByRole('link', { name: /^Requests/ }).click();
  await page.getByRole('heading', { level: 1, name: 'Requests' }).waitFor({ timeout: 10000 });
  await page.waitForTimeout(500);
  check('the menu names Requests with the number waiting', (await menu(page).getByRole('link', { name: 'Requests, 2 waiting' }).count()) === 1);
  check('the menu calls Availability "Leave and days off" for a planner', (await menu(page).getByRole('link', { name: 'Leave and days off' }).count()) === 1);
  const text = await page.locator('main').innerText();
  check('a waiting leave reads with its dates as DD-MM-YYYY', /Annual Leave, Fri 20-11-2026 to Sun 22-11-2026/.test(text), text.slice(0, 300));
  check('a waiting day off reads in words', /Day off on Wed 18-11-2026/.test(text));
  check('no date reads as YYYY-MM-DD and nothing says Pending', !/\d{4}-\d{2}-\d{2}/.test(text) && !/pending/i.test(text));
  if (shots) await page.screenshot({ path: `${shots}/requests-1366.png` });

  // 2. A decision asks first, keeps the note and lowers the count.
  await page.getByRole('button', { name: /^Approve Mary: Annual Leave/ }).click();
  const ask = page.getByRole('dialog', { name: "Approve Mary's request?" });
  await ask.waitFor({ timeout: 5000 });
  check('the question says what is decided', /Annual Leave, Fri 20-11-2026 to Sun 22-11-2026/.test(await ask.innerText()));
  await ask.getByLabel('Note for the nurse').fill('Enjoy it.');
  await ask.getByRole('button', { name: 'Approve', exact: true }).click();
  await ask.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(600);
  const saved = await page.evaluate(() => window.__repo.col('leaveEntries').get('lv-wait'));
  check('the approval is saved with the note', saved.status === 'APPROVED' && saved.reviewNotes === 'Enjoy it.', JSON.stringify(saved).slice(0, 160));
  check('the menu count goes down', (await menu(page).getByRole('link', { name: 'Requests, 1 waiting' }).count()) === 1);

  // 3. The All tab is in the address, and Back returns to Waiting.
  await page.getByRole('tab', { name: 'All day off and shift requests' }).click();
  await page.waitForTimeout(400);
  check('the All tab is in the address', /#requests\?tab=all$/.test(page.url()), page.url());
  check('the All tab shows the requests', /18-11-2026/.test(await page.locator('main').innerText()));
  await page.goBack();
  await page.waitForTimeout(400);
  check('Back returns to Waiting', (await page.getByRole('tab', { name: /^Waiting/ }).getAttribute('aria-selected')) === 'true');

  // 4. Leave and days off: the grid, and a pointer to Requests instead of the old tabs.
  await menu(page).getByRole('link', { name: 'Leave and days off' }).click();
  await page.getByRole('heading', { level: 1, name: 'Leave and days off' }).waitFor({ timeout: 10000 });
  const grid = await page.locator('main').innerText();
  check('the old approval tabs are gone', !/Pending Approvals|All requests/.test(grid));
  check('it points to Requests while some wait', /1 request is waiting for a decision/.test(grid) && (await page.getByRole('link', { name: 'Open Requests' }).count()) === 1);
  // A decision on the All tab lowers the count in the menu too (Checkpoint 6).
  await page.getByRole('link', { name: 'Open Requests' }).click();
  await page.getByRole('tab', { name: 'All day off and shift requests' }).click();
  await page.getByRole('main').getByRole('button', { name: 'Approve' }).first().click();
  await page.waitForTimeout(1000);
  check('a decision on the All tab updates the menu count', (await menu(page).getByRole('link', { name: 'Requests', exact: true }).count()) === 1, await menu(page).innerText());
  await page.close();

  // 5. A manager sees Requests and their own "My requests"; a nurse sees no Requests.
  const manager = await open('manager', 'dashboard');
  check('a manager has Requests in the menu', (await menu(manager).getByRole('link', { name: /^Requests/ }).count()) === 1);
  check('a manager has "My requests" in the menu', (await menu(manager).getByRole('link', { name: 'My requests' }).count()) === 1);
  await manager.close();
  const nurse = await open('nurse', 'dashboard');
  check('a nurse has no Requests in the menu', (await menu(nurse).getByRole('link', { name: /^Requests/ }).count()) === 0);
  check('a nurse has "My requests" in the menu', (await menu(nurse).getByRole('link', { name: 'My requests' }).count()) === 1);
  await nurse.goto(`${base}/?view=app&as=nurse#requests`);
  await nurse.waitForTimeout(800);
  check('a nurse who types #requests goes to the dashboard', /#dashboard/.test(nurse.url()), nurse.url());
  await nurse.close();

  // 6. A phone.
  const phone = await open('owner', 'requests', { width: 390, height: 844 });
  await phone.getByRole('heading', { level: 1, name: 'Requests' }).waitFor({ timeout: 10000 });
  check('on a phone Requests does not scroll sideways', !(await phone.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));
  if (shots) await phone.screenshot({ path: `${shots}/requests-390.png`, fullPage: true });
  await phone.close();

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
