// Example check (browser-check skill): copy it to the session scratchpad and adapt it.
// Run: NODE_PATH=$(npm root -g) node example.cjs <folder for screenshots>
const { chromium } = require('playwright');

(async () => {
  const out = process.argv[2] || '.';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  // The roster grid: wait for one cell (nurse id | date).
  await page.goto('http://localhost:5179/?view=schedules');
  await page.waitForSelector('[data-cell="mary|2026-11-16"]', { timeout: 30000 });
  await page.waitForTimeout(1000);

  // A dialog from the More menu.
  await page.getByRole('button', { name: 'More actions' }).click();
  await page.getByRole('menuitem', { name: /Swap two nurses/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Swap shifts' });
  await dialog.getByLabel('First nurse', { exact: true }).selectOption('mary');
  await dialog.getByLabel('Second nurse', { exact: true }).selectOption('nina');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/swap-dialog.png` });

  const result = {
    exceptionButton: await dialog.getByRole('button', { name: 'Swap anyway as an exception' }).count(),
    // What the app saved, from the in memory database.
    savedShifts: await page.evaluate(() => [...window.__repo.col('assignments').values()].length),
    errors,
  };
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
