// The Nurses screen's list (UI overhaul Phase 6, slice 1): the shared table with search and
// filters, no date of birth, and removing a nurse only from the editor, which offers
// Make inactive first. Checks at 1366 px and on a 390 px phone.
// Run: NODE_PATH=$(npm root -g) node nurses-list.cjs [--base http://localhost:5180] [--shots <folder>]
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
  const table = page.getByRole('table', { name: 'Nurses' });
  const names = () => table.locator('tbody th').allInnerTexts();

  await page.goto(`${base}/?view=nurses`);
  await page.getByRole('heading', { level: 1, name: 'Nurses' }).waitFor({ timeout: 60000 });
  check('the heading counts the nurses', /4 nurses, 4 active/.test(await page.locator('body').innerText()));
  const headers = await table.locator('thead th').allInnerTexts();
  check('the date of birth is not in the list', !headers.some((h) => /birth/i.test(h)), headers.join(' | '));
  check('the list is in name order', (await names()).map((t) => t.split('\n')[0]).join(',') === 'Amy,Mary,Nina,Sara', (await names()).join(','));
  check('no Delete button in the list', (await table.getByRole('button', { name: /delete|remove/i }).count()) === 0);
  if (shots) await page.screenshot({ path: `${shots}/nurses-1366.png` });

  // Search and filters.
  await page.getByLabel('Search').fill('MARY');
  await page.waitForTimeout(200);
  check('the search finds a nurse by name in any case', (await names()).length === 1 && /Mary/.test((await names())[0]));
  check('the search result is read out', /1 of 4 nurses shown/.test(await page.getByRole('status').filter({ hasText: 'nurses shown' }).innerText()));
  await page.getByLabel('Search').fill('');
  await page.getByLabel('Level').selectOption({ label: 'Staff' });
  await page.waitForTimeout(200);
  check('the level filter narrows the list', (await names()).map((t) => t.split('\n')[0]).join(',') === 'Mary,Nina');
  await page.getByLabel('Search').fill('nobody');
  await page.getByRole('button', { name: 'Clear the search and filters' }).click();
  await page.waitForTimeout(200);
  check('nothing found offers to clear the search and filters', (await names()).length === 4);

  // Leaving the clinic: inactive first, removing for good second, both in the editor.
  await page.getByRole('button', { name: 'Edit Nina' }).click();
  const editor = page.getByRole('dialog');
  await editor.getByRole('heading', { name: 'Leaving the clinic' }).waitFor({ timeout: 5000 });
  check('the editor offers Make inactive before removing', (await editor.getByRole('button', { name: 'Make inactive' }).count()) === 1);
  await editor.getByRole('button', { name: 'Make inactive' }).click();
  await page.waitForTimeout(600);
  check('Make inactive saves the nurse as inactive', (await page.evaluate(() => window.__repo.col('nurses').get('nina')?.active)) === false);
  check('the heading counts one fewer active', /4 nurses, 3 active/.test(await page.locator('body').innerText()));
  await page.getByRole('button', { name: 'Edit Nina' }).click();
  await editor.getByRole('button', { name: 'Remove for good' }).click();
  const ask = page.getByRole('alertdialog');
  check('removing asks first, and says it cannot be undone', /cannot be undone/.test(await ask.innerText()));
  await ask.getByRole('button', { name: 'Remove for good' }).click();
  await page.waitForTimeout(600);
  check('Remove for good deletes the nurse', (await page.evaluate(() => window.__repo.col('nurses').has('nina'))) === false);

  // A phone: one card for each nurse, and nothing scrolls sideways.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const cards = page.getByRole('list', { name: 'Nurses' }).getByRole('listitem');
  check('on a phone each nurse is a card', (await cards.count()) === 3);
  check('on a phone the page does not scroll sideways', !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));
  if (shots) await page.screenshot({ path: `${shots}/nurses-390.png`, fullPage: true });

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
