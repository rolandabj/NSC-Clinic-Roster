// Audit trail in pages (UI overhaul Phase 8): 100 records at a time with "Load more", the total
// beside the list, plain words for each change and kind of record, the filter and search over
// the records loaded, "What changed" on the shared Dialog with the fields before and after,
// dates as DD-MM-YYYY, no text under 12 px, and no sideways scrolling on a phone.
// Run: NODE_PATH=$(npm root -g) node audit.cjs [--base http://localhost:5180] [--shots <folder>]
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
    root.evaluate((d) => [...d.querySelectorAll('*')].filter((el) => el.offsetParent !== null && [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 12).map((el) => el.textContent.trim().slice(0, 30)));

  // 230 records: every tenth a publish of a roster, the newest a status change with before and after.
  await page.goto(`${base}/?view=app#dashboard`);
  await page.locator('main').waitFor({ timeout: 60000 });
  const total = await page.evaluate(() => {
    const col = window.__repo.col('audit');
    for (let i = 0; i < 230; i++) {
      const t = new Date(Date.UTC(2026, 9, 1, 8, 0) + i * 60000).toISOString();
      const publish = i % 10 === 0;
      col.set(`t${i}`, {
        id: `t${i}`,
        actor: i === 229 ? 'mary@example.com' : 'owner@example.com',
        action: i === 229 ? 'UPDATE' : publish ? 'PUBLISH' : 'CREATE',
        entity: publish || i === 229 ? 'Schedule' : 'Assignment',
        entityId: `x${i}`,
        note: i === 229 ? 'Status changed by hand' : `Record ${i}`,
        before: i === 229 ? { status: 'DRAFT', startDate: '2026-11-16', name: 'November' } : undefined,
        after: i === 229 ? { status: 'PUBLISHED', startDate: '2026-11-16', name: 'November' } : { done: true },
        timestamp: t,
      });
    }
    return col.size;
  });
  await page.evaluate(() => { window.location.hash = 'audit'; });
  await page.getByRole('heading', { name: 'Audit trail', level: 1 }).waitFor({ timeout: 10000 });
  const table = page.getByRole('table', { name: 'Changes' });
  await table.waitFor({ timeout: 10000 });
  await page.waitForTimeout(400);
  const main = page.locator('main');
  const rows = () => table.locator('tbody tr').count();
  if (shots) await page.screenshot({ path: `${shots}/audit.png`, fullPage: false });

  // 1. One page of 100, newest first, with the total.
  check('the first page has 100 records', (await rows()) === 100, String(await rows()));
  check(`the total says 100 of ${total}`, new RegExp(`The newest 100 of ${total} records`).test(await main.innerText()));
  const first = await table.locator('tbody tr').first().innerText();
  check('newest first, in plain words', /Changed/.test(first) && /Roster/.test(first) && /mary@example\.com/.test(first), first.replace(/\s+/g, ' '));
  check('dates are DD-MM-YYYY', /\d{2}-\d{2}-2026 \d{2}:\d{2}/.test(first) && !/\d{1,2}\/\d{1,2}\/\d{4}/.test(first), first.replace(/\s+/g, ' '));
  const text = await main.innerText();
  const old = text.match(/Ledger|Immutable|Inspect Diff|State Diff|Actor|Entity|\bPUBLISH\b|\bCREATE\b|\bUPDATE\b|OVERRIDE_LOCK/g) || [];
  check('no old words or capital action codes', old.length === 0, old.join(', '));
  check('no text under 12 px', (await smallText(main)).length === 0, (await smallText(main)).slice(0, 5).join(' | '));

  // 2. Load more adds the next 100, then the rest, then the button goes.
  await page.getByRole('button', { name: 'Load 100 more' }).click();
  await page.waitForTimeout(400);
  check('Load more adds the next 100', (await rows()) === 200, String(await rows()));
  await page.getByRole('button', { name: 'Load 100 more' }).click();
  await page.waitForTimeout(400);
  check('the last page brings the rest', (await rows()) === total, `${await rows()} of ${total}`);
  check('no Load more after the last page', (await page.getByRole('button', { name: /^Load \d+ more$/ }).count()) === 0);

  // 3. The filter and the search.
  await page.getByLabel('Kind of change').selectOption('PUBLISH');
  await page.waitForTimeout(300);
  const published = await table.locator('tbody tr').allInnerTexts();
  check('the filter keeps the publishes', published.length >= 23 && published.every((r) => /Published/.test(r)), String(published.length));
  await page.getByLabel('Kind of change').selectOption('ALL');
  await page.getByRole('searchbox', { name: 'Search' }).fill('mary');
  await page.waitForTimeout(300);
  check('the search finds the person', (await rows()) === 1);
  await page.getByRole('searchbox', { name: 'Search' }).fill('nothing like this');
  await page.waitForTimeout(300);
  check('no match says so', /No change matches/.test(await main.innerText()));
  await page.getByRole('searchbox', { name: 'Search' }).fill('');

  // 4. What changed: the fields that changed, before and after, on the shared Dialog.
  await table.getByRole('button', { name: /^What changed for Roster on/ }).first().click();
  const dlg = page.getByRole('dialog', { name: 'What changed' });
  await dlg.waitFor({ timeout: 5000 });
  const changeRows = await dlg.getByRole('table', { name: 'Fields that changed' }).locator('tbody tr').allInnerTexts();
  check('only the changed field is listed', changeRows.length === 1 && /status\s+DRAFT\s+PUBLISHED/.test(changeRows[0]), changeRows.join(' | '));
  check('the dialog names who and when', /by mary@example\.com on \d{2}-\d{2}-2026/.test(await dlg.innerText()));
  check('no text under 12 px in the dialog', (await smallText(dlg)).length === 0, (await smallText(dlg)).slice(0, 5).join(' | '));
  if (shots) await page.screenshot({ path: `${shots}/audit-dialog.png` });
  await page.keyboard.press('Escape');
  await dlg.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  check('Escape closes it', (await dlg.count()) === 0);

  // 5. A phone: cards, no sideways scrolling.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  const wide = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('no sideways scrolling at 390 px', wide <= 0, `${wide} px`);

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
