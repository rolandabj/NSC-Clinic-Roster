// Roster grid timings (browser-check skill) on the full size clinic (?seed=big: 60 nurses by
// 31 days). The test page must be running; use the production build for real numbers:
//   bash start.sh prod && NODE_PATH=$(npm root -g) node grid-timing.cjs --base http://localhost:5180
// Prints the median of --runs runs (default 3) in milliseconds, and the longest task that
// blocked the page during each action.
// Two kinds of times: `popup`, `arrowKey` and `deleteShift` run from the script's command to the
// change, so they include Playwright's own work (a click first waits for the cell to stay still
// and checks what is under the pointer); the `...InPage` times run inside the page, from the
// press or the key to the next frame drawn after the change, which is what a person feels.
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
  // In the page: from the next event of this type to the next frame drawn once `check` is true.
  await page.addInitScript(() => {
    window.__startWatch = (type, checkSrc) => {
      const check = new Function(`return (${checkSrc})()`);
      window.__watch = new Promise((resolve) => {
        let start = null;
        let observer;
        const finish = () => {
          observer?.disconnect();
          requestAnimationFrame(() => setTimeout(() => resolve(Math.round(performance.now() - start)), 0));
        };
        const onEvent = (e) => {
          document.removeEventListener(type, onEvent, true);
          start = e.timeStamp;
          observer = new MutationObserver(() => {
            if (check()) finish();
          });
          observer.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
          setTimeout(() => resolve(-1), 10000);
        };
        document.addEventListener(type, onEvent, true);
      });
    };
  });
  const watch = (type, check) => page.evaluate(([t, c]) => window.__startWatch(t, c), [type, String(check)]);
  const watched = () => page.evaluate(() => window.__watch);

  const longest = async () => page.evaluate(() => { const m = Math.max(0, ...window.__long); window.__long = []; return m; });

  let t = Date.now();
  await page.goto(`${base}/?view=schedules&seed=big`);
  await page.waitForSelector('[data-cell="n1|2026-11-02"]', { timeout: 60000 });
  const firstCells = Date.now() - t;
  await page.waitForTimeout(4000);
  const loadLongest = await longest();

  t = Date.now();
  await watch('pointerdown', () => !!document.querySelector('[data-quick-popup]'));
  await page.click('[data-cell="n5|2026-11-10"]');
  await page.waitForSelector('[role="dialog"]', { timeout: 10000 }).catch(() => errors.push('no popup'));
  const popup = Date.now() - t;
  const popupInPage = await watched();
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
  // Each arrow key in the page: from the key to the frame showing the next cell selected.
  const arrowTimes = [];
  for (let i = 0; i < 5; i++) {
    const next = `n5|2026-11-${19 - i}`;
    await watch('keydown', `() => document.querySelector('[aria-selected="true"]')?.getAttribute('data-cell') === '${next}'`);
    await page.keyboard.press('ArrowLeft');
    arrowTimes.push(await watched());
  }
  const arrowKeyInPage = median(arrowTimes);

  const target = '[data-cell="n2|2026-11-03"]';
  await page.focus(target);
  await longest();
  t = Date.now();
  await watch('keydown', () => !/★/.test(document.querySelector('[data-cell="n2|2026-11-03"]')?.textContent || ''));
  await page.keyboard.press('Delete');
  await page.waitForFunction((sel) => !/★/.test(document.querySelector(sel)?.textContent || ''), target, { timeout: 15000 })
    .catch(() => errors.push('the shift was not removed'));
  const deleteShift = Date.now() - t;
  const deleteShiftInPage = await watched();
  await page.waitForTimeout(1500);
  const deleteLongest = await longest();
  const dom = await page.evaluate(() => document.querySelectorAll('*').length);
  await page.close();
  return { firstCells, loadLongest, popup, popupInPage, popupLongest, arrowKey, arrowKeyInPage, arrowLongest, deleteShift, deleteShiftInPage, deleteLongest, dom, errors };
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
