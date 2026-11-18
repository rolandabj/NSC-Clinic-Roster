// Check the actual roster screen with the browser check page's fake repository and sign in.
// Controlled writes check save recovery; real workers check timed allocation, reload, notes and pins.
// No live database or email service is used. Start the browser check page first.
// Run: NODE_PATH=$(npm root -g) node .claude/skills/browser-check/scripts/fill-verification.cjs [--base http://localhost:5179] [--shots <folder>]
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
        let currentRepo;
        Object.defineProperty(window, '__repo', { configurable: true,
            get: () => currentRepo,
            set: repo => {
                currentRepo = repo;
                const saved = sessionStorage.getItem('stage5-browser-database');
                if (saved) repo.data = Object.fromEntries(Object.entries(JSON.parse(saved)).map(([c, values]) => [c, new Map(values.map(item => [item.id, item]))]));
            },
        });
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
        await r.update('assignments', a.id, { note: 'Original roster before Stage 5 browser verification' });
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
async function durableReload(p) {
    await p.evaluate(() => sessionStorage.setItem('stage5-browser-database', JSON.stringify(Object.fromEntries(
        Object.entries(window.__repo.data).map(([c, map]) => [c, [...map.values()]])))));
    await p.reload();
    await p.locator('[data-cell="mary|2026-11-18"]').waitFor();
    await p.waitForTimeout(350);
}
async function waitSaved(p) {
    await p.waitForFunction(() => !document.body.innerText.includes('Shifts not saved:'));
    await p.waitForTimeout(350);
}
async function pairedSetup(browser, shared) {
    const p = await setup(browser, 'real');
    // Return to a different screen before changing the fake clinic, as another planner would.
    await p.evaluate(() => { location.hash = 'nurses'; });
    await p.getByRole('button', { name: 'Edit Mary', exact: true }).waitFor();
    await p.evaluate(async shared => {
        const r = window.__repo;
        await r.update('nurses', 'mary', {
            preferences: [{ kind: 'DOCTOR', refId: 'lee', rank: 1 }, { kind: 'DOCTOR', refId: 'ray', rank: 2 }],
            doctorEligibility: { doctorIds: ['lee', 'ray'], specialtyIds: [], reviewedBy: 'test-lead', reviewedAt: '2026-11-18T10:00:00Z' },
        });
        await r.update('doctors', 'lee', { lowAcuity: shared, weeklyPattern: [{ weekday: 3, startTime: '09:00', endTime: shared ? '17:00' : '12:30', room: 'R1' }] });
        await r.update('doctors', 'ray', { active: true, lowAcuity: shared, weeklyPattern: [{ weekday: 3, startTime: shared ? '09:00' : '13:45', endTime: '17:00', room: 'R2' }] });
        location.hash = 'schedules?roster=nov';
    }, shared);
    await p.locator('[data-cell="mary|2026-11-18"]').waitFor();
    await p.waitForTimeout(350);
    return p;
}
(async () => {
    const browser = await chromium.launch(launchOptions);
    try {
        {
            const p = await setup(browser);
            const before = await snapshot(p);
            const d = await start(p);
            await p.evaluate(() => {
                const r = window.__repo, write = r.bulkWrite.bind(r);
                window.__failAssignments = true;
                r.bulkWrite = async (c, changes) => {
                    if (c === 'assignments' && window.__failAssignments) throw new Error('Shift save verification failure');
                    return write(c, changes);
                };
                window.__workerCtl.releaseResult();
            });
            await d.waitFor({ state: 'hidden' });
            await p.getByRole('button', { name: 'Retry now', exact: true }).waitFor();
            check(JSON.stringify((await snapshot(p)).assignments) === JSON.stringify(before.assignments), 'failed final shift write retains original saved assignments');
            check((await p.locator('[data-cell="mary|2026-11-18"]').getAttribute('aria-label')).includes('Dr Lee'), 'failed final save retains checked result visibly for Retry or Undo');
            check((await snapshot(p)).versions.filter(v => v.kind === 'BACKUP').length === 1, 'failed final save retains exactly one required backup');
            await shot(p, 'failed-save-retry.png');
            await p.evaluate(() => { window.__failAssignments = false; });
            await p.getByRole('button', { name: 'Retry now', exact: true }).click();
            await waitSaved(p);
            const after = await snapshot(p);
            check(after.assignments.length === 2 && after.assignments.some(a => a.id === 'candidate-mary'), 'Retry saves the exact checked candidate');
            check(await p.getByRole('button', { name: 'Retry now', exact: true }).count() === 0, 'successful Retry clears the failed save status');
            await p.getByRole('button', { name: 'Undo', exact: true }).click();
            await waitSaved(p);
            check(JSON.stringify((await snapshot(p)).assignments) === JSON.stringify(before.assignments), 'Undo after successful Retry restores exact prefill shifts');
            await p.getByRole('button', { name: 'Redo', exact: true }).click();
            await waitSaved(p);
            await durableReload(p);
            check(JSON.stringify((await snapshot(p)).assignments) === JSON.stringify(after.assignments), 'successful candidate survives a full page reload from the fake database');
            check((await p.locator('[data-cell="mary|2026-11-18"]').getAttribute('aria-label')).includes('Dr Lee'), 'reloaded grid shows the stored doctor cover');
            await p.close();
        }
        {
            const p = await setup(browser);
            const before = await snapshot(p);
            const d = await start(p);
            await p.evaluate(() => {
                const r = window.__repo, create = r.create.bind(r);
                window.__failBackup = true;
                r.create = async (c, data) => {
                    if (c === 'versions' && window.__failBackup) throw new Error('Backup verification failure');
                    return create(c, data);
                };
                window.__workerCtl.releaseResult();
            });
            await p.getByText(/Backup verification failure/).waitFor();
            check(await d.isVisible(), 'failed required backup keeps fill dialog open for review');
            check(JSON.stringify(await snapshot(p)) === JSON.stringify(before), 'failed required backup writes no shifts, clinics, roster or backup');
            check((await p.locator('[data-cell="mary|2026-11-18"]').getAttribute('aria-label')).startsWith('No shift'), 'backup failure leaves the original grid unchanged');
            await shot(p, 'backup-failure.png');
            await p.evaluate(() => { window.__failBackup = false; });
            await d.getByRole('button', { name: 'Fill roster', exact: true }).click();
            await p.waitForFunction(() => window.__workerCtl.requests === 2);
            await p.evaluate(() => window.__workerCtl.releaseResult());
            await d.waitFor({ state: 'hidden' });
            check((await snapshot(p)).versions.filter(v => v.kind === 'BACKUP').length === 1, 'retry after backup failure keeps one correct backup');
            check((await snapshot(p)).assignments.some(a => a.id === 'candidate-mary'), 'retry after backup failure can save the checked result');
            await p.close();
        }
        {
            const p = await setup(browser);
            const before = await snapshot(p);
            const d = await start(p);
            await p.evaluate(() => {
                const r = window.__repo, write = r.bulkWrite.bind(r);
                let first = true;
                r.bulkWrite = async (c, changes) => {
                    if (c === 'assignments' && first) {
                        first = false;
                        for (const item of changes.upserts) r.col(c).set(item.id, structuredClone(item));
                        throw new Error('Connection lost after candidate records committed');
                    }
                    return write(c, changes);
                };
                window.__workerCtl.releaseResult();
            });
            await d.waitFor({ state: 'hidden' });
            await p.getByRole('button', { name: 'Retry now', exact: true }).waitFor();
            check((await snapshot(p)).assignments.some(a => a.id === 'candidate-mary'), 'partial failure leaves a committed candidate record');
            await p.evaluate(() => {
                const r = window.__repo;
                const added = { ...structuredClone([...r.col('assignments').values()].find(a => a.nurseId === 'amy')),
                    id: 'other-planner-shift', nurseId: 'sara', note: 'Added elsewhere while this save failed' };
                r.col('assignments').set(added.id, added);
            });
            await p.getByRole('button', { name: 'Undo', exact: true }).click();
            await waitSaved(p);
            const after = await snapshot(p);
            check(!after.assignments.some(a => a.id === 'candidate-mary'), 'Undo removes candidate records left by the partial failure');
            check(after.assignments.some(a => a.id === 'other-planner-shift'), 'Undo preserves records added by another planner');
            check(JSON.stringify(after.assignments.filter(a => a.id !== 'other-planner-shift')) === JSON.stringify(before.assignments), 'Undo after partial failure restores original shift values exactly');
            check(await p.getByRole('button', { name: 'Retry now', exact: true }).count() === 0, 'Undo recovery clears the failed save instead of retrying the discarded candidate');
            await shot(p, 'partial-save-undo.png');
            await durableReload(p);
            check(!(await snapshot(p)).assignments.some(a => a.id === 'candidate-mary'), 'reloading confirms the discarded candidate was removed from storage');
            await p.close();
        }
        for (const shared of [false, true]) {
            const p = await pairedSetup(browser, shared);
            const d = await start(p);
            await d.waitFor({ state: 'hidden', timeout: 60000 });
            await waitSaved(p);
            const saved = await snapshot(p);
            const paired = saved.assignments.find(a => a.nurseId === 'mary');
            check(paired?.doctorCoverage?.length === 2 && new Set(paired.doctorCoverage.map(r => r.doctorId)).size === 2,
                (shared ? 'shared' : 'sequential') + ' real worker saves both exact doctor allocations in one paid duty');
            const cell = p.locator('[data-cell="mary|2026-11-18"]');
            check((await cell.getAttribute('aria-label')).includes('Dr Lee') && (await cell.getAttribute('aria-label')).includes('Dr Ray'),
                (shared ? 'shared' : 'sequential') + ' cell names both doctors accessibly');
            check(await cell.getByText(shared ? '2 doctors' : 'In turn', { exact: true }).isVisible(),
                (shared ? 'shared' : 'sequential') + ' cell shows the appropriate coverage badge');
            await shot(p, shared ? 'shared-duty.png' : 'sequential-duty.png');
            if (shared) {
                await p.evaluate(() => { location.hash = 'schedules?roster=nov&sheet=problems'; });
                await p.getByRole('combobox', { name: 'Type of problem' }).selectOption('DOCTOR_COVER');
                await p.getByRole('combobox', { name: 'How serious' }).selectOption('INFO');
                await p.getByText(/One nurse covers two low acuity doctors as a last resort/).waitFor();
                check((await p.locator('body').innerText()).includes('Dr Lee') && (await p.locator('body').innerText()).includes('Dr Ray'), 'real generated sharing has an informational note with both doctors');
                await shot(p, 'shared-duty-note.png');
                await p.evaluate(() => { location.hash = 'schedules?roster=nov'; });
            } else {
                check(paired.doctorCoverage[0].startTime === '09:00' && paired.doctorCoverage[0].endTime === '12:30' &&
                    paired.doctorCoverage[1].startTime === '13:45' && paired.doctorCoverage[1].endTime === '17:00',
                    'normal acuity doctors retain their exact sequential times and Float gap');
            }
            await durableReload(p);
            check(JSON.stringify((await snapshot(p)).assignments) === JSON.stringify(saved.assignments),
                (shared ? 'shared' : 'sequential') + ' exact allocations survive page reload');
            await p.setViewportSize({ width: 390, height: 844 });
            await p.waitForTimeout(400);
            check((await p.locator('body').innerText()).includes('Lee') && (await p.locator('body').innerText()).includes('Ray'),
                (shared ? 'shared' : 'sequential') + ' phone roster retains both doctor names');
            check(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'timed duty phone page has no horizontal overflow');
            await shot(p, shared ? 'shared-duty-phone.png' : 'sequential-duty-phone.png');
            await p.close();
        }
        {
            const p = await setup(browser, 'real');
            await p.evaluate(() => { location.hash = 'nurses'; });
            await p.getByRole('button', { name: 'Edit Mary', exact: true }).waitFor();
            const pinned = await p.evaluate(async () => {
                const r = window.__repo, date = '2026-11-18';
                await r.update('nurses', 'sara', { active: true });
                const manual = { id: 'manual-mary', scheduleId: 'nov', nurseId: 'mary', date, dutyWindowId: 'd921', kind: 'CLINICAL_ROLE', clinicalRoleId: 'role-float', source: 'MANUAL', locked: false };
                const pin = { ...manual, id: 'pinned-sara', nurseId: 'sara', locked: true, note: 'Keep this full pinned record' };
                await r.create('assignments', manual); await r.create('assignments', pin);
                await r.create('locks', { id: 'sara-pin', nurseId: 'sara', date, mode: 'ASSIGNMENT', dutyWindowId: 'd921', assignmentKind: 'CLINICAL_ROLE', targetRefId: 'role-float' });
                location.hash = 'schedules?roster=nov';
                return pin;
            });
            await p.locator('[data-cell="sara|2026-11-18"]').waitFor();
            await p.getByRole('button', { name: /Fill roster/ }).first().click();
            await p.getByRole('menuitem', { name: /Clear filled shifts/ }).click();
            const d = p.getByRole('dialog', { name: /Clear filled shifts/ });
            await d.getByRole('checkbox', { name: /^Also remove/ }).check();
            await d.getByRole('button', { name: 'Clear shifts', exact: true }).click();
            await d.waitFor({ state: 'hidden' }); await waitSaved(p);
            check(JSON.stringify((await snapshot(p)).assignments) === JSON.stringify([pinned]), 'Clear including hand changes preserves the complete pinned assignment');
            check(await p.evaluate(() => window.__repo.col('locks').has('sara-pin')), 'Clear including hand changes preserves its authoritative pin');
            check((await snapshot(p)).versions.filter(v => v.kind === 'BACKUP').length === 1, 'Clear keeps a backup of the removed manual and generated duties');
            await p.close();
        }
        check(errors.length === 0, 'no application page errors across Stage 5 verification');
        console.log('TOTAL ' + checks + ' checks');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
