// Roster grid timings (browser-check skill) on the full size clinic (?seed=big: 60 nurses by
// 31 days). The test page must be running; use the production build for real numbers:
//   bash start.sh prod && NODE_PATH=$(npm root -g) node grid-timing.cjs --base http://localhost:5180
// Prints the median of --runs runs (default 3) in milliseconds, and the longest task that
// blocked the page during each action.
const { chromium } = require('playwright');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
}
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

async function once(browser, base) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.addInitScript(() => {
    window.__long = [];
    new PerformanceObserver((list) => { for (const e of list.getEntries()) window.__long.push(Math.round(e.duration)); })
      .observe({ type: 'longtask', buffered: true });
  });
  const longest = async () => page.evaluate(() => { const m = Math.max(0, ...window.__long); window.__long = []; return m; });

  let t = Date.now();
  await page.goto(`${base}/?view=schedules&seed=big`);
  await page.waitForSelector('[data-cell="n1|2026-11-02"]', { timeout: 60000 });
  const firstCells = Date.now() - t;
  await page.waitForTimeout(4000);
  const loadLongest = await longest();

  t = Date.now();
  await page.click('[data-cell="n5|2026-11-10"]');
  await page.waitForSelector('[role="dialog"]', { timeout: 10000 }).catch(() => errors.push('no popup'));
  const popup = Date.now() - t;
  const popupLongest = await longest();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  await page.focus('[data-cell="n5|2026-11-10"]');
  await longest();
  t = Date.now();
  for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.activeElement?.getAttribute('data-cell') === 'n5|2026-11-20', null, { timeout: 10000 })
    .catch(() => errors.push('arrow keys did not arrive'));
  const arrowKey = (Date.now() - t) / 10;
  const arrowLongest = await longest();

  const target = '[data-cell="n2|2026-11-03"]';
  await page.focus(target);
  await longest();
  t = Date.now();
  await page.keyboard.press('Delete');
  await page.waitForFunction((sel) => !/★/.test(document.querySelector(sel)?.textContent || ''), target, { timeout: 15000 })
    .catch(() => errors.push('the shift was not removed'));
  const deleteShift = Date.now() - t;
  await page.waitForTimeout(1500);
  const deleteLongest = await longest();
  const dom = await page.evaluate(() => document.querySelectorAll('*').length);
  await page.close();
  return { firstCells, loadLongest, popup, popupLongest, arrowKey, arrowLongest, deleteShift, deleteLongest, dom, errors };
}

(async () => {
  const base = arg('base', 'http://localhost:5179');
  const runs = Number(arg('runs', '3'));
  const browser = await chromium.launch();
  const results = [];
  for (let i = 0; i < runs; i++) results.push(await once(browser, base));
  await browser.close();
  const keys = Object.keys(results[0]).filter((k) => k !== 'errors');
  const summary = Object.fromEntries(keys.map((k) => [k, median(results.map((r) => r[k]))]));
  console.log(JSON.stringify({ base, runs, median: summary, errors: [...new Set(results.flatMap((r) => r.errors))] }, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
