// Requests' All tab and the Doctors dialogs on the shared parts (UI overhaul Phase 7, slice 2):
// the All tab's table, filters and change dialog, the delete question, Put usual weeks on dates
// and the clinic editor, each with its refusals inside the dialog.
// Run: NODE_PATH=$(npm root -g) node request-clinic-dialogs.cjs [--base http://localhost:5180] [--shots <folder>]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const results = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });
  const smallText = (root) =>
    root.evaluate((d) => [...d.querySelectorAll('*')].filter((el) => [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 12).map((el) => el.textContent.trim().slice(0, 30)));

  // 1. Requests, All tab.
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${base}/?view=app&as=owner#dashboard`);
  await page.locator('main').waitFor({ timeout: 60000 });
  await page.evaluate(() => {
    window.__repo.col('availabilityRequests').set('av1', { id: 'av1', nurseId: 'amy', date: '2026-11-18', available: false, status: 'PENDING', note: 'Family visit' });
  });
  await page.evaluate(() => { window.location.hash = 'requests?tab=all'; });
  await page.getByRole('heading', { level: 1, name: 'Requests' }).waitFor({ timeout: 10000 });
  await page.waitForTimeout(600);
  const main = page.locator('main');
  check('the request shows its day with the weekday and its status', /Wed 18-11-2026/.test(await main.innerText()) && /Waiting/.test(await main.innerText()));
  check('the All tab has no text under 12 px', (await smallText(main)).length === 0, (await smallText(main)).join(' | '));
  await page.getByRole('button', { name: 'Approve Amy: day off on Wed 18-11-2026' }).click();
  await page.waitForTimeout(500);
  check('an approval is saved', (await page.evaluate(() => window.__repo.col('availabilityRequests').get('av1').status)) === 'APPROVED');
  await page.getByRole('button', { name: 'Delete Amy: day off on Wed 18-11-2026' }).click();
  const ask = page.getByRole('alertdialog');
  await ask.waitFor({ timeout: 5000 });
  const askText = await ask.innerText();
  check('the delete question says "the nurse", not "she"', /so the nurse can be given a shift that day/.test(askText) && !/\bshe\b/.test(askText), askText);
  await ask.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'Change Amy: day off on Wed 18-11-2026' }).click();
  const edit = page.getByRole('dialog', { name: "Change Amy's request" });
  await edit.waitFor({ timeout: 5000 });
  check('the change dialog shows the date as DD-MM-YYYY', (await edit.getByLabel('Date').inputValue()) === '18-11-2026');
  await edit.getByLabel('Date').fill('');
  await edit.getByRole('button', { name: 'Save changes' }).click();
  check('an empty date is refused inside the dialog', /Enter the date, like 18-11-2026/.test(await edit.innerText()));
  await edit.getByLabel('Date').fill('19-11-2026');
  check('a typed date clears the refusal', !/Enter the date/.test(await edit.innerText()));
  await edit.getByLabel('Request').selectOption('SHIFT');
  check('a shift asks which shift', (await edit.getByLabel('Shift asked for').count()) === 1);
  if (shots) await page.screenshot({ path: `${shots}/request-change.png` });
  await edit.getByRole('button', { name: 'Save changes' }).click();
  await edit.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  const saved = await page.evaluate(() => window.__repo.col('availabilityRequests').get('av1'));
  check('the change is saved', saved.date === '2026-11-19' && saved.available === true, JSON.stringify(saved).slice(0, 160));
  await page.getByLabel('Status').selectOption('REJECTED');
  check('the filters work', /0 requests shown/.test(await main.innerText()));
  await page.close();

  // 2. Doctors: Put usual weeks on dates.
  const doc = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  doc.on('pageerror', (e) => errors.push(String(e)));
  await doc.goto(`${base}/?view=doctors`);
  await doc.getByRole('button', { name: 'Put usual weeks on dates' }).waitFor({ timeout: 60000 });
  await doc.getByRole('button', { name: 'Put usual weeks on dates' }).click();
  const weeks = doc.getByRole('dialog', { name: 'Put usual weeks on dates' });
  await weeks.waitFor({ timeout: 5000 });
  check('the usual weeks dialog has no text under 12 px', (await smallText(weeks)).length === 0);
  await weeks.getByLabel('First day').fill('30-11-2026');
  await weeks.getByLabel('Last day').fill('01-11-2026');
  await weeks.getByRole('button', { name: 'Put on dates' }).click();
  check('a last day before the first is refused inside the dialog', /The last day is before the first day/.test(await weeks.innerText()));
  await weeks.getByLabel('First day').fill('01-11-2026');
  check('changing a day clears the refusal', !/The last day is before the first day/.test(await weeks.innerText()));
  await weeks.getByLabel('Last day').fill('30-11-2026');
  await weeks.getByRole('button', { name: 'Put on dates' }).click();
  await weeks.waitFor({ state: 'detached', timeout: 8000 }).catch(() => {});
  check('the usual weeks are put on dates', (await doc.getByRole('dialog').count()) === 0 && /Usual weeks put on dates/.test(await doc.locator('body').innerText()));

  // 3. The clinic editor: the date of a clinic already there is shown, not changed.
  await doc.getByRole('button', { name: 'Clinics of Dr Ray' }).click();
  await doc.getByRole('button', { name: 'Change the clinic of Tue 17-11-2026' }).click();
  const clinic = doc.getByRole('dialog', { name: 'Change the clinic' });
  await clinic.waitFor({ timeout: 5000 });
  check('the clinic editor names the doctor and the day', /Dr Ray, Tue 17-11-2026/.test(await clinic.innerText()));
  check('the date of a clinic already there cannot be changed', (await clinic.getByLabel('Date').count()) === 0);
  await clinic.getByLabel('Ends').fill('08:00');
  await clinic.getByRole('button', { name: 'Save changes' }).click();
  check('a clinic that ends before it starts is refused', /The clinic must end after it starts/.test(await clinic.innerText()));
  await clinic.getByLabel('Ends').fill('14:00');
  await clinic.getByRole('button', { name: 'Save changes' }).click();
  await clinic.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  const ray = await doc.evaluate(() => [...window.__repo.col('doctorSessions').values()].find((s) => s.doctorId === 'ray' && s.date === '2026-11-17'));
  check('the new end time is saved on the same day', ray && ray.endTime === '14:00', JSON.stringify(ray || {}));
  await doc.getByRole('button', { name: 'Add a clinic' }).click();
  const add = doc.getByRole('dialog', { name: 'Add a clinic' });
  await add.waitFor({ timeout: 5000 });
  check('a new clinic asks for its date', (await add.getByLabel('Date').count()) === 1);
  if (shots) await doc.screenshot({ path: `${shots}/clinic-add.png` });
  await doc.keyboard.press('Escape');
  await doc.close();

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
