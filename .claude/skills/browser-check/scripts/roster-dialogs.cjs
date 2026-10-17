// The roster screen's dialogs on the shared Dialog (UI overhaul Phase 7, slice 3a): Keep a copy,
// Backup copies with dates as DD-MM-YYYY, Keyboard shortcuts, Open a roster (Open and Delete side
// by side), Delete the roster with its tick box, and the fill dialog's date range.
// Run: NODE_PATH=$(npm root -g) node roster-dialogs.cjs [--base http://localhost:5180] [--shots <folder>]
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
  const more = async (entry) => {
    await page.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: new RegExp(`^${entry}`) }).click();
  };
  const versions = () => page.evaluate(() => [...window.__repo.col('versions').values()]);

  await page.goto(`${base}/?view=app#schedules?roster=nov`);
  await page.waitForSelector('[data-cell="mary|2026-11-16"]', { timeout: 60000 });
  await page.waitForTimeout(800);

  // 1. Keep a copy.
  const before = (await versions()).length;
  await more('Keep a copy');
  const keep = page.getByRole('dialog', { name: 'Keep a copy' });
  await keep.waitFor({ timeout: 5000 });
  check('Keep a copy has no text under 12 px', (await smallText(keep)).length === 0, (await smallText(keep)).join(' | '));
  await keep.getByLabel('Name for this copy').fill('Before the swap');
  await keep.getByRole('button', { name: 'Keep the copy' }).click();
  await keep.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  const kept = (await versions()).find((v) => v.note === 'Before the swap');
  check('the copy is kept with its name', (await versions()).length === before + 1 && !!kept);

  // 2. The fill dialog: the date range is DD-MM-YYYY and a wrong order is named.
  await page.getByRole('button', { name: /Fill roster/ }).click();
  await page.getByRole('menuitem', { name: /Fill the whole roster/ }).click();
  const fill = page.getByRole('dialog', { name: /^Fill the whole roster/ });
  await fill.waitFor({ timeout: 10000 });
  check('the fill dialog has no text under 12 px', (await smallText(fill)).length === 0, (await smallText(fill)).join(' | '));
  await fill.getByLabel('Only fill some dates').check();
  await fill.getByLabel('From', { exact: true }).fill('20-11-2026');
  await fill.getByLabel('To', { exact: true }).fill('18-11-2026');
  check('a last day before the first is named', /The last day is before the first day/.test(await fill.innerText()));
  check('and Fill roster waits for good dates', await fill.getByRole('button', { name: 'Fill roster' }).isDisabled());
  await fill.getByLabel('Only fill some dates').uncheck();
  if (shots) await page.screenshot({ path: `${shots}/fill.png` });
  await fill.getByRole('button', { name: 'Fill roster' }).click();
  await fill.waitFor({ state: 'detached', timeout: 60000 });
  await page.waitForTimeout(1200);

  // 3. Backup copies: the fill kept one, shown with its date as DD-MM-YYYY.
  await more('Backup copies');
  const backups = page.getByRole('dialog', { name: 'Backup copies' });
  await backups.waitFor({ timeout: 5000 });
  const backupText = await backups.innerText();
  check('a backup shows its date as DD-MM-YYYY', /\d{2}-\d{2}-\d{4} \d{2}:\d{2}/.test(backupText) && !/\d{1,2}\/\d{1,2}\/\d{4}/.test(backupText), backupText.slice(0, 200));
  check('each backup has a Restore button that names it', (await backups.getByRole('button', { name: /^Restore the backup of / }).count()) >= 1);
  await page.keyboard.press('Escape');

  // 4. Keyboard shortcuts.
  await page.locator('[data-cell="mary|2026-11-16"]').click();
  await page.keyboard.press('Escape');
  await page.keyboard.press('?');
  const keys = page.getByRole('dialog', { name: 'Keyboard shortcuts' });
  await keys.waitFor({ timeout: 5000 });
  const keysText = await keys.innerText();
  check('the shortcuts list Space, undo and redo', /Open the quick choices for the cell/.test(keysText) && /Undo the last change/.test(keysText) && /Redo/.test(keysText));
  check('the shortcuts have no text under 12 px', (await smallText(keys)).length === 0, (await smallText(keys)).join(' | '));
  await page.keyboard.press('Escape');

  // 4b. Unpin: a question that names the nurse and the day, and says "the nurse".
  await page.goto(`${base}/?view=app&seed=pinned#schedules?roster=nov`);
  await page.waitForSelector('[data-cell="sara|2026-11-17"]', { timeout: 60000 });
  await page.waitForTimeout(800);
  await page.locator('[data-cell="sara|2026-11-17"]').click();
  const unpinButton = page.getByRole('button', { name: /^Unpin/ });
  const canUnpin = await unpinButton.waitFor({ timeout: 4000 }).then(() => true, () => false);
  check('a pinned cell offers Unpin', canUnpin);
  if (canUnpin) {
    await unpinButton.click();
    const unpin = page.getByRole('alertdialog', { name: 'Unpin this day?' });
    await unpin.waitFor({ timeout: 5000 });
    const unpinText = await unpin.innerText();
    check('Unpin names the nurse and the day', /Sara, Tue 17-11-2026/.test(unpinText), unpinText.slice(0, 200));
    check('Unpin says "the nurse" and points to Requests', /so the nurse can\s+be given a shift/.test(unpinText) && /Requests, under All day off and shift requests/.test(unpinText) && !/\bshe\b/.test(unpinText));
    await unpin.getByRole('button', { name: 'Keep pinned' }).click();
  }

  // 5. Open a roster: Open and Delete are two buttons, side by side.
  await page.getByTitle('Open another roster, or create a new one').click();
  const pick = page.getByRole('dialog', { name: 'Open a roster' });
  await pick.waitFor({ timeout: 5000 });
  const nested = await pick.evaluate((d) => [...d.querySelectorAll('button, [role="button"]')].filter((b) => b.parentElement.closest('button, [role="button"]')).length);
  check('no button sits inside another', nested === 0, String(nested));
  check('the open roster is marked', (await pick.locator('[aria-current="true"]').count()) === 1);
  const del = pick.getByRole('button', { name: /^Delete the roster / }).first();
  await del.click();
  const ask = page.getByRole('alertdialog', { name: /^Delete the roster / });
  await ask.waitFor({ timeout: 5000 });
  check('Delete waits for the tick box', await ask.getByRole('button', { name: 'Delete the roster' }).isDisabled());
  check('the roster dates show as DD-MM-YYYY', /\d{2}-\d{2}-2026 to \d{2}-\d{2}-2026/.test(await ask.innerText()));
  if (shots) await page.screenshot({ path: `${shots}/delete-roster.png` });
  await ask.getByRole('button', { name: 'Cancel' }).click();

  // 6. On a phone the picker fits.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const any = page.getByRole('dialog').first();
  if (await any.count()) check('on a phone a dialog does not scroll sideways', await any.evaluate((d) => d.scrollWidth <= d.clientWidth + 1));

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
