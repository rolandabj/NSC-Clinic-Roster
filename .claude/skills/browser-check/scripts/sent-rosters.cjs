// Sent rosters (UI overhaul Phase 7, slice 6b): the Publish screen renamed, no publishing of its
// own (one publish flow, from the roster screen), read replies with reminders, the emails sent
// 25 emails at a time with "Show 25 older emails", each one opened with its recipients, private links,
// dates as DD-MM-YYYY, the screen kept from managers, and a phone without sideways scroll.
// Run: NODE_PATH=$(npm root -g) node sent-rosters.cjs [--base http://localhost:5180] [--shots <folder>]
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

  // 30 sends in the email log and a read receipt for two nurses, before the screen opens.
  await page.goto(`${base}/?view=app#dashboard`);
  await page.locator('main').waitFor({ timeout: 60000 });
  await page.evaluate(() => {
    const logs = window.__repo.col('emailLog');
    for (let i = 0; i < 30; i++) {
      const day = String((i % 28) + 1).padStart(2, '0');
      logs.set(`log${i}`, {
        id: `log${i}`, scheduleId: 'nov', versionId: 'v-nov-1', kind: i % 3 === 0 && i > 0 ? 'REMINDER' : 'PUBLISH', status: i === 0 ? 'PARTIAL' : 'SENT',
        sentAt: `2026-10-${day}T08:${String(i).padStart(2, '0')}:00Z`,
        recipients: [
          { email: 'amy@example.com', nurseId: 'amy', nurseName: 'Amy', subject: `Roster ${i}`, bodyPreview: 'Your shifts', fullBodyHtml: '<p>Your shifts</p>', status: 'SENT' },
          ...(i === 0 ? [{ email: 'mary@example.com', nurseId: 'mary', nurseName: 'Mary', subject: 'Roster 0', bodyPreview: '', fullBodyHtml: '', status: 'FAILED', errorMessage: 'Mailbox full' }] : []),
        ],
      });
    }
    const acks = window.__repo.col('acknowledgments');
    acks.set('ack-amy', { id: 'ack-amy', scheduleId: 'nov', nurseId: 'amy', versionId: 'v-nov-1', token: 't-amy', sentAt: '2026-10-28T08:00:00Z', ackAt: '2026-10-29T09:00:00Z' });
    acks.set('ack-mary', { id: 'ack-mary', scheduleId: 'nov', nurseId: 'mary', versionId: 'v-nov-1', token: 't-mary', sentAt: '2026-10-28T08:00:00Z' });
  });
  await page.getByRole('link', { name: 'Sent rosters' }).first().click();
  await page.getByRole('heading', { name: 'Sent rosters', level: 1 }).waitFor({ timeout: 10000 });
  await page.waitForTimeout(800);
  const main = page.locator('main');
  if (shots) await page.screenshot({ path: `${shots}/sent-replies.png` });

  // 1. One publish flow: no Publish of its own here.
  check('the menu calls it Sent rosters', (await page.getByRole('link', { name: 'Sent rosters' }).count()) >= 1 && (await page.getByRole('link', { name: /^Publish$/ }).count()) === 0);
  check('no Publish or Send change alerts on this screen', (await main.getByRole('button', { name: /^(Publish Official Roster|Send Change Alerts|Publish the roster)/ }).count()) === 0);
  check('it says rosters are published from the roster screen', /published from the roster screen/.test(await main.innerText()));
  check('no text under 12 px', (await smallText(main)).length === 0, (await smallText(main)).slice(0, 5).join(' | '));
  check('no old words (acknowledgment, dispatched, broadcast, ledger)', !/acknowledg|dispatch|broadcast|ledger|gmail address/i.test(await main.innerText()));

  // 2. Read replies.
  const replies = page.getByRole('table', { name: /Read replies for November/ });
  const rtext = await replies.innerText();
  check('Amy has seen it, with the date as DD-MM-YYYY', /Seen on 29-10-2026/.test(rtext));
  check('Mary is waiting, with Remind', /Waiting/.test(rtext) && (await main.getByRole('button', { name: 'Send a reminder to Mary' }).count()) === 1);
  check('one of two have confirmed', /1 of 2 nurses have confirmed/.test(await main.innerText()));
  const logsBefore = await page.evaluate(() => window.__repo.col('emailLog').size);
  await main.getByRole('button', { name: 'Send a reminder to Mary' }).click();
  await page.waitForTimeout(1500);
  check('a reminder is logged', (await page.evaluate(() => window.__repo.col('emailLog').size)) === logsBefore + 1);

  // 3. Emails sent: 25 at a time.
  await page.getByRole('tab', { name: /Emails sent/ }).click();
  await page.waitForTimeout(600);
  const sendsTable = page.getByRole('table', { name: 'Emails sent, newest first' });
  const rowCount = () => sendsTable.locator('tbody tr').count();
  check('the first 25 sends are shown', (await rowCount()) === 25, String(await rowCount()));
  check('the dates are DD-MM-YYYY', /\d{2}-\d{2}-2026 \d{2}:\d{2}/.test(await sendsTable.innerText()));
  await main.getByRole('button', { name: 'Show 25 older emails' }).click();
  await page.waitForTimeout(800);
  check('Show 25 older emails shows the rest, each once', (await rowCount()) === 31, String(await rowCount()));
  check('and the button goes when none are left', (await main.getByRole('button', { name: 'Show 25 older emails' }).count()) === 0);
  await page.getByLabel('What was sent').selectOption('REMINDER');
  check('the filter keeps reminders', (await rowCount()) === 10, String(await rowCount()));
  await page.getByLabel('What was sent').selectOption('ALL');
  if (shots) await page.screenshot({ path: `${shots}/sent-emails.png` });

  // 4. One send, and one email in it.
  await main.getByRole('button', { name: 'Open the email sent on 01-10-2026 08:00' }).click();
  const send = page.getByRole('dialog', { name: /^The whole roster, November/ });
  await send.waitFor({ timeout: 5000 });
  check('the send says what became of it', /1 sent, 1 not sent/.test(await send.innerText()) && /Mailbox full/.test(await send.innerText()));
  check('the send has no text under 12 px', (await smallText(send)).length === 0, (await smallText(send)).join(' | '));
  await send.getByRole('button', { name: 'View the email to Amy' }).click();
  const email = page.getByRole('dialog', { name: 'Email to Amy' });
  await email.waitFor({ timeout: 5000 });
  check('View email opens the email', /Subject: Roster 0/.test(await email.innerText()));
  await email.getByRole('button', { name: 'Back' }).click();
  await send.waitFor({ timeout: 5000 });
  check('Back returns to the send', await send.isVisible());
  await page.keyboard.press('Escape');

  // 5. Private links.
  await page.getByRole('tab', { name: 'Private links' }).click();
  check('each nurse has Make a link', (await main.getByRole('button', { name: /^Make and copy a private link for / }).count()) >= 1);

  // 6. The roster button opens the roster screen.
  await main.getByRole('button', { name: 'Publish from the roster' }).click();
  await page.waitForTimeout(1200);
  check('Publish from the roster opens the roster', /#schedules\?roster=nov/.test(page.url()), page.url());

  // 7. A manager sees the replies but no planner buttons.
  await page.goto(`${base}/?view=app&as=manager#publish`);
  await page.getByRole('heading', { name: 'Sent rosters', level: 1 }).waitFor({ timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(800);
  // Only planners reach Sent rosters (the email log and read replies are planner records).
  check('a manager is not shown Sent rosters', (await page.getByRole('heading', { name: 'Sent rosters', level: 1 }).count()) === 0 && (await page.getByRole('link', { name: 'Sent rosters' }).count()) === 0);

  // 8. A phone.
  await page.goto(`${base}/?view=app#publish`);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('heading', { name: 'Sent rosters', level: 1 }).waitFor({ timeout: 30000 });
  await page.waitForTimeout(600);
  const wide = await page.evaluate(() => document.documentElement.scrollWidth);
  check('no sideways scroll on a phone', wide <= 390, `${wide} px`);

  check('no page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
  process.exit(results.every((r) => r.ok) ? 0 : 1);
})();
