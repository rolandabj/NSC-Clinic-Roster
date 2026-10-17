// The roster screen's editing dialogs on the shared Dialog (UI overhaul Phase 7, slice 3b): the
// cell editor (choices that say which is picked, leave letters readable on their colour), Swap
// shifts, Fairness (tabs, the table, Gemini's advice), the doctor's clinic editor (a refusal in
// the dialog) and Templates (dates as DD-MM-YYYY).
// Run: NODE_PATH=$(npm root -g) node roster-editing-dialogs.cjs [--base http://localhost:5180] [--shots <folder>]
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

  await page.goto(`${base}/?view=app#schedules?roster=nov`);
  await page.waitForSelector('[data-cell="mary|2026-11-16"]', { timeout: 60000 });
  await page.waitForTimeout(800);

  // 1. The cell editor, opened with Enter.
  await page.locator('[data-cell="amy|2026-11-18"]').click();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Enter');
  const editor = page.getByRole('dialog', { name: 'Amy, Wed 18-11-2026' });
  const opened = await editor.waitFor({ timeout: 5000 }).then(() => true, () => false);
  check('Enter opens the cell editor, named with the nurse and the day', opened);
  if (opened) {
    check('the cell editor has no text under 12 px', (await smallText(editor)).length === 0, (await smallText(editor)).join(' | '));
    check('the shift choices say which one is picked', (await editor.locator('button[aria-pressed="true"]').count()) >= 2);
    await editor.getByRole('button', { name: 'Leave or day off' }).click();
    const contrast = await editor.evaluate((d) => {
      const lum = (c) => {
        const [r, g, b] = c.match(/\d+/g).slice(0, 3).map(Number).map((v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      return [...d.querySelectorAll('span[style]')].map((el) => {
        const s = getComputedStyle(el);
        const [a, c] = [lum(s.color), lum(s.backgroundColor)].sort((x, y) => y - x);
        return (a + 0.05) / (c + 0.05);
      });
    });
    check('each leave letter reads at 4.5:1 or more', contrast.length > 0 && contrast.every((r) => r >= 4.5), contrast.map((r) => r.toFixed(1)).join(','));
    if (shots) await page.screenshot({ path: `${shots}/cell-editor.png` });
    await page.keyboard.press('Escape');
  }

  // 2. Swap shifts.
  await more('Swap two nurses');
  const swap = page.getByRole('dialog', { name: 'Swap shifts' });
  await swap.waitFor({ timeout: 5000 });
  check('Swap has no text under 12 px', (await smallText(swap)).length === 0, (await smallText(swap)).join(' | '));
  check("Swap labels each nurse's shift", (await swap.getByLabel("First nurse's shift to give away").count()) === 1 && (await swap.getByLabel("Second nurse's shift to give away").count()) === 1);
  await page.keyboard.press('Escape');

  // 3. Fairness: shared tabs and table; Gemini named plainly.
  await more('Fairness');
  const fair = page.getByRole('dialog', { name: 'Fairness' });
  await fair.waitFor({ timeout: 5000 });
  check('Fairness has three tabs', (await fair.getByRole('tab').count()) === 3);
  check('Fairness has a table of nurses', (await fair.getByRole('table').count()) === 1);
  check('Fairness has no text under 12 px', (await smallText(fair)).length === 0, (await smallText(fair)).join(' | '));
  check('no model version or title case in the Gemini tab', /Advice from Gemini/.test(await fair.innerText()) && !/3\.8 Flash|Roster Intelligence|Analyze Roster/.test(await fair.innerText()));
  await fair.getByRole('tab', { name: /Suggested changes/ }).click();
  await page.waitForTimeout(1500);
  check('Suggested changes shows its moves or says there are none', /No moves to suggest|Suggested moves|Move \d/.test(await fair.innerText()));
  if (shots) await page.screenshot({ path: `${shots}/fairness.png` });
  await page.keyboard.press('Escape');

  // 4. Templates: shared tabs, dates as DD-MM-YYYY.
  await more('Templates and copy last roster');
  const tpl = page.getByRole('dialog', { name: 'Templates and copy last roster' });
  await tpl.waitFor({ timeout: 5000 });
  await tpl.getByRole('tab', { name: 'Copy an earlier roster' }).click();
  const options = await tpl.getByLabel('Roster to copy from').evaluate((s) => [...s.options].map((o) => o.textContent).join(' | ')).catch(() => '');
  check('the rosters to copy show their dates as DD-MM-YYYY', !/\d{4}-\d{2}-\d{2}/.test(options), options);
  check('Templates has no text under 12 px', (await smallText(tpl)).length === 0, (await smallText(tpl)).join(' | '));
  await page.keyboard.press('Escape');

  // 5. The doctor's clinic editor: a refusal stays in the dialog.
  await page.getByRole('tab', { name: 'Doctors' }).click();
  await page.waitForTimeout(800);
  const clinic = page.getByRole('button', { name: /^Change clinic for Dr Ray on 17-11-2026/ });
  const hasClinic = await clinic.waitFor({ timeout: 5000 }).then(() => true, () => false);
  check('the Doctors sheet offers to change a clinic', hasClinic);
  if (hasClinic) {
    await clinic.click();
    const edit = page.getByRole('dialog', { name: "Change the doctor's clinic" });
    await edit.waitFor({ timeout: 5000 });
    check('the clinic editor names the doctor and the day', /Dr Ray, Tuesday 17-11-2026/.test(await edit.innerText()));
    check('the clinic editor has no text under 12 px', (await smallText(edit)).length === 0, (await smallText(edit)).join(' | '));
    await edit.getByLabel('End time').fill('08:00');
    await edit.getByRole('button', { name: 'Save', exact: true }).click();
    check('a clinic that ends before it starts is refused in the dialog', /The clinic must end after it starts/.test(await edit.innerText()));
    if (shots) await page.screenshot({ path: `${shots}/doctor-clinic.png` });
    await page.keyboard.press('Escape');
  }

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
