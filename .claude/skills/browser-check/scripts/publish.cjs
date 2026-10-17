// The publish dialog on the shared Dialog (UI overhaul Phase 7, slice 6a): its five steps named
// and the open one marked, the roster check, the note and the nurses to email, the preview, the
// send (test mode), a version and an email log saved, and Share links without the Invitations tab.
// Run: NODE_PATH=$(npm root -g) node publish.cjs [--base http://localhost:5180] [--shots <folder>]
// One line for each check; exit code 1 when one fails.
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const results = [];
  const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });
  const smallText = (root) =>
    root.evaluate((d) => [...d.querySelectorAll('*')].filter((el) => [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 12).map((el) => el.textContent.trim().slice(0, 30)));
  const col = (name) => page.evaluate((n) => [...window.__repo.col(n).values()], name);
  const current = (d) => d.locator('[aria-current="step"]').innerText();

  await page.goto(`${base}/?view=app&seed=clean#schedules?roster=nov`);
  await page.waitForSelector('[data-cell="amy|2026-11-18"]', { timeout: 60000 });
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: /^Publish/ }).first().click();
  await page.getByRole('menuitem', { name: /^Publish the roster/ }).click();
  const d = page.getByRole('dialog', { name: /^Publish November/ });
  await d.waitFor({ timeout: 10000 });
  await d.getByRole('button', { name: 'Continue' }).waitFor({ timeout: 15000 });
  await page.waitForFunction(() => !document.querySelector('[role="dialog"] button[aria-busy="true"]'), null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
  if (shots) await page.screenshot({ path: `${shots}/publish-check.png` });

  // 1. The steps, and the roster check.
  const steps = await d.getByRole('list', { name: 'Steps' }).innerText();
  check('five steps named Check, Message, Preview, Send, Done', /Check[\s\S]*Message[\s\S]*Preview[\s\S]*Send[\s\S]*Done/.test(steps), steps.replace(/\s+/g, ' '));
  check('the open step is marked', /Check/.test(await current(d)));
  check('the check counts Must fix and To check', /Must fix/.test(await d.innerText()) && /To check/.test(await d.innerText()));
  check('the check step has no text under 12 px', (await smallText(d)).length === 0, (await smallText(d)).slice(0, 5).join(' | '));
  const warnBox = d.getByRole('checkbox', { name: /I have checked/ });
  if (await warnBox.count()) await warnBox.check();
  const cont = d.getByRole('button', { name: 'Continue' });
  check('Continue works once the check allows it', await cont.isEnabled());
  await cont.click();

  // 2. The message.
  check('Message is the open step', /Message/.test(await current(d)));
  const note = d.getByLabel('Note for this version');
  check('the note starts filled in', (await note.inputValue()).length > 0);
  await note.fill('');
  check('Preview waits for a note', await d.getByRole('button', { name: 'Preview the emails' }).isDisabled());
  await note.fill('November roster, agreed');
  check('the nurses to email are tick boxes', (await d.getByRole('list', { name: 'Nurses to email' }).getByRole('checkbox').count()) > 0);
  check('the message step has no text under 12 px', (await smallText(d)).length === 0, (await smallText(d)).slice(0, 5).join(' | '));
  if (shots) await page.screenshot({ path: `${shots}/publish-message.png` });
  await d.getByRole('button', { name: 'Preview the emails' }).click();

  // 3. The preview.
  check('Preview is the open step', /Preview/.test(await current(d)));
  check('the preview shows a subject', /Subject:/.test(await d.innerText()));
  check('test mode is said plainly', /Test mode/.test(await d.innerText()));
  const send = d.getByRole('button', { name: /^Publish (and email|without emails)/ });
  check('the send button names how many nurses', /Publish and email \d+ nurses?/.test(await send.innerText()), await send.innerText());

  // 4. Send and done.
  const versionsBefore = (await col('versions')).filter((v) => v.isPublished).length;
  await send.click();
  await d.getByRole('button', { name: 'Done' }).waitFor({ timeout: 60000 });
  check('Done is the open step', /Done/.test(await current(d)));
  check('it says which version was published', /Published version \d+/.test(await d.innerText()));
  check('the header names the same version', /Published as version (\d+)/.exec(await d.innerText())?.[1] === /Published version (\d+)/.exec(await d.innerText())?.[1]);
  check('a published version is saved', (await col('versions')).filter((v) => v.isPublished).length === versionsBefore + 1);
  check('an email log is saved', (await col('emailLog')).length >= 1);
  check('the done step has no text under 12 px', (await smallText(d)).length === 0, (await smallText(d)).slice(0, 5).join(' | '));
  if (shots) await page.screenshot({ path: `${shots}/publish-done.png` });
  await d.getByRole('button', { name: 'Done' }).click();
  await d.waitFor({ state: 'detached', timeout: 5000 });

  // 5. Share links: only the links to view, and where access is given.
  await page.getByRole('button', { name: 'More actions' }).click();
  await page.getByRole('menuitem', { name: /^Share links/ }).click();
  const sh = page.getByRole('dialog', { name: 'Share links' });
  await sh.waitFor({ timeout: 5000 });
  check('Share links has no Invitations tab', (await sh.getByRole('tab').count()) === 0 && !/Invitation/.test(await sh.innerText()));
  await sh.getByRole('button', { name: 'Open Access and permissions' }).click();
  await page.waitForTimeout(800);
  check('the button opens Settings, Access and permissions', /settings\?tab=access-roles/.test(page.url()) && (await page.getByRole('dialog', { name: 'Share links' }).count()) === 0);

  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})();
