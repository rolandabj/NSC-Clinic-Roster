// A nurse's own page on a phone (UI overhaul Phase 5, slice 1): the next shift with Add to my
// calendar, the days coming up as cards, the calendar options, and the team schedule under them.
// Run: NODE_PATH=$(npm root -g) node nurse-page.cjs [--base http://localhost:5180]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const results = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });

  await page.goto(`${base}/?view=me`);
  await page.getByRole('heading', { level: 1 }).waitFor({ timeout: 60000 });
  check('the page is named after the nurse', /^Mary's shifts$/.test(await page.getByRole('heading', { level: 1 }).innerText()));
  const next = page.getByRole('region', { name: 'Next shift' });
  const nextText = await next.innerText();
  check('the next shift comes first, with its day in full', /Next shift\s+Monday 16-11-2026/.test(nextText), nextText.slice(0, 80));
  check('it gives the times and who with', /09:00 to 17:00/.test(nextText) && /With Dr Lee/.test(nextText));
  const download = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
  await next.getByRole('button', { name: 'Add to my calendar' }).click();
  const file = await download;
  check('Add to my calendar saves a calendar file', !!file && /\.ics$/.test(file.suggestedFilename()), file?.suggestedFilename());
  const cards = await page.getByRole('region', { name: 'Coming up' }).getByRole('listitem').allInnerTexts();
  check('the days coming up are cards', cards.length > 0 && /19-11-2026/.test(cards.join(' ')), cards.join(' | ').slice(0, 120));
  await page.getByRole('button', { name: 'Subscribe in your calendar' }).click();
  check('Subscribe shows how to', await page.locator('#subscribe-help').isVisible());
  await page.getByRole('button', { name: 'Copy as text' }).click();
  await page.waitForTimeout(300);
  check('Copy as text says it is done', /Shifts copied/.test(await page.getByRole('status').first().innerText()));
  check('the team schedule is under them', (await page.getByRole('heading', { name: 'Team schedule' }).count()) === 1);
  // Phone sizes: buttons at least 44 px high; in the nurse's own part text is 16 px, and nothing is under 14 px (the full date under a card).
  const sizes = await page.evaluate(() => {
    const main = document.querySelector('main');
    const low = [...main.querySelectorAll('button, a[href]')].filter((b) => b.getBoundingClientRect().height < 44).map((b) => b.textContent.trim());
    const small = [...main.querySelectorAll('p, li, h1, h2')].filter((el) => parseFloat(getComputedStyle(el).fontSize) < 14).map((el) => el.textContent.trim().slice(0, 30));
    return { low, small, wide: document.documentElement.scrollWidth > window.innerWidth + 1 };
  });
  check('buttons are at least 44 px high', sizes.low.length === 0, sizes.low.join(', '));
  check('no text under 14 px in the nurse\'s part', sizes.small.length === 0, sizes.small.join(', '));
  check('the page does not scroll sideways', !sizes.wide);

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
