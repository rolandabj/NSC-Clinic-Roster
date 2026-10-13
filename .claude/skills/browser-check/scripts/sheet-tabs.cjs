// The roster screen's sheet tabs (UI overhaul Phase 4, slice 2): above the sheet as ARIA tabs,
// the Key drawer as the only key, and Full screen once.
// Run: NODE_PATH=$(npm root -g) node sheet-tabs.cjs [--base http://localhost:5180] [--shots <folder>]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const results = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });
  const selected = () => page.evaluate(() => document.querySelector('[role=tab][aria-selected=true]')?.id);

  await page.goto(`${base}/?view=app#schedules?roster=nov`);
  await page.waitForSelector('[data-cell="mary|2026-11-16"]', { timeout: 60000 });
  await page.waitForTimeout(800);

  // 1. Where the tabs are: above the sheet, not under it.
  const box = await page.evaluate(() => {
    const list = document.querySelector('[role=tablist][aria-label="Roster sheets"]').getBoundingClientRect();
    const panel = document.getElementById('sheet-panel').getBoundingClientRect();
    return { tabsBottom: list.bottom, panelTop: panel.top };
  });
  check('the tabs sit above the sheet', box.tabsBottom <= box.panelTop + 1, JSON.stringify(box));
  check('six sheets, no Key sheet', (await page.getByRole('tab').count()) === 6 && (await page.getByRole('tab', { name: 'Key' }).count()) === 0);
  check('the panel is named by the open tab', (await page.getAttribute('#sheet-panel', 'aria-labelledby')) === 'sheet-tab-roster');

  // 2. The keyboard: one Tab stop, arrow keys, Home and End.
  check('one Tab stop in the tabs', (await page.locator('[role=tab][tabindex="0"]').count()) === 1);
  await page.focus('#sheet-tab-roster');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  check('Arrow right opens Doctors', (await selected()) === 'sheet-tab-doctors' && (await page.evaluate(() => document.activeElement.id)) === 'sheet-tab-doctors');
  check('the address follows', await page.evaluate(() => location.hash.includes('sheet=doctors')));
  await page.keyboard.press('End');
  await page.waitForTimeout(300);
  check('End opens Hours', (await selected()) === 'sheet-tab-hours');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  check('Arrow right from the last goes to the first', (await selected()) === 'sheet-tab-roster');
  await page.keyboard.press('Home');
  check('Home stays on Roster', (await selected()) === 'sheet-tab-roster');

  // 3. The Key: one button over the grid opens the one drawer.
  const key = page.getByRole('button', { name: 'Key', exact: true });
  check('the Key button starts closed', (await key.getAttribute('aria-expanded')) === 'false');
  await key.click();
  const drawer = page.getByRole('region', { name: 'Key' });
  check('the Key opens beside the grid', (await drawer.isVisible()) && (await key.getAttribute('aria-expanded')) === 'true');
  check('the Key shows shifts, leave and marks', /Shifts[\s\S]*Leave and days off[\s\S]*A cell/i.test(await drawer.innerText()));
  if (shots) await page.screenshot({ path: `${shots}/tabs-key-1400.png` });
  await page.getByRole('button', { name: 'Close the key' }).click();
  check('Close the key closes it', (await drawer.count()) === 0);

  // 4. Full screen: once, on every sheet; Esc leaves it.
  check('Full screen is on the screen once', (await page.getByRole('button', { name: 'Full screen' }).count()) === 1);
  await page.getByRole('button', { name: 'More actions' }).click();
  check('and not in More', (await page.getByRole('menuitem', { name: /full screen/i }).count()) === 0);
  await page.keyboard.press('Escape');
  await page.getByRole('tab', { name: 'Coverage by hour' }).click();
  const full = page.getByRole('button', { name: 'Full screen' });
  await full.click();
  await page.waitForTimeout(300);
  check('Full screen works from another sheet', (await full.getAttribute('aria-pressed')) === 'true');
  if (shots) await page.screenshot({ path: `${shots}/tabs-fullscreen-1400.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check('Esc leaves full screen', (await full.getAttribute('aria-pressed')) === 'false');

  // 5. Narrower screens: the tabs scroll sideways, the page does not.
  for (const width of [1024, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.getByRole('tab', { name: 'Roster' }).click();
    await page.waitForTimeout(400);
    const wide = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    check(`no sideways page scroll at ${width} px`, !wide);
    if (shots) await page.screenshot({ path: `${shots}/tabs-${width}.png`, clip: { x: 0, y: 0, width, height: 320 } });
  }

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
