// Check the actual roster screen with the browser check page's fake repository and sign in.
// Controlled worker timing covers cancellation and save boundaries; one real worker checks the bundled engine and search.
// No live database or email service is used. Start the browser check page first.
// Run: NODE_PATH=$(npm root -g) node .claude/skills/browser-check/scripts/fill-lifecycle.cjs [--base http://localhost:5179] [--shots <folder>]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let chromium;
try {
    ({ chromium } = require('playwright'));
}
catch {
    ({ chromium } = require('/opt/codex/cua_node/lib/node_modules/playwright-core'));
}
const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5179';
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;
if (shots)
    fs.mkdirSync(shots, { recursive: true });
const shot = (page, filename) => shots ? page.screenshot({ path: path.join(shots, filename) }) : Promise.resolve();
const launchOptions = fs.existsSync('/usr/bin/chromium')
    ? { executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] } : {};
let checks = 0;
const errors = [];
function check(ok, label) { assert.ok(ok, label); checks++; console.log('PASS ' + label); }
async function snapshot(page) { return page.evaluate(() => Object.fromEntries(['assignments', 'versions', 'doctorSessions', 'schedules'].map(c => [c, [...window.__repo.col(c).values()].sort((a, b) => a.id.localeCompare(b.id))]))); }
async function setup(browser, mode = 'controlled') {
    const p = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    p.setDefaultTimeout(15000);
    p.on('pageerror', e => errors.push(String(e)));
    await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await p.route('**/favicon.ico', r => r.fulfill({ status: 204 }));
    await p.addInitScript(({ mode }) => {
        const RealWorker = window.Worker;
        window.__workerCtl = { mode, requests: 0, terminations: 0, resultReady: false, events: [] };
        window.Worker = class {
            constructor(url, options) {
                this.onmessage = null;
                this.onerror = null;
                this.onmessageerror = null;
                this.stopped = false;
                this.real = mode === 'real' ? new RealWorker(url, options) : null;
                if (this.real) {
                    this.real.onmessage = e => { window.__workerCtl.events.push(e.data.type); if (e.data.type === 'result')
                        window.__workerCtl.resultReady = true; this.onmessage?.(e); };
                    this.real.onerror = e => this.onerror?.(e);
                    this.real.onmessageerror = e => this.onmessageerror?.(e);
                }
            }
            postMessage(request) {
                const ctl = window.__workerCtl;
                ctl.requests++;
                ctl.input = request.input;
                if (this.real) {
                    this.real.postMessage({ ...request, budgetMs: 20000 });
                    return;
                }
                const emit = data => { if (!this.stopped)
                    this.onmessage?.({ data }); };
                const progress = { phase: 'searching', elapsedMs: 1000, remainingMs: 119000, currentDay: 1, totalDays: 1, currentDate: '2026-11-18', percent: 45, statusText: 'Checking candidate exchanges', bestUncoveredDoctorMinutes: 0, examinedStates: 24, acceptedExchanges: 1 };
                queueMicrotask(() => emit({ type: 'progress', jobId: request.jobId, progress }));
                ctl.releaseResult = () => {
                    const assignments = [...structuredClone(request.input.assignments).filter(a => a.id !== ctl.omitId), { id: 'candidate-mary', scheduleId: 'nov', nurseId: 'mary', date: '2026-11-18', dutyWindowId: 'd921', kind: 'DOCTOR', doctorId: 'lee', doctorCoverage: [{ doctorId: 'lee', startTime: '09:00', endTime: '17:00' }], source: 'GENERATED', locked: false }];
                    ctl.resultReady = true;
                    emit({ type: 'result', jobId: request.jobId, result: { scheduleId: 'nov', assignments, createdCount: 1, preservedLocksCount: 0, preservedManualCount: 0, unmetSlotsCount: 0, generationDurationMs: 1000, search: { termination: 'exhausted', initialUncoveredDoctorMinutes: 480, finalUncoveredDoctorMinutes: 0, examined: 24, accepted: 1, elapsedMs: 1000, remainingHardProblems: 0, remainingNurseClinicMinutes: 0 }, validation: { scheduleId: 'nov', timestamp: new Date().toISOString(), errorCount: 0, warnCount: 0, infoCount: 0, findings: [], hourlyCoverageMap: {} } } });
                };
            }
            terminate() { this.stopped = true; window.__workerCtl.terminations++; this.real?.terminate(); }
        };
    }, { mode });
    await p.goto(base + '/?view=app&seed=clean#nurses');
    await p.getByRole('button', { name: 'Edit Mary', exact: true }).waitFor();
    await p.evaluate(async () => {
        const r = window.__repo;
        await r.update('nurses', 'mary', { active: true, doctorEligibility: { doctorIds: ['lee'], specialtyIds: [], reviewedBy: 'lead', reviewedAt: '2026-11-18T10:00:00Z' } });
        await r.update('doctors', 'lee', { weeklyPattern: [{ weekday: 3, startTime: '09:00', endTime: '17:00', room: 'R1' }] });
        await r.update('doctors', 'ray', { active: false });
        const a = [...r.col('assignments').values()][0];
        await r.update('assignments', a.id, { note: 'Original roster before Stage 4 browser test' });
        window.__writeLog = [];
        for (const method of ['create', 'update', 'bulkUpsert', 'bulkWrite', 'bulkRemove', 'remove']) {
            const original = r[method].bind(r);
            r[method] = async (...args) => { window.__writeLog.push({ method, collection: args[0], args: structuredClone(args.slice(1)) }); return original(...args); };
        }
        location.hash = 'schedules?roster=nov';
    });
    await p.locator('[data-cell="mary|2026-11-18"]').waitFor();
    await p.waitForTimeout(300);
    return p;
}
async function start(p) {
    await p.evaluate(() => { window.__writeLog = []; });
    await p.getByRole('button', { name: /Fill roster/ }).first().click();
    await p.getByRole('menuitem', { name: /Fill the whole roster/ }).click();
    const d = p.getByRole('dialog', { name: /Fill the whole roster/ });
    await d.waitFor();
    await d.getByRole('button', { name: /^Fill/ }).last().click();
    await p.waitForFunction(() => window.__workerCtl.requests === 1);
    return d;
}
async function noWrites(p, before, label) { await p.waitForTimeout(250); check(JSON.stringify(await snapshot(p)) === JSON.stringify(before), label + ' keeps assignments, backups, clinics and roster unchanged'); const log = await p.evaluate(() => window.__writeLog); if (log.length)
    console.log('WRITE LOG', JSON.stringify(log)); check(log.length === 0, label + ' performs zero repository writes'); }
