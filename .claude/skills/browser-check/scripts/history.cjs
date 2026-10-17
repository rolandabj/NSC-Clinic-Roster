// History tidied (UI overhaul Phase 7, slice 5): one set of filters, the plain names "Saved copy",
// "Automatic backup" and "Published version", a list with no buttons inside buttons, restore and
// delete only for planners, no Delete roster here, dates as DD-MM-YYYY, and the restore and delete
// dialogs on the shared Dialog, then Compare versions and Open larger (slice 5b).
// Run: NODE_PATH=$(npm root -g) node history.cjs [--base http://localhost:5180] [--shots <folder>]
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
  const versions = () => page.evaluate(() => [...window.__repo.col('versions').values()]);
  const more = async (entry) => {
    await page.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: new RegExp(`^${entry}`) }).click();
  };

  // Make one of each kind on the roster screen: a saved copy, then a fill keeps a backup.
  await page.goto(`${base}/?view=app#schedules?roster=nov`);
  await page.waitForSelector('[data-cell="mary|2026-11-16"]', { timeout: 60000 });
  await page.waitForTimeout(800);
  await more('Keep a copy');
  const keep = page.getByRole('dialog', { name: 'Keep a copy' });
  await keep.getByLabel('Name for this copy').fill('Before the swap');
  await keep.getByRole('button', { name: 'Keep the copy' }).click();
  await keep.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  await page.getByRole('button', { name: /Fill roster/ }).click();
  await page.getByRole('menuitem', { name: /Fill the whole roster/ }).click();
  const fill = page.getByRole('dialog', { name: /^Fill the whole roster/ });
  await fill.getByRole('button', { name: 'Fill roster' }).click();
  await fill.waitFor({ state: 'detached', timeout: 60000 });
  await page.waitForTimeout(1500);
  check('the roster screen kept a backup', (await versions()).some((v) => v.kind === 'BACKUP'));

  await page.getByRole('link', { name: 'History' }).first().click();
  await page.getByRole('heading', { name: 'History', level: 1 }).waitFor({ timeout: 10000 });
  await page.waitForTimeout(600);
  const main = page.locator('main');
  const list = page.getByRole('list', { name: 'Versions' });
  if (shots) await page.screenshot({ path: `${shots}/history.png` });

  // 1. One set of filters, plain names, and words a nurse manager would use.
  check('one Search, Kind, Year and Order', (await page.getByLabel('Year', { exact: true }).count()) === 1 && (await page.getByLabel('Kind').count()) === 1 && (await page.getByLabel('Order').count()) === 1);
  const text = await main.innerText();
  check('no old words (snapshot, checkpoint, v1.0, draft, matrix)', !/snapshot|checkpoint|v\d+\.0|draft|matrix|delta/i.test(text), (text.match(/snapshot|checkpoint|v\d+\.0|draft|matrix|delta/gi) || []).join(', '));
  check('the list names a saved copy and a backup', /Saved copy/.test(await list.innerText()) && /Automatic backup/.test(await list.innerText()));
  check('dates are DD-MM-YYYY', /\d{2}-\d{2}-2026 \d{2}:\d{2}/.test(await list.innerText()) && !/\d{1,2}\/\d{1,2}\/\d{4}/.test(text));
  check('no text under 12 px', (await smallText(main)).length === 0, (await smallText(main)).slice(0, 5).join(' | '));
  check('no button inside a button', (await page.locator('button button, [role="button"] button').count()) === 0);
  check('no Delete roster on History', (await main.getByRole('button', { name: /delete (the )?(roster|schedule)/i }).count()) === 0);

  // 2. The filters.
  await page.getByLabel('Kind').selectOption('BACKUP');
  check('the Kind filter keeps the backups', (await list.getByRole('button').count()) === (await versions()).filter((v) => v.kind === 'BACKUP').length);
  check('a backup offers no Restore here, and says where', (await main.getByRole('button', { name: 'Restore', exact: true }).count()) === 0 && /restored from the roster screen/.test(await main.innerText()));
  await page.getByLabel('Kind').selectOption('ALL');
  await page.getByLabel('Search').fill('swap');
  check('search finds the note', (await list.getByRole('button').count()) === 1 && /Before the swap/.test(await list.innerText()));
  await page.getByLabel('Search').fill('nothing like this');
  check('no match offers Clear the filters', (await main.getByRole('button', { name: 'Clear the filters' }).count()) === 1);
  await main.getByRole('button', { name: 'Clear the filters' }).click();
  await page.getByLabel('Order').selectOption('OLDEST');
  check('oldest first starts at version 1', /^Version 1/.test((await list.getByRole('button').first().innerText()).trim()));

  // 3. The version open on the right: plain tab names and the tables.
  await list.getByRole('button').first().click();
  const tabs = await page.getByRole('tab').allInnerTexts();
  check('the tabs are Roster, What changed, Shifts, Details', tabs.map((t) => t.replace(/\s*\d+$/, '').trim()).join('|') === 'Roster|What changed|Shifts|Details', tabs.join('|'));
  await page.getByRole('tab', { name: /Shifts/ }).click();
  check('the Shifts tab is a table with DD-MM-YYYY dates', /16-11-2026/.test(await page.getByRole('table', { name: /Shifts in version 1/ }).innerText()));
  await page.getByRole('tab', { name: /Roster/ }).click();
  check('the roster table can be reached by keyboard', (await page.getByRole('region', { name: /Shifts of version 1/ }).getAttribute('tabindex')) === '0');

  // 3b. Compare versions and Open larger on the shared Dialog.
  await page.getByRole('button', { name: 'Compare versions' }).click();
  const cmp = page.getByRole('dialog', { name: 'Compare versions' });
  await cmp.waitFor({ timeout: 5000 });
  const fromText = await cmp.getByLabel('From', { exact: true }).innerText();
  check('Compare names versions with DD-MM-YYYY dates', /Version 1, First fill \(02-10-2026\)/.test(fromText) && /The roster now/.test(fromText), fromText.split('\n')[0]);
  check('Compare has no text under 12 px', (await smallText(cmp)).length === 0, (await smallText(cmp)).slice(0, 5).join(' | '));
  check('Compare lists the changes in a table', (await cmp.getByRole('table', { name: /Changes from version 1 to the roster now/ }).count()) === 1);
  check('Compare offers Restore version 1', (await cmp.getByRole('button', { name: 'Restore version 1' }).count()) === 1);
  await cmp.getByRole('button', { name: 'Close', exact: true }).last().click();
  await cmp.waitFor({ state: 'detached', timeout: 5000 });
  await main.getByRole('button', { name: 'Open larger' }).click();
  const big = page.getByRole('dialog', { name: /^Version 1 of November/ });
  await big.waitFor({ timeout: 5000 });
  check('Open larger shows the whole roster', await big.getByRole('switch', { name: 'Show the whole roster' }).isChecked().catch(() => false) || (await big.getByRole('region', { name: /Shifts of version 1/ }).count()) === 1);
  check('Open larger has no text under 12 px', (await smallText(big)).length === 0, (await smallText(big)).slice(0, 5).join(' | '));
  check('Open larger offers Restore and Delete', (await big.getByRole('button', { name: /^(Restore|Delete)$/ }).count()) === 2);
  await page.keyboard.press('Escape');
  await big.waitFor({ state: 'detached', timeout: 5000 });

  // 4. Restore on the shared Dialog: a backup is kept, and a new version records it.
  const before = (await versions()).length;
  await main.getByRole('button', { name: 'Restore', exact: true }).click();
  const restore = page.getByRole('dialog', { name: 'Restore this version?' });
  await restore.waitFor({ timeout: 5000 });
  check('Restore names the roster and the new version', /November/.test(await restore.innerText()) && /version \d+ records the restore/.test(await restore.innerText()));
  await restore.getByRole('button', { name: 'Restore', exact: true }).click();
  await restore.waitFor({ state: 'detached', timeout: 10000 });
  await page.waitForTimeout(800);
  const after = await versions();
  check('a backup and a new version are kept', after.length === before + 2 && after.some((v) => /Restored from version 1/.test(v.note)));

  // 5. Delete needs the tick box.
  await page.getByLabel('Search').fill('Before the swap');
  await list.getByRole('button').first().click();
  await main.getByRole('button', { name: 'Delete', exact: true }).click();
  const del = page.getByRole('alertdialog', { name: /^Delete version \d+ of November\?/ });
  await del.waitFor({ timeout: 5000 });
  check('Delete waits for the tick box', await del.getByRole('button', { name: 'Delete', exact: true }).isDisabled());
  check('the delete dialog has no text under 12 px', (await smallText(del)).length === 0, (await smallText(del)).join(' | '));
  await del.getByRole('checkbox').check();
  await del.getByRole('button', { name: 'Delete', exact: true }).click();
  await del.waitFor({ state: 'detached', timeout: 10000 });
  check('the copy is deleted', !(await versions()).some((v) => v.note === 'Before the swap'));

  // 6. A manager sees History but not Restore or Delete.
  await page.goto(`${base}/?view=app&as=manager#history`);
  await page.getByRole('heading', { name: 'History', level: 1 }).waitFor({ timeout: 30000 });
  await page.waitForTimeout(800);
  check('a manager has no Restore or Delete', (await page.getByRole('button', { name: /^(Restore|Delete)$/ }).count()) === 0);

  // 7. A phone: nothing wider than the screen.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  const wide = await page.evaluate(() => document.documentElement.scrollWidth);
  check('no sideways scroll on a phone', wide <= 390, `${wide} px`);

  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})();
