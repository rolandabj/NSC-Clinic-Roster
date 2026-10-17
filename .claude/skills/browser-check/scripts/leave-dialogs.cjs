// The Leave and days off dialogs on the shared Dialog (UI overhaul Phase 7, slice 1): the leave
// editor with its refusals inside the dialog, Pin a day, Remove the pin with OVERRIDE, the CSV
// import listing every row it refused, corner messages kept off a dialog's buttons, and the
// nurse names in the grid shown in full.
// The browser's clock is set to 14-10-2026.
// Run: NODE_PATH=$(npm root -g) node leave-dialogs.cjs [--base http://localhost:5180] [--shots <folder>]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  await context.addInitScript(() => {
    const fixed = new Date('2026-10-14T09:00:00').getTime();
    const RealDate = Date;
    // eslint-disable-next-line no-global-assign
    Date = class extends RealDate {
      constructor(...a) {
        super(...(a.length ? a : [fixed]));
      }
      static now() {
        return fixed;
      }
    };
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const results = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });
  const col = (name) => page.evaluate((n) => [...window.__repo.col(n).values()], name);
  const smallText = (dialog) =>
    dialog.evaluate((d) => [...d.querySelectorAll('*')].filter((el) => el.childNodes.length && [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 12).length);

  await page.goto(`${base}/?view=app#availability`);
  await page.getByRole('heading', { level: 1, name: 'Leave and days off' }).waitFor({ timeout: 60000 });

  // Nurse names are not cut short by the allowance badges beside them (they read "A.." before).
  const cut = await page.locator('tbody th[scope="row"] span.truncate').evaluateAll((els) => els.filter((e) => e.scrollWidth > e.clientWidth).map((e) => e.textContent));
  check('no nurse name is cut short in the grid', cut.length === 0, cut.join(', '));

  // 1. Pin a day: a shared dialog with labelled fields; the pin is saved.
  await page.getByRole('button', { name: 'Pin a day' }).click();
  const pin = page.getByRole('dialog', { name: 'Pin a day' });
  await pin.waitFor({ timeout: 5000 });
  await pin.getByLabel('Nurse').selectOption('amy');
  await pin.getByLabel('Day').fill('20-10-2026');
  await pin.getByLabel('What is pinned').selectOption('OFF');
  check('a day off hides the shift fields', (await pin.getByLabel('Shift').count()) === 0);
  check('the pin dialog has no text under 12 px', (await smallText(pin)) === 0);
  await pin.getByRole('button', { name: 'Pin the day' }).click();
  await pin.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  const pins = await col('locks');
  check('the pinned day is saved', pins.some((l) => l.nurseId === 'amy' && l.date === '2026-10-20' && l.mode === 'OFF'), JSON.stringify(pins).slice(0, 160));

  // 2. A corner message moves off a dialog's buttons while one is open.
  await page.getByRole('button', { name: 'Record leave' }).first().click();
  const leave = page.getByRole('dialog', { name: 'Record leave' });
  await leave.waitFor({ timeout: 5000 });
  const message = page.locator('[aria-live="polite"][data-over-dialog]').getByRole('status').first();
  const box = await message.boundingBox().catch(() => null);
  const save = await leave.getByRole('button', { name: 'Record leave', exact: true }).boundingBox();
  const overlap = box && save && box.x < save.x + save.width && save.x < box.x + box.width && box.y < save.y + save.height && save.y < box.y + box.height;
  check('the message "Day pinned" moved to the top, off the Save button', box && !overlap, JSON.stringify({ box, save }));
  if (shots) await page.screenshot({ path: `${shots}/leave-editor.png` });

  // 3. The leave editor: labelled fields, dates as DD-MM-YYYY, refusals inside the dialog.
  check('the leave editor has no text under 12 px', (await smallText(leave)) === 0);
  await leave.getByLabel('Nurse').selectOption('nina');
  await leave.getByLabel('Kind of leave').selectOption('lt-al');
  check('the kind of leave says what it counts', /Counts 8 h a day/.test(await leave.innerText()));
  await leave.getByLabel('First day').fill('25-10-2026');
  await leave.getByLabel('Last day').fill('28-10-2026');
  await leave.getByRole('button', { name: 'Record leave', exact: true }).click();
  await page.waitForTimeout(300);
  check('a leave over another is refused inside the dialog', /This nurse already has leave on Mon 26-10-2026/.test(await leave.getByRole('alert').innerText().catch(() => '')));
  await leave.getByLabel('First day').fill('29-10-2026');
  check('changing a date clears the refusal', (await leave.getByRole('alert').count()) === 0);
  await leave.getByLabel('Last day').fill('');
  await leave.getByRole('button', { name: 'Record leave', exact: true }).click();
  check('an empty last day is named', /Enter the last day, like 19-10-2026/.test(await leave.innerText()));
  await leave.getByLabel('Last day').fill('30-10-2026');
  await leave.getByRole('button', { name: 'Record leave', exact: true }).click();
  await leave.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  const nina = (await col('leaveEntries')).find((l) => l.nurseId === 'nina' && l.startDate === '2026-10-29');
  check('the leave is saved with its dates and approved', nina && nina.endDate === '2026-10-30' && nina.status === 'APPROVED', JSON.stringify(nina || {}));

  // 4. Remove the pin: an alert dialog that needs OVERRIDE.
  await page.getByRole('button', { name: /^Amy, Tue 20-10-2026/ }).click();
  const remove = page.getByRole('alertdialog', { name: 'Remove the pin?' });
  await remove.waitFor({ timeout: 5000 });
  check('the question names the nurse, the day and what is pinned', /Amy, Tue 20-10-2026: a day off/.test(await remove.innerText()));
  check('Remove the pin waits for OVERRIDE', await remove.getByRole('button', { name: 'Remove the pin' }).isDisabled());
  await remove.getByLabel('To remove the pin, type OVERRIDE').fill('override');
  await remove.getByRole('button', { name: 'Remove the pin' }).click();
  await remove.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  check('the pin is removed', !(await col('locks')).some((l) => l.nurseId === 'amy' && l.date === '2026-10-20'));

  // 5. The CSV import lists each refused row.
  await page.getByRole('button', { name: 'Import leave from CSV' }).click();
  const csv = page.getByRole('dialog', { name: 'Import leave from CSV' });
  await csv.waitFor({ timeout: 5000 });
  await csv.getByLabel('Rows to import').fill('mary@example.com, AL, 02-11-2026, 03-11-2026\nnobody@example.com, AL, 02-11-2026, 02-11-2026\nmary@example.com, AL, 31-02-2026, 01-03-2026');
  await csv.getByRole('button', { name: 'Import', exact: true }).click();
  await page.waitForTimeout(600);
  const csvText = await csv.innerText();
  check('the import says how many it imported and refused', /1 leave imported, 2 rows not imported/.test(csvText), csvText.slice(0, 300));
  check('each refused row is named', /Row 2: no nurse has the email nobody@example.com/.test(csvText) && /Row 3: 31-02-2026 is not a date/.test(csvText));
  check('the good row is saved', (await col('leaveEntries')).some((l) => l.nurseId === 'mary' && l.startDate === '2026-11-02' && l.endDate === '2026-11-03'));
  if (shots) await page.screenshot({ path: `${shots}/leave-import.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  check('Esc closes the import', (await page.getByRole('dialog').count()) === 0);

  // 6. On a phone the leave editor fits.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Record leave' }).first().click();
  const phone = page.getByRole('dialog', { name: 'Record leave' });
  await phone.waitFor({ timeout: 5000 });
  check('on a phone the leave editor does not scroll sideways', await phone.evaluate((d) => d.scrollWidth <= d.clientWidth + 1));
  if (shots) await page.screenshot({ path: `${shots}/leave-editor-390.png` });

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
