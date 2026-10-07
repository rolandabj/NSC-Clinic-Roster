// UI audit (browser-check skill): screenshots at several widths and an axe accessibility scan
// of test page screens, with a short summary. The test page must be running (start.sh).
// Run: NODE_PATH=$(npm root -g) node ui-audit.cjs <folder> [--base http://localhost:5179]
//        [--sizes 1366x768,1024x768,390x844] [--pages "view=dashboard;view=app&as=nurse#availability"]
// Each page is the part of the address after "?". Results: <folder>/audit.json and one
// screenshot per page and size (<name>-<width>.png, plus -full.png for the whole page).
// axe-core is not an app dependency: it is fetched once into ~/.cache/nsc-browser-check.
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const DEFAULT_PAGES = [
  'view=dashboard', 'view=schedules', 'view=nurses', 'view=doctors', 'view=availability',
  'view=history', 'view=reports',
  'view=app&as=owner#dashboard', 'view=app&as=nurse#dashboard', 'view=app&as=nurse#availability',
  'view=app&as=manager#availability', 'view=app&as=none', 'view=me', 'view=published&as=none', 'view=ack',
];

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
}

function axeSource() {
  const cache = path.join(os.homedir(), '.cache', 'nsc-browser-check');
  const repo = path.resolve(__dirname, '..', '..', '..', '..');
  for (const dir of [repo, cache]) {
    try {
      return fs.readFileSync(require.resolve('axe-core/axe.min.js', { paths: [dir] }), 'utf8');
    } catch {}
  }
  fs.mkdirSync(cache, { recursive: true });
  execSync('npm install --no-save --no-audit --no-fund --prefix . axe-core@4', { cwd: cache, stdio: 'ignore' });
  return fs.readFileSync(require.resolve('axe-core/axe.min.js', { paths: [cache] }), 'utf8');
}

const nameOf = (page) => page.replace(/view=/, '').replace(/&as=/, '-as-').replace(/[#&=?]+/g, '-').replace(/-+$/, '');
const isRoster = (page) => /view=schedules|#schedules/.test(page);

(async () => {
  const out = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : '.';
  const base = arg('base', 'http://localhost:5179');
  const sizes = arg('sizes', '1366x768,1024x768,390x844').split(',').map((s) => s.split('x').map(Number));
  const pages = (arg('pages', '') || DEFAULT_PAGES.join(';')).split(';').filter(Boolean);
  fs.mkdirSync(out, { recursive: true });
  const AXE = axeSource();
  const browser = await chromium.launch();
  const report = {};

  for (const target of pages) {
    for (const [width, height] of sizes) {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 300)));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
      const [query, hash = ''] = target.split('#');
      await page.goto(`${base}/?${query}${hash ? '#' + hash : ''}`);
      if (isRoster(target)) await page.waitForSelector('[data-cell]', { timeout: 60000 }).catch(() => errors.push('no grid cell'));
      await page.waitForTimeout(2500);
      const name = `${nameOf(target)}-${width}`;
      await page.screenshot({ path: path.join(out, `${name}.png`) });
      await page.screenshot({ path: path.join(out, `${name}-full.png`), fullPage: true });

      const structure = await page.evaluate(() => {
        const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const controls = [...document.querySelectorAll('button, a[href], input, select, textarea, [role=button], [role=tab]')].filter(visible);
        const small = controls.filter((el) => { const r = el.getBoundingClientRect(); return r.width < 24 || r.height < 24; });
        const tinyText = new Set();
        for (const el of document.querySelectorAll('body *')) {
          if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
          if (!visible(el)) continue;
          const size = parseFloat(getComputedStyle(el).fontSize);
          if (size < 12) tinyText.add(el);
        }
        return {
          title: document.title,
          lang: document.documentElement.lang,
          h1: document.querySelectorAll('h1').length,
          main: document.querySelectorAll('main,[role=main]').length,
          controls: controls.length,
          smallTargets: small.length,
          textUnder12px: tinyText.size,
          sidewaysScroll: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
          // Room left for the page itself (the app scrolls inside boxes, so the page rarely scrolls sideways).
          mainWidth: Math.round((document.querySelector('main') || document.getElementById('root')).getBoundingClientRect().width),
          // Boxes that cut their content off without letting it scroll.
          clippedBoxes: [...document.querySelectorAll('body *')].filter((el) => {
            if (!visible(el)) return false;
            const cs = getComputedStyle(el);
            return cs.overflowX === 'hidden' && el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0 && cs.textOverflow !== 'ellipsis';
          }).length,
          domNodes: document.querySelectorAll('*').length,
        };
      });

      await page.addScriptTag({ content: AXE });
      const axe = await page.evaluate(async () => {
        const r = await window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
        });
        return r.violations.map((v) => ({
          id: v.id, impact: v.impact, count: v.nodes.length, help: v.help,
          samples: v.nodes.slice(0, 3).map((n) => ({ target: n.target.join(' '), html: n.html.slice(0, 160) })),
        }));
      });
      report[name] = { page: target, width, errors: [...new Set(errors)].slice(0, 8), structure, axe };
      await page.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'audit.json'), JSON.stringify(report, null, 2));

  const serious = (r) => r.axe.filter((a) => a.impact === 'serious' || a.impact === 'critical').reduce((n, a) => n + a.count, 0);
  console.log('page | width | axe serious+critical | other axe | small targets | text under 12 px | main width | cut off boxes | errors');
  for (const [name, r] of Object.entries(report)) {
    const other = r.axe.reduce((n, a) => n + a.count, 0) - serious(r);
    const s = r.structure;
    console.log(`${r.page} | ${r.width} | ${serious(r)} | ${other} | ${s.smallTargets} | ${s.textUnder12px} | ${s.mainWidth} | ${s.clippedBoxes} | ${r.errors.length}`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
