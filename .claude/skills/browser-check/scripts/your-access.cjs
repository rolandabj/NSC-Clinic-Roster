// "Your access" (UI overhaul Checkpoint 8): the account menu's dialog on the shared Dialog, with
// who is signed in, the role, what they can do in plain words (no RBAC, bearer token or solver
// jargon), the Settings link for the owner only, Sign out, and no text under 12 px.
// Run: NODE_PATH=$(npm root -g) node your-access.cjs [--base http://localhost:5180] [--shots <folder>]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const results = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });
  const smallText = (root) =>
    root.evaluate((d) => [...d.querySelectorAll('*')].filter((el) => el.offsetParent !== null && [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 12).map((el) => el.textContent.trim().slice(0, 30)));

  const openFor = async (as) => {
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`${base}/?view=app&as=${as}#dashboard`);
    await page.locator('main').waitFor({ timeout: 60000 });
    await page.locator('header button[aria-controls]').click();
    await page.getByRole('button', { name: 'Your access' }).click();
    const dlg = page.getByRole('dialog', { name: 'Your access' });
    await dlg.waitFor({ timeout: 5000 });
    return { page, dlg };
  };

  // 1. The owner.
  {
    const { page, dlg } = await openFor('owner');
    const text = await dlg.innerText();
    if (shots) await page.screenshot({ path: `${shots}/your-access-owner.png` });
    check('the owner sees name, email and role', /Name/.test(text) && /Email/.test(text) && /Role\s+Owner/.test(text), text.slice(0, 200));
    const old = text.match(/RBAC|Bearer|CP-SAT|SSO|Governance|Identity|ROLE:|Token|Enterprise|Workspace|Medical Director/g) || [];
    check('no old jargon', old.length === 0, old.join(', '));
    const allowed = await dlg.getByRole('listitem').evaluateAll((li) => li.filter((l) => l.innerText && !/^No:/.test(l.querySelector('.sr-only')?.textContent || '')).length);
    check('the owner can do all 7 things', allowed === 7, String(allowed));
    check('the owner gets the Settings link', (await dlg.getByRole('link', { name: /Access and permissions/ }).count()) === 1);
    check('no text under 12 px', (await smallText(dlg)).length === 0, (await smallText(dlg)).slice(0, 5).join(' | '));
    await dlg.getByRole('link', { name: /Access and permissions/ }).click();
    await page.waitForTimeout(800);
    check('the link opens Access and permissions', /#settings\?tab=access-roles$/.test(page.url()) && (await page.getByRole('dialog').count()) === 0, page.url());
    await page.close();
  }

  // 2. A nurse: look only, no Settings link; Escape closes; Sign out is there.
  {
    const { page, dlg } = await openFor('nurse');
    const text = await dlg.innerText();
    check('a nurse is named Nurse', /Role\s+Nurse/.test(text), text.slice(0, 200));
    check('a nurse has no Settings link', (await dlg.getByRole('link').count()) === 0);
    const no = await dlg.locator('li .sr-only').allInnerTexts();
    check('a nurse cannot change rosters', no.length === 7 && no[0].startsWith('No'), no.join(','));
    check('Sign out is in the dialog', (await dlg.getByRole('button', { name: 'Sign out' }).count()) === 1);
    await page.keyboard.press('Escape');
    await dlg.waitFor({ state: 'detached', timeout: 3000 }).catch(() => {});
    check('Escape closes it', (await dlg.count()) === 0);
    await page.close();
  }

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ''}`);
  await browser.close();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
