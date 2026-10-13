// The roster screen's toolbar (UI overhaul Phase 4, slice 3): one line from 1024 px, More in four
// named groups, the keys in More, and each of More's entries opening its dialog.
// Run: NODE_PATH=$(npm root -g) node toolbar.cjs [--base http://localhost:5180] [--shots <folder>]
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

  await page.goto(`${base}/?view=app#schedules?roster=nov`);
  await page.waitForSelector('[data-cell="mary|2026-11-16"]', { timeout: 60000 });
  await page.waitForTimeout(800);

  // An edit and its undo, so the save status ("All changes saved") is on the line too.
  await page.focus('[data-cell="mary|2026-11-16"]');
  await page.keyboard.press('Delete');
  await page.keyboard.press('Control+z');
  await page.getByText('All changes saved').waitFor({ timeout: 10000 }).catch(() => {});
  check('the save status shows', (await page.getByText('All changes saved').count()) === 1);

  // 1. One line from 1024 px: Undo, Fill roster, Publish and More on the roster's line.
  const line = () =>
    page.evaluate(() => {
      const top = (el) => Math.round(el.getBoundingClientRect().top);
      const picker = document.querySelector('button[title^="Open another roster"]');
      const more = [...document.querySelectorAll('button')].find((b) => b.getAttribute('aria-label') === 'More actions');
      return { picker: top(picker), more: top(more), scroll: document.documentElement.scrollWidth > window.innerWidth + 1 };
    });
  for (const width of [1024, 1280, 1366, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(300);
    const l = await line();
    check(`one line at ${width} px`, Math.abs(l.picker - l.more) < 8 && !l.scroll, JSON.stringify(l));
    if (shots) await page.screenshot({ path: `${shots}/toolbar-${width}.png`, clip: { x: 0, y: 0, width, height: 200 } });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  check('no sideways page scroll at 390 px', !(await line()).scroll);
  if (shots) await page.screenshot({ path: `${shots}/toolbar-390.png`, clip: { x: 0, y: 0, width: 390, height: 260 } });
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.waitForTimeout(300);

  // 2. More: four named groups, the nine entries, the keys.
  await page.getByRole('button', { name: 'More actions' }).click();
  const menu = page.getByRole('menu');
  const groups = await menu.getByRole('group').evaluateAll((els) => els.map((g) => document.getElementById(g.getAttribute('aria-labelledby'))?.textContent));
  check('More has four named groups', JSON.stringify(groups) === JSON.stringify(['Roster', 'Copies', 'Share and export', 'Tools']), JSON.stringify(groups));
  check('nine entries', (await menu.getByRole('menuitem').count()) === 9);
  if (shots) await page.screenshot({ path: `${shots}/toolbar-more.png` });
  const focused = () => page.evaluate(() => document.activeElement.textContent);
  check('the first entry has the focus', /^New roster/.test(await focused()));
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  check('Arrow down crosses into the next group', /^Keep a copy/.test(await focused()));
  await page.keyboard.press('End');
  check('End goes to the last entry', /^Swap two nurses/.test(await focused()));
  await page.keyboard.press('ArrowDown');
  check('and Arrow down wraps to the first', /^New roster/.test(await focused()));
  await page.keyboard.press('Escape');
  check('Esc closes More and gives the focus back', (await menu.count()) === 0 && (await page.evaluate(() => document.activeElement.getAttribute('aria-label'))) === 'More actions');

  // 3. Each entry opens its dialog.
  const entries = ['New roster', 'Templates and copy last roster', 'Keep a copy', 'Backup copies', 'Compare saved copies', 'Export or print', 'Share links', 'Fairness', 'Swap two nurses'];
  for (const entry of entries) {
    await page.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: new RegExp(`^${entry}`) }).click();
    const dialog = page.getByRole('dialog').first();
    const opened = await dialog.waitFor({ timeout: 5000 }).then(() => true, () => false);
    check(`${entry} opens its dialog`, opened);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    if (await page.getByRole('dialog').count()) {
      const close = page.getByRole('dialog').first().getByRole('button', { name: /^(Close|Cancel)/ }).first();
      if (await close.count()) await close.click();
      await page.waitForTimeout(300);
    }
  }

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
