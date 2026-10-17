// Settings saved only by Save (UI overhaul Phase 8, slice 1b): Clinic and opening hours, and
// Email, keep a draft; the menu says "Not saved"; Cancel goes back to what is saved; Save saves;
// opening another screen with changes not saved asks first.
// Run: NODE_PATH=$(npm root -g) node settings-save.cjs [--base http://localhost:5180]
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
  const col = (name) => page.evaluate((n) => [...window.__repo.col(n).values()], name);
  const nav = page.getByRole('navigation', { name: 'Settings sections' });
  const main = page.locator('main');

  await page.goto(`${base}/?view=app&as=owner#settings?tab=clinic`);
  await page.getByRole('heading', { name: 'Clinic and opening hours' }).waitFor({ timeout: 60000 });
  await page.waitForTimeout(600);
  check('the Clinic section has no text under 12 px', (await smallText(main)).length === 0, (await smallText(main)).slice(0, 5).join(' | '));

  // 1. A change is a draft, named in the menu, kept while moving between sections.
  const name = page.getByLabel('Clinic name');
  const before = await name.inputValue();
  await name.fill('North Clinic');
  check('Save and Cancel work once something changed', await main.getByRole('button', { name: 'Save', exact: true }).isEnabled());
  check('the menu says Not saved', /Not saved/.test(await nav.getByRole('link', { name: /Clinic and opening hours/ }).innerText()));
  check('nothing is saved yet', !(await col('clinics')).some((c) => c.name === 'North Clinic'));
  await nav.getByRole('link', { name: /^Email/ }).click();
  await page.waitForTimeout(300);
  await nav.getByRole('link', { name: /Clinic and opening hours/ }).click();
  await page.waitForTimeout(300);
  check('the draft is kept while moving between sections', (await page.getByLabel('Clinic name').inputValue()) === 'North Clinic');

  // 2. Cancel.
  await main.getByRole('button', { name: 'Cancel', exact: true }).click();
  check('Cancel goes back to what is saved', (await page.getByLabel('Clinic name').inputValue()) === before);
  check('and the menu mark goes', !/Not saved/.test(await nav.innerText()));

  // 3. A wrong time is named, and not saved.
  await page.getByLabel('Closes at').fill('08:00');
  check('closing before opening is named', /must close after it opens/.test(await main.innerText()));
  await main.getByRole('button', { name: 'Save', exact: true }).click();
  await page.waitForTimeout(400);
  check('and is not saved', !(await col('clinics')).some((c) => c.closeTime === '08:00'));
  await main.getByRole('button', { name: 'Cancel', exact: true }).click();

  // 4. Save.
  await page.getByLabel('Clinic name').fill('North Clinic');
  await main.getByRole('button', { name: 'Save', exact: true }).click();
  await page.waitForTimeout(600);
  check('Save saves the clinic', (await col('clinics')).some((c) => c.name === 'North Clinic'));
  check('it says everything is saved', /Everything is saved/.test(await main.innerText()));
  check('the top bar shows the new name', /North Clinic/.test(await page.locator('header').first().innerText()));

  // 4b. Rules (slice 1c): a switch and a number are a draft until Save.
  await nav.getByRole('link', { name: /^Rules/ }).click();
  await page.getByRole('heading', { name: 'Rules', level: 2, exact: true }).waitFor({ timeout: 10000 });
  await page.waitForTimeout(400);
  check('the Rules section has no text under 12 px', (await smallText(main)).length === 0, (await smallText(main)).slice(0, 5).join(' | '));
  // The test page starts with no rules: adding the missing ones happens at once.
  const add = main.getByRole('button', { name: /^Add the (\d+ )?missing rules?$/ });
  if (await add.count()) {
    await add.click();
    await main.getByRole('switch').first().waitFor({ timeout: 10000 });
    check('Add the missing rules saves them at once', (await col('rules')).length > 0 && !/Not saved/.test(await nav.innerText()));
  }
  const sw = main.getByRole('switch').first();
  const swName = (await sw.getAttribute('aria-label')).replace(/ on$/, '');
  const ruleBefore = (await col('rules')).find((r) => swName.length > 0) && (await col('rules'));
  const wasOn = (await sw.getAttribute('aria-checked')) === 'true';
  await sw.click();
  check('a rule switched is a draft, named in the menu', /Not saved/.test(await nav.getByRole('link', { name: /^Rules/ }).innerText()));
  const savedNow = JSON.stringify((await col('rules')).map((r) => r.enabled));
  check('and nothing is saved yet', savedNow === JSON.stringify(ruleBefore.map((r) => r.enabled)));
  await main.getByRole('button', { name: 'Cancel', exact: true }).click();
  check('Cancel puts the switch back', ((await sw.getAttribute('aria-checked')) === 'true') === wasOn);
  await sw.click();
  await main.getByRole('button', { name: 'Save', exact: true }).click();
  await page.waitForTimeout(600);
  const changedCount = (await col('rules')).filter((r, i) => r.enabled !== ruleBefore[i].enabled).length;
  check('Save writes the one rule that changed', changedCount === 1, String(changedCount));
  check('and the menu mark goes', !/Not saved/.test(await nav.innerText()));

  // 5. Email: leaving with a change not saved asks first.
  await nav.getByRole('link', { name: /^Email/ }).click();
  await page.waitForTimeout(400);
  check('the Email section has no text under 12 px', (await smallText(main)).length === 0, (await smallText(main)).slice(0, 5).join(' | '));
  await page.getByRole('radio', { name: /^Live/ }).check();
  await page.getByRole('link', { name: 'Dashboard' }).first().click();
  const ask = page.getByRole('alertdialog', { name: 'Leave without saving?' }).or(page.getByRole('dialog', { name: 'Leave without saving?' }));
  const asked = await ask.first().waitFor({ timeout: 5000 }).then(() => true, () => false);
  check('opening another screen asks first', asked && /Email has changes that are not saved/.test(await ask.first().innerText()));
  if (asked) await ask.first().getByRole('button', { name: 'Cancel' }).click();
  await page.waitForTimeout(300);
  check('Cancel stays in Settings with the change', /#settings\?tab=email/.test(page.url()) && (await page.getByRole('radio', { name: /^Live/ }).isChecked()));
  await main.getByRole('button', { name: 'Save', exact: true }).click();
  await page.waitForTimeout(600);
  const saved = (await col('systemMetadata')).find((m) => m.id === 'email_settings');
  check('Save saves the email setting for everyone', saved && saved.emailMockMode === false, JSON.stringify(saved));
  await page.getByRole('link', { name: 'Dashboard' }).first().click();
  await page.waitForTimeout(500);
  check('with everything saved, leaving does not ask', /#dashboard/.test(page.url()) && (await ask.count()) === 0);

  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})();
