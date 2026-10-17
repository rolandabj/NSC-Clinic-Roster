// The large forms on the shared Dialog (UI overhaul Phase 7, slice 3c): New roster (a plain
// suggested name, dates as DD-MM-YYYY), Export or print (tabs), Share links (the invitations
// warning), the timesheet (Close always there) and the CSV import of nurses and doctors (every
// problem named, a doctor's usual week read from the file).
// Run: NODE_PATH=$(npm root -g) node form-dialogs.cjs [--base http://localhost:5180] [--shots <folder>]
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

  // 1. New roster.
  await more('New roster');
  const nr = page.getByRole('dialog', { name: 'New roster' });
  await nr.waitFor({ timeout: 5000 });
  const name = await nr.getByLabel('Roster name').inputValue();
  check('the suggested name has no dashes and no US dates', name && !/[—–]/.test(name) && !/\b(Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/.test(name), name);
  check('the first day shows as DD-MM-YYYY', /^\d{2}-\d{2}-\d{4}$/.test(await nr.getByLabel('First day').inputValue()));
  check('New roster has no text under 12 px', (await smallText(nr)).length === 0, (await smallText(nr)).join(' | '));
  await nr.getByLabel('Last day').fill('01-01-2020');
  check('a last day before the first is named', /The last day is before the first day/.test(await nr.innerText()));
  if (shots) await page.screenshot({ path: `${shots}/new-roster.png` });
  await page.keyboard.press('Escape');

  // 2. Export or print.
  await more('Export or print');
  const ex = page.getByRole('dialog', { name: 'Export or print' });
  await ex.waitFor({ timeout: 10000 });
  await page.waitForTimeout(800);
  check('Export has five tabs', (await ex.getByRole('tab').count()) === 5);
  check('Export shows the roster dates as DD-MM-YYYY', /16-11-2026 to 29-11-2026/.test(await ex.innerText()));
  check('Export says "their shift", not "her"', !/\bher\b|\bhim\b/.test(await ex.innerText()));
  check('Export has no text under 12 px', (await smallText(ex)).length === 0, (await smallText(ex)).join(' | '));
  await page.keyboard.press('Escape');

  // 3. Share links: the invitations tab says plainly that it gives no access.
  await more('Share links');
  const sh = page.getByRole('dialog', { name: 'Share links' });
  await sh.waitFor({ timeout: 5000 });
  await sh.getByRole('tab', { name: /^Invitations/ }).click();
  check('Invitations say they do not give access yet', /An invitation does not give access yet/.test(await sh.innerText()));
  check('Share has no text under 12 px', (await smallText(sh)).length === 0, (await smallText(sh)).join(' | '));
  await page.keyboard.press('Escape');

  // 4. The timesheet, from the Hours sheet.
  await page.getByRole('tab', { name: 'Hours' }).click();
  await page.waitForTimeout(800);
  await page.locator('tbody tr[tabindex="0"]').first().click();
  const ts = page.getByRole('dialog', { name: /'s timesheet$/ });
  const tsOpen = await ts.waitFor({ timeout: 5000 }).then(() => true, () => false);
  check('the timesheet opens from the Hours sheet', tsOpen);
  if (tsOpen) {
    check('the timesheet always has Close at the bottom, not only the X', (await ts.getByRole('button', { name: 'Close', exact: true }).count()) === 2);
    check('the timesheet shows its dates as DD-MM-YYYY', !/\d{4}-\d{2}-\d{2}/.test(await ts.innerText()));
    check('the timesheet filters say which is chosen', (await ts.locator('button[aria-pressed="true"]').count()) === 1);
    check('the timesheet has no text under 12 px', (await smallText(ts)).length === 0, (await smallText(ts)).join(' | '));
    if (shots) await page.screenshot({ path: `${shots}/timesheet.png` });
    await page.keyboard.press('Escape');
  }

  // 5. Import nurses and doctors.
  await page.goto(`${base}/?view=nurses`);
  await page.getByRole('heading', { level: 1, name: 'Nurses' }).waitFor({ timeout: 60000 });
  await page.getByRole('button', { name: 'Import from CSV' }).click();
  const im = page.getByRole('dialog', { name: 'Import from a CSV file' });
  await im.waitFor({ timeout: 5000 });
  await page.waitForTimeout(500);
  await im.getByLabel('Or paste the rows').fill('fullName,gmail,employeeCode,seniorityLevel,contractPercent,dateOfBirth,capabilities\nLina,amy@example.com,,Matron,100,,\nOmar,omar@example.com,,,100,14-05-1992,');
  const imText = await im.innerText();
  check('each problem in a row is named', /already has the email amy@example.com/.test(imText) && /no nurse level is called Matron/i.test(imText), imText.slice(0, 400));
  check('nothing is imported while a row needs fixing', await im.getByRole('button', { name: /^Import \d/ }).isDisabled());
  if (shots) await page.screenshot({ path: `${shots}/import.png` });
  await im.getByRole('tab', { name: 'Doctors' }).click();
  await im.getByLabel('Or paste the rows').fill('fullName,gmail,specialties,weeklyPattern\nDr Hamad,hamad@clinic.ae,ent,Mon 14:00-18:00 Room 4');
  await page.waitForTimeout(300);
  const importButton = im.getByRole('button', { name: /^Import 1 doctor/ });
  const ready = !(await importButton.isDisabled().catch(() => true));
  check('a good doctor row is ready', ready, (await im.innerText()).slice(0, 300));
  if (ready) {
    await importButton.click();
    await im.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
    const hamad = await page.evaluate(() => [...window.__repo.col('doctors').values()].find((d) => d.fullName === 'Dr Hamad'));
    check("the doctor's usual week comes from the file", hamad && JSON.stringify(hamad.weeklyPattern) === JSON.stringify([{ weekday: 1, startTime: '14:00', endTime: '18:00', room: 'Room 4' }]), JSON.stringify(hamad || {}));
  }

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
