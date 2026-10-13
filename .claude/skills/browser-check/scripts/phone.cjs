// The roster on a phone (UI overhaul Phase 4, slice 5): a read only day view under 700 px wide or
// 500 px high, the grid on a tablet, a link to a day, and a turn of the screen.
// Run: NODE_PATH=$(npm root -g) node phone.cjs [--base http://localhost:5180] [--shots <folder>]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;

(async () => {
  const browser = await chromium.launch();
  const results = [];
  const errors = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });
  const open = async (width, height, hash = '#schedules?roster=nov') => {
    const page = await browser.newPage({ viewport: { width, height }, hasTouch: width < 700 });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`${base}/?view=app${hash}`);
    await page.waitForFunction(() => document.querySelector('[data-cell]') || /laptop or tablet/.test(document.body.innerText), null, { timeout: 60000 });
    await page.waitForTimeout(800);
    return page;
  };
  const heading = (page) => page.locator('section[aria-label^="The roster"] h2').innerText();

  // 1. A phone held upright: the day view, read only.
  const phone = await open(390, 844);
  check('a phone shows the day view, not the grid', (await phone.locator('[data-cell]').count()) === 0 && (await phone.getByText('To change the roster, open it on a laptop or tablet.').count()) === 1);
  for (const name of ['Undo', 'Fill roster', 'Publish', 'More actions']) check(`no ${name} on a phone`, (await phone.getByRole('button', { name, exact: false }).count()) === 0);
  check('no sheet tabs or steps on a phone', (await phone.getByRole('tablist', { name: 'Roster sheets' }).count()) === 0 && (await phone.getByRole('navigation', { name: 'Roster steps' }).count()) === 0);
  check('the first day of the roster first', /16-11-2026/.test(await heading(phone)), await heading(phone));
  check('Previous day waits at the first day', await phone.getByRole('button', { name: 'Previous day' }).isDisabled());
  const rows = await phone.locator('section[aria-label^="The roster"] li').allInnerTexts();
  check("each nurse's day in words", rows.some((t) => /Float\s*\n?.*09:00 to 17:00/.test(t) || /09:00 to 17:00/.test(t)), rows.slice(0, 2).join(' | '));
  check("the day's problems are listed", (await phone.getByText('Problems on this day').count()) === 1);
  if (shots) await phone.screenshot({ path: `${shots}/phone-390.png`, fullPage: true });
  await phone.getByRole('button', { name: 'Next day' }).click();
  await phone.waitForTimeout(200);
  check('Next day shows the next day', /17-11-2026/.test(await heading(phone)), await heading(phone));
  const wide = await phone.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check('no sideways scroll on a phone', !wide);
  await phone.close();

  // 2. A link to a nurse's day opens that day.
  const linked = await open(390, 844, '#schedules?roster=nov&nurse=mary&date=2026-11-19');
  check('a link to a day opens that day', /19-11-2026/.test(await heading(linked)), await heading(linked));
  await linked.close();

  // 3. A phone held sideways (under 500 px high) is a phone too.
  const sideways = await open(844, 390);
  check('a phone held sideways shows the day view', (await sideways.locator('[data-cell]').count()) === 0);
  if (shots) await sideways.screenshot({ path: `${shots}/phone-844x390.png` });
  // Turned to a laptop size, the grid comes back.
  await sideways.setViewportSize({ width: 1366, height: 768 });
  await sideways.waitForSelector('[data-cell]', { timeout: 15000 }).catch(() => {});
  check('a wider screen brings the grid back', (await sideways.locator('[data-cell]').count()) > 0);
  await sideways.close();

  // 4. The smallest iPad held upright edits the roster.
  const tablet = await open(744, 1133);
  check('a tablet held upright shows the grid', (await tablet.locator('[data-cell]').count()) > 0 && (await tablet.getByRole('button', { name: /Fill roster/ }).count()) === 1);
  if (shots) await tablet.screenshot({ path: `${shots}/tablet-744.png` });
  await tablet.close();

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
