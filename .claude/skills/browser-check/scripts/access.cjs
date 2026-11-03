// Settings, Access and permissions (UI overhaul Phase 8, slice 1e): plain words, a person waiting
// approved with the choices made on screen, access removed and given back, an email checked, staff
// without an account added ahead, and a phone without sideways scroll.
// Run: NODE_PATH=$(npm root -g) node access.cjs [--base http://localhost:5180]
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
  const rec = (id) => page.evaluate((i) => window.__repo.col('userAccess').get(i), id);
  const main = page.locator('main');

  await page.goto(`${base}/?view=app&as=owner#dashboard`);
  await main.waitFor({ timeout: 60000 });
  await page.evaluate(() => {
    const col = window.__repo.col('userAccess');
    const now = new Date().toISOString();
    col.set('mary@example.com', { id: 'mary@example.com', email: 'mary@example.com', name: 'Mary', status: 'PENDING', appRole: 'VIEWER', isManager: false, approvedBy: '', createdAt: now });
    col.set('lee@example.com', { id: 'lee@example.com', email: 'lee@example.com', name: 'Dr Lee', status: 'APPROVED', appRole: 'VIEWER', isManager: false, approvedBy: 'owner', createdAt: now });
  });
  await page.getByRole('link', { name: 'Settings' }).first().click();
  await page.getByRole('link', { name: /^Access and permissions/ }).click();
  await page.getByRole('heading', { name: 'Access and permissions', level: 2 }).waitFor({ timeout: 10000 });
  await page.waitForTimeout(800);

  // 1. Words and size.
  const text = await main.innerText();
  check('no old words (Master Administrator, whitelist, revoke, capitals)', !/Master Admin|Whitelist|Institutional|Revoke|MASTER ADMIN|APPROVED|PENDING|Pre-Approve|Google Workspace/i.test(text.replace(/Approved/g, '')), (text.match(/Master Admin|Whitelist|Institutional|Revoke|MASTER ADMIN|Pre-Approve|Google Workspace/gi) || []).join(', '));
  check('no text under 12 px', (await smallText(main)).length === 0, (await smallText(main)).slice(0, 5).join(' | '));
  check('the person waiting is listed', /Waiting for your approval \(1\)/.test(text) && /mary@example\.com/.test(text));

  // 2. Approve with the choices made on screen.
  const waiting = page.getByRole('list', { name: 'Waiting for your approval' });
  await waiting.getByLabel('What they can do').selectOption('EDITOR');
  await waiting.getByLabel(/Their nurse record/).selectOption('mary');
  await waiting.getByRole('checkbox', { name: /Can approve requests/ }).check();
  await waiting.getByRole('button', { name: 'Approve mary@example.com' }).click();
  await page.waitForTimeout(800);
  const mary = await rec('mary@example.com');
  check('Approve saves the choices made on screen', mary && mary.status === 'APPROVED' && mary.appRole === 'EDITOR' && mary.isManager === true && mary.linkedNurseId === 'mary', JSON.stringify(mary));

  // 3. Remove access and give it back.
  await main.getByRole('button', { name: 'Remove access of lee@example.com' }).click();
  const ask = page.getByRole('alertdialog', { name: 'Remove access?' }).or(page.getByRole('dialog', { name: 'Remove access?' }));
  await ask.first().getByRole('button', { name: 'Remove access' }).click();
  await page.waitForTimeout(800);
  check('Remove access removes it', (await rec('lee@example.com')).status === 'REVOKED');
  await main.getByRole('button', { name: 'Give access back to lee@example.com' }).click();
  await page.waitForTimeout(800);
  check('Give access back gives it back', (await rec('lee@example.com')).status === 'APPROVED');

  // 4. Check an email.
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('mary@example.com');
  check('checking an email says what they can do and their record', /Can look at and change rosters, staff and settings, and can approve requests/.test(await main.innerText()) && /Linked to the nurse Mary/.test(await main.innerText()));

  // 5. Staff without an account.
  const without = page.getByRole('list', { name: 'Staff without an account' });
  check('staff without an account are listed', (await without.getByRole('listitem').count()) >= 1);
  await without.getByRole('button', { name: /^Add .* before their first sign in$/ }).first().click();
  const add = page.getByRole('dialog', { name: 'Add a person' });
  await add.waitFor({ timeout: 5000 });
  check('Add first opens Add a person with the email filled in', /@/.test(await add.getByLabel('Google account email').inputValue()));
  await page.keyboard.press('Escape');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  check('no sideways scroll on a phone', (await page.evaluate(() => document.documentElement.scrollWidth)) <= 390);

  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})();
