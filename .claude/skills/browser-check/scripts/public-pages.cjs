// The pages opened from links on a phone (UI overhaul Phase 5, slice 3): the read receipt page,
// the published roster page and a nurse's dashboard.
// Run: NODE_PATH=$(npm root -g) node public-pages.cjs [--base http://localhost:5180]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';

(async () => {
  const browser = await chromium.launch();
  const results = [];
  const errors = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });
  const open = async (view) => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`${base}/?view=${view}`);
    await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 60000 });
    return page;
  };
  const layout = (page) =>
    page.evaluate(() => ({
      wide: document.documentElement.scrollWidth > window.innerWidth + 1,
      appName: [...document.querySelectorAll('header p')].some((p) => p.textContent === 'NSC Clinic Roster' && p.getBoundingClientRect().width > 0),
    }));

  // 1. The read receipt page.
  const ack = await open('ack');
  check('read receipt: the app name shows beside a long clinic name', (await layout(ack)).appName);
  const button = ack.getByRole('button', { name: 'I have my roster' });
  const box = await button.boundingBox();
  check('read receipt: the button is at least 44 px high and spans the card', box && box.height >= 44 && box.width > 250, JSON.stringify(box));
  // Without a connection it says so and offers Try again, rather than "This link no longer works" (Checkpoint 5).
  await ack.context().setOffline(true);
  await button.click();
  await ack.getByRole('heading', { name: 'No internet connection' }).waitFor({ timeout: 5000 }).catch(() => {});
  check('read receipt: offline, it says there is no connection', (await ack.getByRole('heading', { name: 'No internet connection' }).count()) === 1);
  check('read receipt: offline, it does not say the link is dead', (await ack.getByText('This link no longer works').count()) === 0);
  await ack.context().setOffline(false);
  await ack.getByRole('button', { name: 'Try again' }).click();
  await ack.getByRole('heading', { name: 'Thank you' }).waitFor({ timeout: 10000 }).catch(() => {});
  check('read receipt: pressing it thanks the nurse', (await ack.getByRole('heading', { name: 'Thank you' }).count()) === 1);
  check('read receipt: no sideways scroll', !(await layout(ack)).wide);
  await ack.close();

  // 2. The published roster page.
  const pub = await open('published');
  check('published roster: one main heading', (await pub.getByRole('heading', { level: 1, name: 'Published roster' }).count()) === 1);
  const text = await pub.locator('main').innerText();
  check('published roster: dates as DD-MM-YYYY', /16-11-2026 to 29-11-2026/.test(text) && !/\b\d{1,2} Nov\b/.test(text));
  const small = await pub.evaluate(() =>
    [...document.querySelectorAll('.roster-screen-pages *, .roster-controls *, .roster-pagination *')].filter((el) => {
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      return own && el.getBoundingClientRect().width > 0 && parseFloat(getComputedStyle(el).fontSize) < 12;
    }).length
  );
  check('published roster: no text under 12 px on screen', small === 0, `${small}`);
  const low = await pub.evaluate(() => [...document.querySelectorAll('.roster-controls button, .roster-controls select, .roster-pagination button')].filter((b) => b.getBoundingClientRect().height < 44).length);
  check('published roster: its controls are at least 44 px high', low === 0, `${low}`);
  check('published roster: the page does not scroll sideways (the grid scrolls in its box)', !(await layout(pub)).wide);
  await pub.close();

  // 3. A nurse's dashboard.
  const dash = await open('app&as=nurse#dashboard');
  check("dashboard: today's date as DD-MM-YYYY", /^Today, \w+day \d\d-\d\d-\d{4}$/.test(await dash.getByRole('heading', { level: 1 }).innerText()));
  check('dashboard: no sideways scroll', !(await layout(dash)).wide);
  await dash.close();

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
