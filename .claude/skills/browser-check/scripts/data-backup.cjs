// Settings, Data and backup (UI overhaul Phase 8, slice 1f): the counts in plain words and right,
// a backup downloads, Restore and Delete open their dialogs, and a phone without sideways scroll.
// Run: NODE_PATH=$(npm root -g) node data-backup.cjs [--base http://localhost:5180]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, acceptDownloads: true });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const results = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });
  const smallText = (root) =>
    root.evaluate((d) => [...d.querySelectorAll('*')].filter((el) => [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 12).map((el) => el.textContent.trim().slice(0, 30)));
  const main = page.locator('main');

  await page.goto(`${base}/?view=app&as=owner#settings?tab=database`);
  await page.getByRole('heading', { name: 'Data and backup', level: 2 }).waitFor({ timeout: 60000 });
  await page.waitForTimeout(1200);
  const text = await main.innerText();
  check('no old words (Danger Zone, Assignments, Pinned Locks, Safety Rules, Audit Events)', !/Danger Zone|Assignments|Pinned Locks|Safety Rules|Audit Events|Sessions\b/.test(text));
  check('no text under 12 px', (await smallText(main)).length === 0, (await smallText(main)).slice(0, 5).join(' | '));
  const nurses = await page.evaluate(() => window.__repo.col('nurses').size);
  const shifts = await page.evaluate(() => window.__repo.col('assignments').size);
  const tile = async (label) => (await main.locator('dl div').filter({ has: page.locator('dt', { hasText: new RegExp(`^${label}$`) }) }).locator('dd').innerText()).trim();
  check('the nurses are counted', (await tile('Nurses')) === String(nurses), `${await tile('Nurses')} vs ${nurses}`);
  check('the shifts are counted', (await tile('Shifts')) === String(shifts), `${await tile('Shifts')} vs ${shifts}`);

  const [download] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }).catch(() => null), main.getByRole('button', { name: 'Download a backup' }).click()]);
  check('Download a backup downloads a file', !!download && /\.json$/.test(download.suggestedFilename()), download ? download.suggestedFilename() : 'no download');

  await main.getByRole('button', { name: 'Delete all clinic data' }).click();
  const del = page.getByRole('dialog', { name: 'Delete all clinic data?' }).or(page.getByRole('alertdialog', { name: 'Delete all clinic data?' }));
  await del.first().waitFor({ timeout: 5000 });
  check('Delete waits for CLEAR', await del.first().getByRole('button', { name: 'Download a backup and delete' }).isDisabled());
  await page.keyboard.press('Escape');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  check('no sideways scroll on a phone', (await page.evaluate(() => document.documentElement.scrollWidth)) <= 390);

  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})();
