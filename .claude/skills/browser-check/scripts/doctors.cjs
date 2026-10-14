// The Doctors screen (UI overhaul Phase 6, slice 3): the shared table with search and
// filters, the clinics of the chosen doctor with dates as DD-MM-YYYY, the editor that checks
// each field (clashing clinic times too), and removing only from the editor, with Make
// inactive first. Checks at 1366 px and on a 390 px phone.
// Run: NODE_PATH=$(npm root -g) node doctors.cjs [--base http://localhost:5180] [--shots <folder>]
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
  const table = page.getByRole('table', { name: 'Doctors' });
  const names = async () => (await table.locator('tbody th').allInnerTexts()).map((t) => t.split('\n')[0]);
  const body = () => page.locator('body').innerText();

  await page.goto(`${base}/?view=doctors`);
  await page.getByRole('heading', { level: 1, name: 'Doctors' }).waitFor({ timeout: 60000 });
  check('the heading counts the doctors', /2 doctors, 2 active/.test(await body()));
  check('the old app name is gone', !/ClinicRoster/.test(await body()));
  check('no Delete button in the list', (await table.getByRole('button', { name: /delete|remove/i }).count()) === 0);
  check('the usual week reads in words', /Monday 09:00 to 17:00, R1/.test(await table.innerText()));

  // The chosen doctor's clinics, with dates as DD-MM-YYYY.
  await page.getByRole('button', { name: 'Clinics of Dr Ray' }).click();
  const clinics = page.getByRole('region', { name: 'Clinics of Dr Ray' });
  await clinics.waitFor({ timeout: 5000 });
  const clinicText = await clinics.innerText();
  check('Clinics shows that doctor beside the list', /Tue 17-11-2026/.test(clinicText), clinicText.slice(0, 160));
  check('no date in the clinics reads as YYYY-MM-DD', !/\d{4}-\d{2}-\d{2}/.test(clinicText));
  check('the chosen doctor is marked as pressed', (await page.getByRole('button', { name: 'Clinics of Dr Ray' }).getAttribute('aria-pressed')) === 'true');
  if (shots) await page.screenshot({ path: `${shots}/doctors-1366.png` });

  // Search and filters.
  await page.getByLabel('Search').fill('RAY');
  await page.waitForTimeout(200);
  check('the search finds a doctor by name in any case', (await names()).join(',') === 'Dr Ray');
  await page.getByLabel('Search').fill('');
  await page.getByLabel('Specialty').selectOption({ label: 'Orthopaedics' });
  await page.waitForTimeout(200);
  check('the specialty filter narrows the list', (await names()).join(',') === 'Dr Lee');
  await page.getByLabel('Specialty').selectOption({ label: 'All specialties' });

  // The editor checks each field, clinic times too.
  await page.getByRole('button', { name: 'Edit Dr Lee' }).click();
  const lee = page.getByRole('dialog', { name: 'Edit Dr Lee' });
  await lee.waitFor({ timeout: 5000 });
  await lee.getByRole('button', { name: 'Add a clinic to the week' }).click();
  await lee.getByLabel('Day, clinic 2').selectOption({ label: 'Monday' });
  await lee.getByLabel('Starts').nth(1).fill('10:00');
  await lee.getByLabel('Ends').nth(1).fill('12:00');
  await lee.getByLabel('Ends').nth(1).blur();
  check('a clinic that overlaps another that day is named', /Overlaps the Monday clinic from 09:00 to 17:00/.test(await lee.innerText()));
  await lee.getByLabel('Ends').first().fill('08:00');
  await lee.getByRole('button', { name: 'Save changes' }).click();
  await page.waitForTimeout(300);
  // Clinic 1 now ends before it starts, so clinic 2 no longer overlaps it: one field to fix.
  check('Save says how many fields need fixing', /1 field needs fixing/.test(await lee.innerText()) && /The end time must be after the start time/.test(await lee.innerText()));
  check('Save puts the focus on the first field to fix', (await page.evaluate(() => document.activeElement?.getAttribute('aria-invalid'))) === 'true');
  if (shots) await page.screenshot({ path: `${shots}/doctor-editor.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  check('nothing was saved', (await page.evaluate(() => window.__repo.col('doctors').get('lee').weeklyPattern.length)) === 1);

  // A new doctor without a usual week, then removed for good from the editor.
  await page.getByRole('button', { name: 'Add doctor' }).first().click();
  const add = page.getByRole('dialog', { name: 'Add doctor' });
  await add.getByRole('button', { name: 'Remove clinic 1' }).click();
  await add.getByRole('button', { name: 'Add doctor' }).click();
  await page.waitForTimeout(300);
  check('a new doctor needs a name', /1 field needs fixing/.test(await add.innerText()) && /Enter the doctor's full name/.test(await add.innerText()));
  await add.getByLabel('Full name').fill('Dr Sami Noor');
  await add.getByRole('button', { name: 'Add doctor' }).click();
  await add.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  check('the new doctor is saved', (await names()).includes('Dr Sami Noor'));
  await page.getByRole('button', { name: 'Edit Dr Sami Noor' }).click();
  const sami = page.getByRole('dialog', { name: 'Edit Dr Sami Noor' });
  check('the editor offers Make inactive before removing', (await sami.getByRole('button', { name: 'Make inactive' }).count()) === 1);
  await sami.getByRole('button', { name: 'Remove for good' }).click();
  const ask = page.getByRole('alertdialog');
  check('removing asks first, and says it cannot be undone', /cannot be undone/.test(await ask.innerText()));
  await ask.getByRole('button', { name: 'Remove for good' }).click();
  await page.waitForTimeout(600);
  check('Remove for good deletes the doctor', !(await names()).includes('Dr Sami Noor'));

  // Make inactive asks from which date their clinics stop.
  await page.getByRole('button', { name: 'Edit Dr Ray' }).click();
  await page.getByRole('dialog', { name: 'Edit Dr Ray' }).getByRole('button', { name: 'Make inactive' }).click();
  const from = page.getByRole('button', { name: /^Save and change from/ });
  await from.waitFor({ timeout: 5000 }).catch(() => {});
  check('Make inactive asks from which date', (await from.count()) === 1);
  await from.click();
  await page.waitForTimeout(800);
  check('Make inactive saves the doctor as inactive', (await page.evaluate(() => window.__repo.col('doctors').get('ray').active)) === false);

  // A phone: one card for each doctor, and nothing scrolls sideways.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  check('on a phone each doctor is a card', (await page.getByRole('list', { name: 'Doctors' }).getByRole('listitem').count()) === 2);
  check('on a phone the page does not scroll sideways', !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));
  if (shots) await page.screenshot({ path: `${shots}/doctors-390.png`, fullPage: true });

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
