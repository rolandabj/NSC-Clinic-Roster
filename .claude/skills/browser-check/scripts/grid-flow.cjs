// Roster grid flow (UI overhaul Phase 3): an edit, undo, the popup, deleting a shift, a fill,
// a swap and a failed save, each checked against what the in memory database saved; and three
// cases from the Checkpoint 3 review (a flash, the popup after Back, a roster opened after an edit).
// Run: NODE_PATH=$(npm root -g) node grid-flow.cjs [--base http://localhost:5180]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  const results = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });

  const saved = () =>
    page.evaluate(() => [...window.__repo.col('assignments').values()].map((a) => `${a.nurseId}|${a.date}|${a.dutyWindowId}|${a.doctorId || a.clinicalRoleId || a.specialtyId || ''}`).sort());
  const cellText = (key) => page.locator(`[data-cell="${key}"]`).innerText();
  /** Every cell with a saved shift shows one, and every empty cell has none saved. */
  const gridMatchesSaved = () =>
    page.evaluate(() => {
      const shifts = new Set([...window.__repo.col('assignments').values()].map((a) => `${a.nurseId}|${a.date}`));
      const wrong = [];
      for (const td of document.querySelectorAll('td[data-cell]')) {
        const key = td.getAttribute('data-cell');
        const empty = td.innerText.trim() === '—';
        if (empty && shifts.has(key)) wrong.push(`${key} shows nothing but has a saved shift`);
        if (!empty && / shift /.test(td.getAttribute('aria-label') || '') && !shifts.has(key)) wrong.push(`${key} shows a shift that is not saved`);
      }
      return wrong;
    });
  const settle = () => page.waitForTimeout(400);

  await page.goto(`${base}/?view=schedules`);
  await page.waitForSelector('[data-cell="sara|2026-11-18"]', { timeout: 60000 });
  await page.waitForTimeout(800);
  const start = await saved();

  // 1. An edit from the popup: Sara has nothing on 18-11-2026; the first work choice gives her a shift.
  check('Sara starts with nothing on 18-11-2026', (await cellText('sara|2026-11-18')).trim() === '—');
  await page.click('[data-cell="sara|2026-11-18"]');
  const popup = page.getByRole('dialog', { name: /^Change Sara/ });
  await popup.waitFor({ timeout: 5000 });
  check('a click opens the popup', await popup.isVisible());
  await popup.getByRole('group', { name: 'Work' }).getByRole('button').first().click();
  await settle();
  const afterEdit = await saved();
  check('the edit is saved', afterEdit.length === start.length + 1 && afterEdit.some((s) => s.startsWith('sara|2026-11-18|')), `${start.length} to ${afterEdit.length}`);
  check('the cell shows the new shift', (await cellText('sara|2026-11-18')).trim() !== '—');

  // 2. Undo puts it back.
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await settle();
  check('undo removes the shift again', JSON.stringify(await saved()) === JSON.stringify(start));
  check('after undo the cell is empty', (await cellText('sara|2026-11-18')).trim() === '—');

  // 3. The popup closes with Esc and gives the focus back to its cell.
  await page.click('[data-cell="mary|2026-11-16"]');
  await page.getByRole('dialog', { name: /^Change Mary/ }).waitFor({ timeout: 5000 });
  await page.keyboard.press('Escape');
  await settle();
  check('Esc closes the popup', (await page.getByRole('dialog', { name: /^Change Mary/ }).count()) === 0);

  // 4. Arrow keys move the selection, and Delete clears a shift (then undo).
  await page.focus('[data-cell="mary|2026-11-16"]');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowLeft');
  await settle();
  check('arrow keys move and come back', (await page.getAttribute('[data-cell="mary|2026-11-16"]', 'aria-selected')) === 'true');
  await page.keyboard.press('Delete');
  await settle();
  check('Delete clears the shift and saves it', !(await saved()).some((s) => s.startsWith('mary|2026-11-16|')));
  await page.keyboard.press('Control+z');
  await settle();
  check('Ctrl+Z brings it back', JSON.stringify(await saved()) === JSON.stringify(start));

  // 5. Fill the whole roster.
  await page.getByRole('button', { name: /Fill roster/ }).click();
  await page.getByRole('menuitem', { name: /Fill the whole roster/ }).click();
  const fill = page.getByRole('dialog', { name: /Fill/ });
  await fill.waitFor({ timeout: 10000 });
  await fill.getByRole('button', { name: /^Fill/ }).last().click();
  await fill.waitFor({ state: 'detached', timeout: 60000 });
  await page.waitForTimeout(1500);
  const afterFill = await saved();
  check('the fill saves shifts', afterFill.length > start.length, `${start.length} to ${afterFill.length}`);
  const fillWrong = await gridMatchesSaved();
  check('after the fill the grid shows what is saved', fillWrong.length === 0, fillWrong.slice(0, 3).join('; '));

  // 6. Swap Mary's and Nina's first shifts (as an exception when Mary's list does not allow it).
  await page.getByRole('button', { name: 'More actions' }).click();
  await page.getByRole('menuitem', { name: /Swap two nurses/ }).click();
  const swap = page.getByRole('dialog', { name: 'Swap shifts' });
  await swap.getByLabel('First nurse', { exact: true }).selectOption('mary');
  await swap.getByLabel('Second nurse', { exact: true }).selectOption('nina');
  await page.waitForTimeout(500);
  const beforeSwap = await saved();
  const exception = swap.getByRole('button', { name: 'Swap anyway as an exception' });
  if (await exception.count()) await exception.click();
  else await swap.getByRole('button', { name: 'Swap shifts' }).click();
  await swap.waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1000);
  const afterSwap = await saved();
  check('the swap is saved', JSON.stringify(afterSwap) !== JSON.stringify(beforeSwap) && afterSwap.length === beforeSwap.length);
  const swapWrong = await gridMatchesSaved();
  check('after the swap the grid shows what is saved', swapWrong.length === 0, swapWrong.slice(0, 3).join('; '));

  // 7. A failed save (the daily quota): the error shows, Retry now saves it.
  await page.evaluate(() => {
    window.__repo.failWrites = true;
  });
  const emptyCell = await page.evaluate(() => [...document.querySelectorAll('td[data-cell]')].find((td) => td.innerText.trim() === '—')?.getAttribute('data-cell'));
  await page.click(`[data-cell="${emptyCell}"]`);
  await page.getByRole('dialog', { name: /^Change / }).getByRole('group', { name: 'Work' }).getByRole('button').first().click();
  await page.getByRole('button', { name: 'Retry now' }).waitFor({ timeout: 10000 }).catch(() => {});
  check('a failed save shows Retry now', (await page.getByRole('button', { name: 'Retry now' }).count()) > 0);
  check('nothing was saved while saves fail', !(await saved()).some((s) => s.startsWith(`${emptyCell}|`)));
  await page.evaluate(() => {
    window.__repo.failWrites = false;
  });
  await page.getByRole('button', { name: 'Retry now' }).click();
  await page.getByText('All changes saved').waitFor({ timeout: 10000 }).catch(() => {});
  check('Retry now saves the change', (await saved()).some((s) => s.startsWith(`${emptyCell}|`)));
  const retryWrong = await gridMatchesSaved();
  check('after the retry the grid shows what is saved', retryWrong.length === 0, retryWrong.slice(0, 3).join('; '));

  // 8. "Show in grid", then another sheet within 1.5 s: the flash still ends (Checkpoint 3 review).
  await page.getByRole('button', { name: /Fix problems/ }).first().click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /Show in grid/ }).first().click();
  await page.waitForTimeout(200);
  await page.getByRole('tab', { name: 'Doctors' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('tab', { name: 'Roster' }).click();
  await page.waitForTimeout(2500);
  check('a flash left for another sheet still ends', (await page.evaluate(() => document.querySelectorAll('td.ring-amber-400').length)) === 0);

  // The next checks need the whole app (its address, Back and Forward).
  const app = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  app.on('pageerror', (e) => errors.push(String(e)));
  const appState = () =>
    app.evaluate(() => ({
      roster: document.querySelector('button[title^="Open another roster"]')?.textContent.replace('▾', ''),
      problems: document.querySelector('#sheet-tab-warnings')?.textContent,
    }));

  // 9. The popup open, then Back to another sheet: the hidden grid's popup closes.
  await app.goto(`${base}/?view=app#schedules?roster=nov&sheet=doctors`);
  await app.waitForTimeout(1500);
  await app.getByRole('tab', { name: 'Roster' }).click();
  await app.waitForSelector('[data-cell="mary|2026-11-16"]');
  await app.waitForTimeout(500);
  await app.click('[data-cell="mary|2026-11-16"]');
  await app.waitForSelector('[data-quick-popup]');
  await app.evaluate(() => history.back());
  await app.waitForTimeout(800);
  check('Back to another sheet closes the popup', (await app.locator('[data-quick-popup]').count()) === 0);

  // 10. An edit on November, then December opened at once: December shows its own problems.
  await app.evaluate(() => history.forward());
  await app.waitForTimeout(800);
  await app.evaluate(() => {
    const nov = [...window.__repo.col('schedules').values()].find((x) => x.id === 'nov');
    window.__repo.col('schedules').set('dec', { ...nov, id: 'dec', name: 'December', startDate: '2026-12-07', endDate: '2026-12-13', blockWeeks: 1, status: 'DRAFT' });
  });
  // Opening the roster picker loads the list again, so December can be opened by its address.
  await app.locator('button[title^="Open another roster"]').click();
  await app.waitForTimeout(500);
  await app.keyboard.press('Escape');
  await app.evaluate(() => { location.hash = '#schedules?roster=dec'; });
  await app.waitForTimeout(2000);
  const decAlone = await appState();
  await app.evaluate(() => { location.hash = '#schedules?roster=nov'; });
  await app.waitForSelector('[data-cell="mary|2026-11-16"]');
  await app.waitForTimeout(1500);
  await app.focus('[data-cell="mary|2026-11-16"]');
  await app.keyboard.press('Delete');
  await app.evaluate(() => { location.hash = '#schedules?roster=dec'; });
  await app.waitForTimeout(2000);
  const decAfter = await appState();
  check(
    'a roster opened just after an edit on another shows its own problems',
    decAlone.roster === 'December' && decAfter.roster === 'December' && decAlone.problems === decAfter.problems,
    `${decAlone.problems} alone, ${decAfter.problems} after the edit`
  );

  // The failed save is expected to log its error; anything else is a problem.
  const unexpected = errors.filter((e) => !/quota|failWrites|RESOURCE_EXHAUSTED|Could not save|fake write failure/i.test(e));
  check('no page errors', unexpected.length === 0, unexpected.slice(0, 3).join(' | '));

  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
