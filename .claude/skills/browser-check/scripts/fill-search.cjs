// Search dialog controls only. Fake state keeps these checks independent of search duration.
// Run from the repository: NODE_PATH=$(npm root -g) node .claude/skills/browser-check/scripts/fill-search.cjs [--base http://localhost:5179] [--shots <folder>]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright-core')); }
const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;
const root = process.cwd();
const fixture = path.join(root, '_preview', 'fill-search-fixture.tsx');
const html = path.join(root, '_preview', 'fill-search-fixture.html');

(async () => {
  if (!fs.existsSync(path.join(root, '_preview', 'preview.css'))) throw new Error('Start the browser check page first.');
  if (shots) fs.mkdirSync(shots, { recursive: true });
  fs.writeFileSync(html, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><script type="module" src="./fill-search-fixture.tsx"></script></body></html>');
  fs.writeFileSync(fixture, `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FillDialog } from ${JSON.stringify('/@fs' + path.join(root, 'src/components/roster/FillDialog.tsx'))};
import './preview.css';
const root = createRoot(document.body.appendChild(document.createElement('div')));
const counts = { cancel: 0, close: 0, execute: 0 };
const summary = { scheduleName:'Test roster',startDate:'2026-11-19',endDate:'2026-12-18',totalDays:30,totalBlocks:5,
 activeNursesCount:13,activeDoctorsCount:8,doctorSessionsCount:170,bloodCollectionNursesCount:13,
 existingLocksCount:1,existingLeaveDaysCount:0,estimatedTotalAssignments:200,nurseClinicRuleEnabled:true,nurseClinicRuleSeverity:'HARD' };
const close = (kind) => { counts[kind]++;root.render(null); };
const show = (phase, cancelling = false) => root.render(<FillDialog mode="GENERATE_ALL" summary={summary}
 assignments={[{id:'manual',nurseId:'test',date:'2026-11-19',scheduleId:'test',source:'MANUAL'}]}
 fillRange={{enabled:false,start:summary.startDate,end:summary.endDate}} setFillRange={()=>{}} keepManual setKeepManual={()=>{}}
 clearIncludeManual={false} setClearIncludeManual={()=>{}} onNurseClinicRule={()=>{}}
 isGenerating={!!phase} isCancelling={cancelling} progress={phase?{currentDay:1,totalDays:30,currentDate:summary.startDate,statusText:'Checking exchanges',percent:45}:null}
 runProgress={phase?{phase,elapsedMs:45000,uncoveredDoctorMinutes:90,searchLimited:false}:undefined}
 onClose={()=>close('close')} onCancel={()=>close('cancel')} onRun={()=>{counts.execute++}} />);
window.__fillFixture = { show, counts };
show();
`);
  let browser;
  try {
    browser = await chromium.launch(fs.existsSync('/usr/bin/chromium')
      ? { executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] } : {});
    const p = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    const errors = []; let count = 0;
    p.on('pageerror', error => errors.push(String(error)));
    await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await p.route('**/favicon.ico', r => r.fulfill({ status: 204 }));
    const check = (ok, label) => { assert.ok(ok, label); count++; console.log('PASS ' + label); };
    await p.goto(base + '/fill-search-fixture.html');
    const dialog = p.getByRole('dialog', { name: 'Fill the whole roster: Test roster' });
    await dialog.waitFor();
    check((await dialog.innerText()).includes('Only the final checked result is saved.'), 'preflight explains automatic final save');
    await p.evaluate(() => window.__fillFixture.show('searching'));
    await dialog.getByRole('button', { name: 'Cancel search', exact: true }).waitFor();
    check(await dialog.getByRole('button', { name: 'Cancel search', exact: true }).isEnabled(), 'search keeps Cancel available');
    check(await dialog.locator('input').evaluateAll(items => items.every(input => input.matches(':disabled'))), 'search locks every preflight option');
    check((await dialog.innerText()).includes('Missing doctor cover in the best result: 1 h 30 min.') && (await dialog.innerText()).includes('Elapsed: 45 seconds.'), 'search shows missing cover and elapsed time');
    check(await dialog.getByRole('progressbar', { name: 'Roster search progress' }).getAttribute('aria-valuenow') === '45', 'progress has an accessible name and value');
    await dialog.getByRole('button', { name: 'Cancel search', exact: true }).click();await dialog.waitFor({ state: 'hidden' });
    check(await p.evaluate(() => window.__fillFixture.counts.cancel === 1 && window.__fillFixture.counts.execute === 0), 'Cancel requests cancellation rather than another run');
    await p.evaluate(() => window.__fillFixture.show('validating'));await dialog.waitFor();await p.keyboard.press('Escape');await dialog.waitFor({ state: 'hidden' });
    check(await p.evaluate(() => window.__fillFixture.counts.cancel === 2), 'Escape can cancel while checking the candidate');
    await p.evaluate(() => window.__fillFixture.show('saving'));await dialog.waitFor();
    check(await dialog.getByRole('button', { name: 'Cancel search', exact: true }).isDisabled() && await dialog.getByRole('button', { name: 'Close', exact: true }).isDisabled(), 'final saving disables Cancel and Close');
    await p.keyboard.press('Escape');
    check(await dialog.isVisible() && (await dialog.innerText()).includes('The search is finished and the final result is being saved.'), 'saving explains why it cannot be closed');
    await p.keyboard.press('Tab');
    check(await dialog.evaluate(el => el.contains(document.activeElement)), 'saving keeps keyboard focus inside the dialog');
    await p.keyboard.press('Shift+Tab');
    check(await dialog.evaluate(el => el.contains(document.activeElement)), 'saving keeps reverse keyboard focus inside the dialog');
    await p.evaluate(() => window.__fillFixture.show('searching'));
    await p.waitForFunction(() => [...document.querySelectorAll('[role="dialog"] button')]
      .some(button => button.textContent.trim() === 'Cancel search' && !button.matches(':disabled')));
    await dialog.getByRole('button', { name: 'Cancel search', exact: true }).focus();
    check(await dialog.getByRole('button', { name: 'Cancel search', exact: true }).evaluate(el => el === document.activeElement), 'search cancellation can receive keyboard focus');
    await p.evaluate(() => window.__fillFixture.show('saving'));
    await p.keyboard.press('Tab');
    check(await dialog.evaluate(el => el.contains(document.activeElement)), 'saving traps Tab after the focused Cancel button becomes disabled');
    await p.keyboard.press('Shift+Tab');
    check(await dialog.evaluate(el => el.contains(document.activeElement)), 'saving traps Shift Tab after the focused Cancel button becomes disabled');
    await p.evaluate(() => window.__fillFixture.show('searching'));await dialog.getByRole('button', { name: 'Close', exact: true }).click();await dialog.waitFor({ state: 'hidden' });
    check(await p.evaluate(() => window.__fillFixture.counts.cancel === 3 && window.__fillFixture.counts.close === 0), 'Close requests cancellation during search');
    await p.evaluate(() => window.__fillFixture.show('validating', true));await dialog.waitFor();
    check(await dialog.getByRole('button', { name: 'Cancelling', exact: true }).isDisabled(), 'repeated cancellation is held until it completes');
    await p.evaluate(() => window.__fillFixture.show('searching'));
    if (shots) { await p.waitForTimeout(400);await p.screenshot({ path: path.join(shots, 'fill-search-desktop.png') }); }
    await p.setViewportSize({ width: 390, height: 844 });
    check(await dialog.evaluate(el => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && el.scrollWidth <= el.clientWidth + 1; }), 'search dialog fits a phone without horizontal scrolling');
    if (shots) { await p.waitForTimeout(400);await p.screenshot({ path: path.join(shots, 'fill-search-phone.png') }); }
    check(errors.length === 0, 'no page errors');console.log('TOTAL ' + count + ' checks');
  } finally {
    if (browser) await browser.close();
    for (const file of [fixture, html]) if (fs.existsSync(file)) fs.unlinkSync(file);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
