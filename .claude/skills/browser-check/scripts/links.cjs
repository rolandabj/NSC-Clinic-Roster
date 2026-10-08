// Links and Back (browser-check skill): links to a settings tab, a nurse, a roster sheet and a
// nurse's day; Back and Forward between tabs; a screen opened from the menu starts without the
// last screen's address; and two cases the Phase 2 review found: a new roster stays open, and
// the account panel works when a click does not focus its buttons (as in Safari).
// The test page must be running:
//   bash start.sh prod && NODE_PATH=$(npm root -g) node links.cjs --base http://localhost:5180
// Prints one line per check and the failures (exit code 1 when any check failed).
const { chromium } = require('playwright');
const assert = require('assert');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
}
const base = arg('base', 'http://localhost:5179');

/** Fails instead of waiting for ever when the page stops answering (a loop on the page). */
const within = (promise, what, ms = 8000) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${what}: the page did not answer within ${ms / 1000} s`)), ms)),
  ]);

const checks = [];
const check = (name, run) => checks.push({ name, run });

check('Settings: a link opens its tab; a click adds a step to Back; Back and Forward', async ({ open }) => {
  const page = await open('#settings?tab=email');
  const main = page.getByRole('main');
  await page.getByRole('heading', { name: 'Settings', level: 1 }).waitFor();
  assert.equal(await main.getByRole('button', { name: 'Email', exact: true }).getAttribute('aria-current'), 'page');
  await main.getByRole('button', { name: 'Public holidays' }).click();
  await page.waitForFunction(() => location.hash === '#settings?tab=holidays');
  await page.goBack();
  await page.waitForFunction(() => location.hash === '#settings?tab=email');
  await page.waitForTimeout(200);
  assert.equal(await main.getByRole('button', { name: 'Email', exact: true }).getAttribute('aria-current'), 'page');
  await page.goForward();
  await page.waitForFunction(() => location.hash === '#settings?tab=holidays');
});

check('Settings without a tab: the address gets the open tab', async ({ open }) => {
  const page = await open('#settings');
  await page.waitForFunction(() => /^#settings\?tab=/.test(location.hash));
});

check('Nurses: a link opens their details; closing them clears the address', async ({ open }) => {
  const page = await open('#nurses?nurse=mary');
  const dialog = page.getByRole('dialog');
  await dialog.waitFor({ timeout: 10000 });
  assert.match(await dialog.innerText(), /Mary/);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => location.hash === '#nurses');
});

check('Rosters: a link opens a sheet; a click on another adds a step to Back; Back returns', async ({ open }) => {
  const page = await open('#schedules?roster=nov&sheet=problems');
  await page.waitForFunction(() => location.hash.startsWith('#schedules?roster=nov&sheet=problems'), null, { timeout: 60000 });
  await page.getByRole('button', { name: 'Hours', exact: true }).last().click();
  await page.waitForFunction(() => location.hash === '#schedules?roster=nov&sheet=hours');
  await page.goBack();
  await page.waitForFunction(() => location.hash === '#schedules?roster=nov&sheet=problems');
  await page.waitForTimeout(300);
  assert.equal(await page.getByRole('button', { name: /^Problems \(/ }).last().getAttribute('aria-current'), 'page');
});

check("Rosters: a link to a nurse's day puts the focus on that cell", async ({ open }) => {
  const page = await open('#schedules?roster=nov&nurse=mary&date=2026-11-19');
  await page.waitForSelector('[data-cell="mary|2026-11-19"]', { timeout: 60000 });
  await page.waitForFunction(
    () => document.activeElement?.closest('[data-cell]')?.getAttribute('data-cell') === 'mary|2026-11-19',
    null,
    { timeout: 10000 }
  );
});

check('Rosters: a link to a roster that does not exist opens the usual one', async ({ open }) => {
  const page = await open('#schedules?roster=nope');
  await page.waitForFunction(() => location.hash.startsWith('#schedules?roster=nov'), null, { timeout: 60000 });
});

// The menu sets the address, and the browser's popstate event (sent at once, before hashchange)
// clears the last screen's address details in the same click. Without it, Nurses would take `nurse=mary`
// for a link and then never write the open details to the address.
check('Menu: a screen starts without the address details of the screen before', async ({ open }) => {
  const page = await open('#dashboard?nurse=mary');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Nurses', exact: true }).click();
  await page.waitForFunction(() => location.hash === '#nurses');
  const edit = page.getByRole('button', { name: 'Edit Nina' });
  await edit.waitFor();
  await page.waitForTimeout(300);
  assert.equal(await page.getByRole('dialog').count(), 0, 'no details opened by themselves');
  await edit.click({ timeout: 5000 });
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  assert.match(await dialog.innerText(), /Nina/, "Nina's details opened, not someone else's");
  await page.waitForFunction(() => location.hash === '#nurses?nurse=nina', null, { timeout: 3000 }).catch(async () => {
    throw new Error(`the address did not follow the open details: it is ${await page.evaluate(() => location.hash)}`);
  });
});

// Review finding F3: Safari does not focus a button when it is clicked, so pressing a button in
// the account panel moved the focus to nowhere, the panel closed, and the click was lost.
check('Account panel: its buttons work when a click does not focus them; Tab out closes it', async ({ open }) => {
  const page = await open('#dashboard');
  const account = page.locator('header button[aria-controls]');
  await account.focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('header button[aria-controls]')?.getAttribute('aria-expanded') === 'true');
  // What Safari does when the mouse is pressed on a button in the panel.
  await page.evaluate(() => document.activeElement.blur());
  await page.waitForTimeout(200);
  assert.equal(await account.getAttribute('aria-expanded'), 'true', 'the panel stays open when the focus goes to nowhere');
  await page.getByRole('button', { name: 'Your access' }).click();
  await page.getByRole('dialog').waitFor({ timeout: 3000 });
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'detached', timeout: 3000 });

  // Tab past the panel's last button closes it.
  await account.focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('header button[aria-controls]')?.getAttribute('aria-expanded') === 'true');
  for (let i = 0; i < 3; i++) await page.keyboard.press('Tab');
  await page.waitForTimeout(200);
  assert.equal(await account.getAttribute('aria-expanded'), 'false', 'Tab out of the panel closes it');
});

// Review finding F1: the reload after New roster opened the old roster again, and the address
// and the open roster then swapped back and forth until the page stopped answering. It runs
// last, so a page caught in that loop does not slow the other checks.
check('Rosters: a new roster stays open, and the address names it', async ({ open }) => {
  const page = await open('#schedules?roster=nov');
  await page.waitForSelector('[data-cell="mary|2026-11-16"]', { timeout: 60000 });
  await page.waitForTimeout(500);
  // From now on, note each address the screen writes.
  await page.evaluate(() => {
    window.__written = [];
    const replace = history.replaceState.bind(history);
    history.replaceState = (state, title, url) => {
      window.__written.push(String(url).split('#')[1]);
      return replace(state, title, url);
    };
  });
  await page.getByRole('button', { name: 'More actions' }).click();
  await page.getByRole('menuitem', { name: /New roster/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.locator('input[name="generation_mode"]').nth(1).check();
  const name = await dialog.getByLabel('Roster name').inputValue();
  assert.ok(name, 'the new roster has a name');
  const create = dialog.getByRole('button', { name: /Create empty roster/ });
  await create.waitFor();
  await create.click({ noWaitAfter: true, timeout: 8000 }).catch(() => {
    throw new Error('the page stopped answering when the roster was created');
  });

  const state = () =>
    within(
      page.evaluate(() => ({
        hash: location.hash,
        created: [...window.__repo.col('schedules').values()].map((x) => x.id).find((id) => id !== 'nov'),
        written: window.__written.slice(0, 8),
        writes: window.__written.length,
      })),
      'after New roster'
    );
  let s;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(250);
    s = await state();
    if (s.created && s.hash === `#schedules?roster=${s.created}`) break;
  }
  assert.ok(s.created, 'the new roster was saved');
  await page.waitForTimeout(1500);
  s = await state();
  assert.equal(s.hash, `#schedules?roster=${s.created}`, 'the address names the new roster');
  assert.ok(!s.written.some((h) => h.includes('roster=nov')), `the address went back to the old roster: ${s.written.join(', ')}`);
  assert.ok(s.writes <= 3, `the address was written ${s.writes} times`);
  const shown = await within(page.locator('header').getByTitle('Open the roster', { exact: true }).innerText(), 'the top bar');
  assert.ok(shown.includes(name), `the top bar shows the new roster (it shows "${shown}")`);
});

(async () => {
  const browser = await chromium.launch();
  const failures = [];
  for (const { name, run } of checks) {
    const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    const errors = [];
    const open = async (hash, query = 'view=app&as=owner') => {
      const page = await context.newPage();
      page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 300)));
      await page.goto(`${base}/?${query}${hash}`);
      return page;
    };
    try {
      await run({ open });
      if (errors.length) throw new Error(`page errors: ${errors.slice(0, 2).join(' | ')}${errors.length > 2 ? ` (${errors.length} in all)` : ''}`);
      console.log(`ok      ${name}`);
    } catch (e) {
      failures.push(name);
      console.log(`FAILED  ${name}\n        ${String(e.message || e).split('\n')[0]}`);
    }
    await within(context.close(), 'closing the page', 10000).catch(() => {});
  }
  await browser.close();
  console.log(failures.length ? `${failures.length} of ${checks.length} checks failed` : `all ${checks.length} checks passed`);
  process.exit(failures.length ? 1 : 0);
})();
