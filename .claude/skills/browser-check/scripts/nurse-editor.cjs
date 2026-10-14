// The nurse editor (UI overhaul Phase 6, slice 2): each field checked as it is filled in,
// Save that puts the focus on the first field to fix, and the preference list ordered
// from the keyboard with the focus kept on the moved preference.
// Run: NODE_PATH=$(npm root -g) node nurse-editor.cjs [--base http://localhost:5180] [--shots <folder>]
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
  const focused = () => page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.id || '');

  await page.goto(`${base}/?view=nurses`);
  await page.getByRole('heading', { level: 1, name: 'Nurses' }).waitFor({ timeout: 60000 });

  // 1. A new nurse: Save with empty fields says how many need fixing and focuses the first.
  await page.getByRole('button', { name: 'Add nurse' }).first().click();
  const editor = page.getByRole('dialog', { name: 'Add nurse' });
  await editor.waitFor({ timeout: 5000 });
  check('nothing is marked wrong before a field is left', (await editor.locator('[aria-invalid="true"]').count()) === 0);
  await editor.getByRole('button', { name: 'Add nurse' }).click();
  await page.waitForTimeout(300);
  check('Save says how many fields need fixing', /3 fields need fixing/.test(await editor.innerText()), (await editor.innerText()).slice(0, 120));
  check('Save puts the focus on the first field to fix', (await page.evaluate(() => document.activeElement?.closest('div')?.querySelector('label')?.textContent)) === 'Full name');
  if (shots) await page.screenshot({ path: `${shots}/editor-errors.png` });

  // 2. Each field is checked as it is filled in.
  await editor.getByLabel('Full name').fill('Lina Haddad');
  check('a fixed field loses its message at once', !/Enter the nurse's full name/.test(await editor.innerText()));
  await editor.getByLabel('Email').fill('AMY@example.com');
  check('an email another nurse has is named', /Amy already has this email address/.test(await editor.innerText()));
  await editor.getByLabel('Email').fill('lina@gmail.com');
  await editor.getByLabel('Contract (%)').fill('150');
  await editor.getByLabel('Contract (%)').blur();
  check('a contract over 100 is refused when the field is left', /Enter a whole number from 10 to 100/.test(await editor.innerText()));
  await editor.getByLabel('Contract (%)').fill('80');
  check('the contract says part time', /Part time: 80% of the goal hours/.test(await editor.innerText()));
  await editor.getByLabel('Date of birth').fill('02-03-1990');
  await editor.getByRole('button', { name: 'Add nurse' }).click();
  await editor.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  const saved = await page.evaluate(() => [...window.__repo.col('nurses').values()].find((n) => n.fullName === 'Lina Haddad'));
  check('the new nurse is saved with the typed date', saved && saved.dateOfBirth === '1990-03-02' && saved.contractPercent === 80, JSON.stringify(saved || {}).slice(0, 120));

  // 3. Preferences ordered from the keyboard.
  // An older record (no email, no code): the list shows it after the next save reloads it.
  await page.evaluate(() => window.__repo.col('nurses').set('old', { id: 'old', fullName: 'Old Record', seniorityLevelId: 'jun', contractPercent: 100, capabilityIds: [], isClinicNurse: true, preferences: [], active: true }));
  await page.getByRole('button', { name: 'Edit Mary' }).click();
  const mary = page.getByRole('dialog', { name: 'Edit Mary' });
  await mary.getByLabel('Add a doctor or specialty').selectOption({ label: 'Dr Ray (ENT)' });
  await mary.getByRole('button', { name: 'Add', exact: true }).click();
  const order = () => mary.getByRole('list', { name: 'Preferences, most wanted first' }).getByRole('listitem').allInnerTexts();
  check('an added preference goes to the end', /Dr Ray/.test((await order())[1] || ''));
  await mary.getByRole('button', { name: 'Move Dr Ray up' }).focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  check('Move up moves it', /^1\s+Dr Ray/.test((await order())[0] || ''), (await order()).join(' | '));
  check('the focus stays on the moved preference', (await focused()) === 'Move Dr Ray down', await focused());
  check('the move is read out', /Dr Ray is now number 1 of 2/.test(await mary.getByRole('status').filter({ hasText: 'number' }).innerText()));
  if (shots) await page.screenshot({ path: `${shots}/editor-prefs.png` });
  await mary.getByRole('button', { name: 'Save changes' }).click();
  await mary.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  const prefs = await page.evaluate(() => window.__repo.col('nurses').get('mary').preferences.map((p) => `${p.rank}:${p.refId}`).join(','));
  check('the new order is saved', prefs === '1:ray,2:lee', prefs);

  // An older record without an email or a code opens, and says what is missing (Checkpoint 6).
  await page.getByRole('button', { name: 'Edit Old Record' }).click();
  const old = page.getByRole('dialog', { name: 'Edit Old Record' });
  await old.waitFor({ timeout: 5000 }).catch(() => {});
  check('a nurse saved without an email or a code opens', (await old.count()) === 1);
  if (await old.count()) {
    await old.getByRole('button', { name: 'Save changes' }).click();
    check('and Save says the email and the date of birth are missing', /2 fields need fixing/.test(await old.innerText()));
    await page.keyboard.press('Escape');
  }
  check('the page did not break', errors.length === 0, errors.slice(0, 2).join(' | '));

  // An allowance is in days, as typed: 48 stays 48 (it opened as 6 before 14-10-2026).
  await page.getByRole('button', { name: 'Edit Amy' }).click();
  const amyQuota = page.getByRole('dialog', { name: 'Edit Amy' });
  await amyQuota.getByLabel(/^Annual Leave/).fill('48');
  await amyQuota.getByRole('button', { name: 'Save changes' }).click();
  await amyQuota.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  await page.getByRole('button', { name: 'Edit Amy' }).click();
  check('an allowance of 48 days opens as 48', (await page.getByRole('dialog', { name: 'Edit Amy' }).getByLabel(/^Annual Leave/).inputValue()) === '48');
  await page.keyboard.press('Escape');

  // 4. Esc closes the editor; on a phone it fits.
  await page.getByRole('button', { name: 'Edit Amy' }).click();
  const amy = page.getByRole('dialog', { name: 'Edit Amy' });
  await amy.getByLabel('Contract (%)').fill('5');
  check('while typing, no message yet', !/Enter a whole number from 10 to 100/.test(await amy.innerText()));
  await amy.getByLabel('Contract (%)').blur();
  check('the message shows once the field is left', /Enter a whole number from 10 to 100/.test(await amy.innerText()));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  check('Esc closes the editor', (await page.getByRole('dialog').count()) === 0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Edit Amy' }).click();
  await page.waitForTimeout(300);
  check('on a phone the editor does not scroll sideways', await page.getByRole('dialog').evaluate((d) => d.scrollWidth <= d.clientWidth + 1));
  if (shots) await page.screenshot({ path: `${shots}/editor-390.png` });

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