async function openFill(p) { await p.getByRole('button', { name: /Fill roster/ }).first().click(); await p.getByRole('menuitem', { name: /Fill the whole roster/ }).click(); const d = p.getByRole('dialog', { name: /Fill the whole roster/ }); await d.waitFor(); await p.evaluate(() => { window.__writeLog = []; }); return d; }
(async () => {
    const browser = await chromium.launch(launchOptions);
    try {
        // Controlled computation proves that no candidate is exposed before the cutoff.
        {
            const p = await setup(browser);
            const before = await snapshot(p);
            const d = await start(p);
            await d.getByRole('button', { name: 'Cancel search', exact: true }).waitFor();
            check((await p.locator('[data-cell="mary|2026-11-18"]').getAttribute('aria-label')).startsWith('No shift'), 'candidate remains private while search runs');
            await noWrites(p, before, 'running search');
            await p.waitForTimeout(400);
            await shot(p, 'searching-desktop.png');
            await d.getByRole('button', { name: 'Cancel search', exact: true }).click();
            await d.waitFor({ state: 'hidden' });
            await noWrites(p, before, 'Cancel during search');
            check(await p.evaluate(() => window.__workerCtl.terminations === 1), 'Cancel terminates worker once');
            await p.close();
        }
        // Server update arrives while the worker is private: final guard must refuse it.
        {
            const p = await setup(browser);
            const d = await start(p);
            await p.evaluate(() => { const r = window.__repo; const old = r.col('nurses').get('mary'); r.col('nurses').set('mary', { ...old, active: false }); window.__workerCtl.releaseResult(); });
            await p.getByText(/clinic details changed during filling/).waitFor();
            check(await d.isVisible(), 'changed server input leaves dialog open for review');
            check(await p.evaluate(() => window.__writeLog.length === 0 && window.__repo.col('versions').size === 1 && window.__repo.col('doctorSessions').size === 0 && window.__repo.col('assignments').size === 1), 'changed server input saves no assignments, backup or planned clinics');
            await p.waitForTimeout(400);
            await shot(p, 'server-change-refused.png');
            await p.close();
        }
        // Read failure at final check must not be treated as empty server data.
        {
            const p = await setup(browser);
            const before = await snapshot(p);
            const d = await start(p);
            await p.evaluate(() => { window.__repo.failReads = true; window.__workerCtl.releaseResult(); });
            await p.getByText(/No connection \(test\)/).waitFor();
            await noWrites(p, before, 'failed final input read');
            check(await d.isVisible(), 'failed read leaves fill dialog available for retry');
            await p.close();
        }
        // Cancel remains effective after the worker result while authoritative guard is pending.
        {
            const p = await setup(browser);
            const before = await snapshot(p);
            const d = await start(p);
            await p.evaluate(() => { const r = window.__repo; const old = r.get.bind(r); window.__guardPending = false; r.get = async (c, id) => { if (c === 'schedules' && id === 'nov') {
                window.__guardPending = true;
                await new Promise(resolve => window.__releaseGuard = resolve);
            } return old(c, id); }; window.__workerCtl.releaseResult(); });
            await p.waitForFunction(() => window.__guardPending === true);
            await d.getByText('Checking the final result', { exact: true }).waitFor();
            check(await d.getByRole('button', { name: 'Cancel search', exact: true }).isEnabled(), 'Cancel remains enabled after worker result during fresh read');
            await d.getByRole('button', { name: 'Cancel search', exact: true }).click();
            await d.waitFor({ state: 'hidden' });
            await noWrites(p, before, 'Cancel during final guard');
            await p.evaluate(() => window.__releaseGuard());
            await p.waitForTimeout(500);
            await noWrites(p, before, 'late guard response after Cancel');
            await p.close();
        }
        // The on screen roster may lag the first authoritative read; syncer must save from fresh server state.
        {
            const p = await setup(browser);
            const original = await snapshot(p);
            await p.evaluate(() => { const r = window.__repo; const a = { ...structuredClone([...r.col('assignments').values()][0]), id: 'server-only', nurseId: 'sara', note: 'Server only newer duty' }; r.col('assignments').set(a.id, a); });
            const baseline = await snapshot(p);
            const d = await start(p);
            check(await p.evaluate(() => window.__workerCtl.input.assignments.some(a => a.id === 'server-only')), 'worker loads newer server assignment absent from grid');
            await p.evaluate(() => { window.__workerCtl.omitId = 'server-only'; window.__workerCtl.releaseResult(); });
            await d.waitFor({ state: 'hidden' });
            await p.waitForTimeout(700);
            const saved = await snapshot(p);
            check(saved.assignments.length === 2 && !saved.assignments.some(a => a.id === 'server-only') && saved.assignments.some(a => a.id === 'candidate-mary'), 'final save removes server only assignment absent from old save queue snapshot');
            const backups = saved.versions.filter(v => v.kind === 'BACKUP');
            check(backups.length === 1 && JSON.stringify(backups[0].snapshot.assignments) === JSON.stringify(baseline.assignments), 'backup captures authoritative newer server baseline');
            await p.getByRole('button', { name: 'Undo', exact: true }).click();
            await p.waitForTimeout(700);
            check(JSON.stringify((await snapshot(p)).assignments) === JSON.stringify(baseline.assignments), 'Undo restores newer server baseline rather than stale displayed roster');
            check(original.assignments.length === 1 && baseline.assignments.length === 2, 'fresh baseline test includes distinct stale displayed and current saved data');
            await p.close();
        }
        // Real module worker uses bundled engine/search and saves only its final result.
        {
            const p = await setup(browser, 'real');
            const before = await snapshot(p);
            const d = await start(p);
            await d.waitFor({ state: 'hidden', timeout: 60000 });
            await p.waitForTimeout(1000);
            const after = await snapshot(p);
            const backup = after.versions.filter(v => v.kind === 'BACKUP');
            check(await p.evaluate(() => window.__workerCtl.resultReady === true && window.__workerCtl.events.includes('progress')), 'real browser module worker emits progress and final result');
            check(after.assignments.some(a => a.nurseId === 'mary' && a.kind === 'DOCTOR' && a.doctorId === 'lee'), 'real worker final doctor cover saves automatically');
            check(after.doctorSessions.length === 1 && after.doctorSessions[0].doctorId === 'lee', 'planned recurring clinic saves only at final commit');
            check(backup.length === 1 && backup[0].number === 0 && JSON.stringify(backup[0].snapshot.assignments) === JSON.stringify(before.assignments), 'automatic backup retains exact prefill assignments');
            const log = await p.evaluate(() => window.__writeLog);
            check(log[0]?.collection === 'versions' && log[0]?.method === 'create' && log.some(x => x.collection === 'assignments'), 'backup is saved before replacing assignments');
            check(!(await p.locator('[data-cell="mary|2026-11-18"]').getAttribute('aria-label')).startsWith('No shift'), 'grid displays final saved doctor duty');
            await p.waitForTimeout(400);
            await shot(p, 'real-worker-saved.png');
            await p.getByRole('button', { name: 'Undo', exact: true }).click();
            await p.waitForTimeout(700);
            const undone = await snapshot(p);
            check(JSON.stringify(undone.assignments) === JSON.stringify(before.assignments), 'Undo restores exact original assignments after final save');
            check((await p.locator('[data-cell="mary|2026-11-18"]').getAttribute('aria-label')).startsWith('No shift'), 'Undo restores original grid');
            await p.close();
        }
        {
            const p = await setup(browser);
            const before = await snapshot(p);
            const d = await openFill(p);
            await d.getByLabel('Only fill some dates', { exact: true }).check();
            await d.getByLabel('From', { exact: true }).fill('17-11-2026');
            await d.getByLabel('From', { exact: true }).press('Tab');
            check(await d.getByRole('button', { name: 'Fill roster', exact: true }).isDisabled(), 'range before roster disables Fill');
            check((await d.innerText()).includes('within this roster'), 'range before roster explains valid bounds');
            await d.getByLabel('From', { exact: true }).fill('18-11-2026');
            await d.getByLabel('To', { exact: true }).fill('19-11-2026');
            await d.getByLabel('To', { exact: true }).press('Tab');
            check(await d.getByRole('button', { name: 'Fill roster', exact: true }).isDisabled(), 'range after roster disables Fill');
            await d.getByLabel('To', { exact: true }).fill('32-11-2026');
            await d.getByLabel('To', { exact: true }).press('Tab');
            check(await d.getByRole('button', { name: 'Fill roster', exact: true }).isDisabled(), 'malformed date disables Fill');
            await d.getByLabel('To', { exact: true }).fill('18-11-2026');
            await d.getByLabel('To', { exact: true }).press('Tab');
            check(await d.getByRole('button', { name: 'Fill roster', exact: true }).isEnabled(), 'exact roster bounds allow Fill');
            await noWrites(p, before, 'changing invalid range');
            check(await p.evaluate(() => window.__workerCtl.requests === 0), 'invalid range never starts worker');
            await p.waitForTimeout(400);
            await shot(p, 'range-controls.png');
            await p.close();
        }
        {
            const p = await setup(browser);
            const before = await snapshot(p);
            const d = await openFill(p);
            await p.evaluate(() => { window.__repo.failReads = true; });
            await d.getByRole('button', { name: 'Fill roster', exact: true }).click();
            await p.getByText(/No connection \(test\)/).waitFor();
            await noWrites(p, before, 'failed initial input read');
            check(await p.evaluate(() => window.__workerCtl.requests === 0), 'failed initial read starts no worker');
            await p.close();
        }
        {
            const p = await setup(browser);
            const before = await snapshot(p);
            const d = await openFill(p);
            await p.evaluate(() => { const r = window.__repo; const old = r.get.bind(r); r.get = async (c, id) => { if (c === 'schedules' && id === 'nov') {
                window.__initialPending = true;
                await new Promise(resolve => window.__releaseInitial = resolve);
            } return old(c, id); }; });
            await d.getByRole('button', { name: 'Fill roster', exact: true }).click();
            await p.waitForFunction(() => window.__initialPending === true);
            await d.getByRole('button', { name: 'Cancel search', exact: true }).click();
            await d.waitFor({ state: 'hidden' });
            await p.evaluate(() => window.__releaseInitial());
            await noWrites(p, before, 'Cancel during initial input read');
            check(await p.evaluate(() => window.__workerCtl.requests === 0), 'Cancel during initial read starts no worker');
            await p.close();
        }
        {
            const p = await setup(browser);
            const d = await start(p);
            await p.evaluate(() => { const r = window.__repo; const old = r.create.bind(r); r.create = async (c, data) => { if (c === 'versions') {
                window.__savingPending = true;
                await new Promise(resolve => window.__releaseSaving = resolve);
            } return old(c, data); }; window.__workerCtl.releaseResult(); });
            await p.waitForFunction(() => window.__savingPending === true);
            await d.getByText('Saving the checked result', { exact: true }).waitFor();
            check(await d.getByRole('button', { name: 'Cancel search', exact: true }).isDisabled() && await d.getByRole('button', { name: 'Close', exact: true }).isDisabled(), 'actual saving cutoff disables Cancel and Close');
            await p.keyboard.press('Escape');
            check(await d.isVisible(), 'Escape leaves actual final commit running');
            check(await p.evaluate(() => window.__repo.col('assignments').size === 1), 'candidate assignments remain private while required backup pending');
            await p.evaluate(() => window.__releaseSaving());
            await d.waitFor({ state: 'hidden' });
            await p.waitForTimeout(400);
            check(await p.evaluate(() => window.__repo.col('assignments').size === 2 && [...window.__repo.col('versions').values()].filter(v => v.kind === 'BACKUP').length === 1), 'final save completes after required backup finishes');
            await p.close();
        }
        check(errors.length === 0, 'no application page errors across lifecycle flows');
        console.log('TOTAL ' + checks + ' checks');
    }
    finally {
        await browser.close();
    }
})().catch(e => { console.error(e); process.exitCode = 1; });
