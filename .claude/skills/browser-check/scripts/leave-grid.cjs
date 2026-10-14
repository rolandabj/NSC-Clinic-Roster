// The leave grid without dragging (UI overhaul Phase 6, slice 5; WCAG 2.5.7): click the first
// and the last day, Esc to stop, the arrow keys and Enter, dragging still working, readable
// leave letters and "pinned day" wording. The browser's clock is set to 14-10-2026.
// Run: NODE_PATH=$(npm root -g) node leave-grid.cjs [--base http://localhost:5180] [--shots <folder>]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  await context.addInitScript(() => {
    // October 2026 on every run, whatever the real date.
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
  const day = (name) => page.getByRole('button', { name, exact: true });
  const leaveDialogDates = async () => {
    const d = page.getByRole('dialog');
    await d.waitFor({ timeout: 5000 });
    const v = [await d.getByLabel('Start Date').inputValue(), await d.getByLabel('End Date').inputValue()];
    await page.keyboard.press('Escape');
    await d.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
    return v.join(' to ');
  };

  await page.goto(`${base}/?view=app#availability`);
  await page.getByRole('heading', { level: 1, name: 'Leave and days off' }).waitFor({ timeout: 60000 });
  const main = await page.locator('main').innerText();
  check('the grid shows October 2026', /October 2026/.test(main));
  check('the help says click the first and the last day', /Click the first day of a nurse's leave, then the last day/.test(main));
  check('the key says "Pinned day", and nothing says Lock', /Pinned day/.test(main) && !/\bLOCK\b|Lock\b/.test(main));
  if (shots) await page.screenshot({ path: `${shots}/leave-grid-1366.png` });

  // 1. Click the first day, then the last.
  await day('Amy, Mon 19-10-2026: no leave').click();
  check('the first click says where the leave starts', /Leave for Amy starts Mon 19-10-2026/.test(await page.locator('main').innerText()));
  check('the first day is marked as pressed', (await day('Amy, Mon 19-10-2026: no leave, first day of the new leave').getAttribute('aria-pressed')) === 'true');
  if (shots) await page.screenshot({ path: `${shots}/leave-grid-picked.png` });
  await day('Amy, Wed 21-10-2026: no leave').click();
  check('the second click opens the leave with both days', (await leaveDialogDates()) === '2026-10-19 to 2026-10-21');

  // 2. One day twice is one day; Esc stops.
  await day('Sara, Thu 22-10-2026: no leave').click();
  await day('Sara, Thu 22-10-2026: no leave, first day of the new leave').click();
  check('the same day twice is one day', (await leaveDialogDates()) === '2026-10-22 to 2026-10-22');
  await day('Sara, Fri 23-10-2026: no leave').click();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const afterEsc = await page.locator('main').innerText();
  check('Esc stops the leave started', !/Leave for Sara starts/.test(afterEsc) && /Stopped. No leave was started/.test(await page.getByRole('status').filter({ hasText: 'Stopped' }).innerText()));

  // 3. The keyboard: one Tab stop, the arrow keys, Enter.
  const tabStops = await page.locator('table [data-cell][tabindex="0"]').count();
  check('the grid has one Tab stop', tabStops === 1, String(tabStops));
  await day('Amy, Mon 19-10-2026: no leave').focus();
  await page.keyboard.press('ArrowDown');
  const below = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
  check('ArrowDown moves to the next nurse on the same day', /^Mary, Mon 19-10-2026/.test(below || ''), below);
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  check('Enter on two days opens the leave', (await leaveDialogDates()) === '2026-10-19 to 2026-10-21');

  // 4. Dragging still works.
  const from = await day('Nina, Mon 12-10-2026: no leave').boundingBox();
  const to = await day('Nina, Wed 14-10-2026: no leave').boundingBox();
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 5 });
  await page.mouse.up();
  check('dragging across days still opens the leave', (await leaveDialogDates()) === '2026-10-12 to 2026-10-14');
  // A key press right after a drag is not swallowed (Checkpoint 6).
  const k1 = await day('Mary, Mon 12-10-2026: no leave').boundingBox();
  const k2 = await day('Mary, Tue 13-10-2026: no leave').boundingBox();
  await page.mouse.move(k1.x + 5, k1.y + 5);
  await page.mouse.down();
  await page.mouse.move(k2.x + 5, k2.y + 5, { steps: 3 });
  await page.mouse.up();
  await leaveDialogDates();
  await day('Mary, Thu 22-10-2026: no leave').focus();
  await page.keyboard.press('Enter');
  check('after a drag, Enter on a day starts a leave', /Leave for Mary starts Thu 22-10-2026/.test(await page.locator('main').innerText()));
  await page.keyboard.press('Escape');
  // A leave over another leave is refused, naming the day (Checkpoint 6).
  await day('Nina, Sun 25-10-2026: no leave').click();
  await day('Nina, Wed 28-10-2026: no leave').click();
  await page.waitForTimeout(300);
  check('a leave over another leave is refused, naming the day', (await page.getByRole('dialog').count()) === 0 && /already has leave on Mon 26-10-2026/.test(await page.locator('body').innerText()));
  await day('Sara, Mon 26-10-2026: no leave').click();
  check('after a drag, the next click starts a leave', /Leave for Sara starts Mon 26-10-2026/.test(await page.locator('main').innerText()));
  await page.keyboard.press('Escape');

  // 5. Leave letters are readable on their colours.
  const contrast = await page.evaluate(() => {
    const lum = (c) => {
      const [r, g, b] = c.match(/\d+/g).slice(0, 3).map(Number).map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    return [...document.querySelectorAll('table button[style]')].map((b) => {
      const s = getComputedStyle(b);
      const [a, c] = [lum(s.color), lum(s.backgroundColor)].sort((x, y) => y - x);
      return (a + 0.05) / (c + 0.05);
    });
  });
  check('every leave letter reads at 4.5:1 or more', contrast.length > 0 && contrast.every((r) => r >= 4.5), contrast.map((r) => r.toFixed(1)).join(','));

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
