# NSC Clinic Roster: complete project guide

This file describes the whole web app: what it does, how it is built, where every part of the code lives, how the roster engine thinks, how data is saved, how it is deployed, and how we work on it. Paste it (or point to it) at the start of a new chat so work can continue without re-reading the codebase.

Last updated: 2026-10-03, at commit `9c0b819` on `main`.

---

## 0. Quick start for a new chat

**What it is.** A nurse rostering web app for one outpatient clinic (American Hospital Nad Al Sheba OutPatient clinic, Dubai, timezone Asia/Dubai). Planners build a roster (a grid of nurses × days), the engine fills it automatically, the app checks it against the clinic rules, and the roster is published to nurses by email, private links and a calendar feed.

**Repository.** GitHub `rolandabj/nsc-clinic-roster`. Default branch `main`. Working branch used by Claude sessions: `ccr-7e9cfdbe-x4izxn`.

**Stack.** React 19 + Vite 8 + Tailwind 4 + TypeScript (browser). Cloud Firestore accessed directly from the browser, protected by `firestore.rules`. A small Express server only sends email and serves the `.ics` calendar feed. Hosted by Google AI Studio (Cloud Run), which syncs from GitHub `main`.

**Commands.**

| Command | What it does |
|---|---|
| `npm install --legacy-peer-deps` | Install (the flag is needed for esbuild/vite peer conflicts) |
| `npm run dev` | Express + Vite dev server on port 3000 |
| `npx tsc --noEmit` (or `npm run lint`) | Type check |
| `npm test` | Unit tests (Node test runner via tsx), currently 138 passing |
| `npm run build` | Vite client build + esbuild server bundle to `dist/server.js` |
| `cd tests/firestore-rules && npm install && npm test` | Firestore rules tests in the emulator (needs Java 11+), about 90 assertions |

**Working agreements with the owner (important).**

1. Write prose with **no hyphens**, in plain English. Explain with concrete examples (for example "Amy, whose list is #1 Cardiology, #2 Dr Lee").
2. **Ask before pushing to `main`.** The owner approves with "push to main" or "push to github". Develop and commit on the working branch first, then fast forward `main` when approved.
3. For bug reports, **inspect before writing code**: read the code, explain what is happening, then fix.
4. When something is unclear, ask questions in plain English with examples of each option.
5. No model identifiers in commits. Commit messages end with the Co-Authored-By and Claude-Session trailers given by the session.
6. After changing `firestore.rules`, remind the owner to **publish the rules by hand** in the Firebase console (Firestore → the named database `ai-studio-clinicroster-…` → Rules). AI Studio does not deploy rules.
7. Verify every change with: type check, unit tests, build, and (for rules) the emulator tests. For UI changes, check in a browser (see section 13).

---

## 1. Features at a glance

**For planners (editors)**
- Dashboard: today at the clinic, current roster health, a "Needs your attention" list with one click actions, "Get started" for a new clinic.
- Rosters (Schedules screen): create a roster for a date range, fill it automatically (whole roster, empty cells only, or a date range), edit cells in a spreadsheet style grid, undo/redo, pin cells, see problems with marks on cells, days and nurse names, "Who could cover?" help, coverage by hour, hours per nurse, doctors' clinics per day, leave and pinned days, automatic backups before every fill or clear, named copies (versions), compare copies, templates, swaps, fairness tools, export (PDF, Excel, CSV), share links.
- Live collaboration: see who else is on the same roster, other people's changes appear automatically.
- Publishing: a wizard that blocks publishing while there are "must fix" problems, emails each nurse their personal roster (or only the changes), creates read receipts, updates share links, private nurse pages and calendar feeds. Reminders for unconfirmed receipts.
- Nurses: profile, seniority, contract percent, skills (Nurse Clinic, blood collection and others), ordered list of preferred doctors and specialties with a "which comes first" setting, annual leave quotas.
- Doctors: specialties, weekly clinic pattern, one day changes, cancellations.
- Availability: a 31 day leave grid, record leave by dragging, pin shifts, public holidays as leave, CSV import.
- Settings: clinic profile and opening hours, public holidays, working hours periods, rules (on/off and "must" or "try to"), shifts, leave types, seniority levels, nurse skills, specialties, access and permissions, email, database backup/restore/wipe.
- History, Reports (payroll ledger, equity, quotas), Audit trail.

**For nurses and other viewers**
- Dashboard with "Your next two weeks" (when their access is linked to a nurse profile) and today at the clinic, from published rosters only.
- Request leave, a day off, or a preferred shift; see decisions.
- Managers (viewers with "Can approve leave") approve or decline requests.
- Private phone friendly page `#me?t=TOKEN` with their own shifts, an `.ics` download and a live calendar feed `/calendar/TOKEN.ics`.
- Read receipt page `#ack?token=…` with an explicit "I've received my roster" button.
- Published roster page `#published?token=…&nurse=…`.

---

## 2. Repository layout

```
server.ts                         Entry: loads dist/server.js if built, else server/app.ts
server/
  app.ts                          Express app: helmet, rate limits, auth, routes, Vite or static
  middleware/auth.ts              Bearer token → req.user; requireAuth, requireRole, requirePlanner
  routes/auth.ts                  /api/auth/me, /verify, /logout (+ computePrivileges)
  routes/email.ts                 POST /api/email/test (sends test and roster emails)
  routes/calendar.ts              GET /calendar/:token.ics (public, token is the credential)
  services/auth/firebaseIdentityService.ts   Verifies Firebase ID tokens (jose + Google JWKS), reads userAccess with the caller's token
  services/email/emailService.ts  nodemailer over Gmail SMTP (env vars only), mock mode
  services/firestore/firestoreRest.ts         Unauthenticated Firestore REST reads for the calendar feed
src/
  main.tsx, App.tsx, index.css
  components/
    auth/LoginPage.tsx
    common/  dialogs.tsx (notify, confirmDialog), useDialogA11y.ts, MenuButton.tsx,
             LoadErrorBoundary.tsx, PageLoading.tsx, EmailHtmlPreview.tsx
    layout/  AppShell.tsx, Sidebar.tsx, TopBar.tsx, LocalModeBanner.tsx
    views/   DashboardView, SchedulesView, AvailabilityView, NursesView, DoctorsView,
             HistoryView, PublishView, ReportsView, AuditTrailView, SettingsView,
             PublishedRosterView, MyRosterView, AcknowledgePage, NurseSelfServicePanel,
             ApprovalsQueuePanel, AccessManagementPanel, WorkingHoursPeriodsPanel
    views/settings/  ClinicTab, HolidaysTab, RulesTab, DutiesTab, LeaveTab, SeniorityTab,
                     NurseSkillsTab, SpecialtiesTab, EmailTab, DatabaseTab, shared.tsx
    workbook/ WorkbookGrid.tsx (the roster grid), grid/QuickCellPopup.tsx, ProblemsPanel,
              WhoCanCover, CoverageSheet, DoctorsScheduleSheet, HoursAccountingSheet,
              LeaveAndLocksSheet, WarningsSheet
    modals/  CreateSchedule, Publish, Share, Export, Fairness, Template, SwapManager,
             VersionCompare, VersionView, DeleteVersion, DeleteSchedule, BulkImport,
             NurseTimesheet, EditDoctorShift, Auth, Shortcuts, Walkthrough (disabled)
  services/
    engine/      SchedulingEngine.ts (the generator), assignmentChecks.ts, clinicModel.ts,
                 clinicSetupService.ts, explainCell.ts, leaveStatus.ts, nurseClinicUtils.ts,
                 preferenceOrder.ts, types.ts
    validation/  ScheduleValidator.ts
    hours/       hoursPolicy.ts         reports/ hoursAccounting.ts
    periods/     workingHoursPeriodService.ts
    fairness/    yearToDate.ts, yearSeed.ts
    schedule/    doctorScheduleService.ts, newRosterDates.ts, openSchedule.ts, scheduleDeletionService.ts
    rules/       ruleSyncService.ts
    repository/  IRepository.ts, FirestoreRepository.ts, liveCollectionCache.ts,
                 collectionSyncer.ts, assignmentSync.ts, index.ts
    firebase/    firebaseConfig.ts, quotaTracker.ts
    auth/        authService.ts, access.ts
    publish/     rosterPublishService.ts, publicRosterService.ts, nurseRosterService.ts
    requests/    staffRequestService.ts
    history/     diffEngine.ts, versionList.ts
    dashboard/   dashboardSummary.ts, problemCount.ts
    export/      icsExportService.ts, rosterExportService.ts, rosterPdfService.ts
    presence/    usePresence.ts, presenceRules.ts
    seed/        seedData.ts, seedRunner.ts
    settings/    emailSettingsStore.ts
    i18n/        index.ts (English and Arabic)
  types/  index.ts (all data types), navigation.ts, settings.ts
  utils/  csv.ts, dateUtils.ts, dateFormatter.ts, escapeHtml.ts, weekend.ts
tests/
  unit/*.test.ts + fixtures.ts
  firestore-rules/rules.test.mjs (+ its own package.json)
firestore.rules
firebase-applet-config.json   Firebase web config (project gen-lang-client-0671372661, named database)
firebase-blueprint.json       AI Studio schema description (out of date, informational)
metadata.json                 AI Studio applet manifest
vite.config.ts, tsconfig.json, index.html, .github/workflows/ci.yml, .env.example
```

---

## 3. Users, roles and access

**Sign in.** Google popup only (`authService.signInWithGoogle`). The email must be verified.

**Owner.** `rolandabj@gmail.com` is hard coded as OWNER in three places: `firestore.rules` (`isOwner()`), `server/services/auth/firebaseIdentityService.ts` (`MASTER_ADMIN_EMAIL`), `src/services/auth/authService.ts` (`MASTER_ADMIN_EMAIL`), and as the email `from` fallback. Changing the owner means editing all of them and republishing the rules.

**Everyone else** needs a document `userAccess/{lowercased email}`:

| Field | Values | Meaning |
|---|---|---|
| status | PENDING, APPROVED, REVOKED | Only APPROVED users get in. A first sign in creates a PENDING request and signs the user out. |
| appRole | VIEWER, EDITOR | EDITOR = planner, can change all clinic data |
| isManager | boolean | Can approve leave and day off requests (without being an editor) |
| linkedNurseId | nurse id | Ties the account to a nurse profile (her own requests, "Your next two weeks") |

**Plain terms used in the app and in chats**

| Term | Code |
|---|---|
| admin / owner | role OWNER |
| planner / editor | `canEditClinicData()` (OWNER, EDITOR, legacy PLANNER) |
| manager | `isManager` flag; `canApproveRequests()` = editor or manager |
| viewer | role VIEWER |
| nurse | a viewer with `linkedNurseId` |

**Screens per role** (`src/services/auth/access.ts` `canAccessRoute`): editors see every route; everyone else sees dashboard, availability, history, reports, published. The Firestore rules are what actually enforce access; `access.ts` only shapes the UI.

**Known UI gaps.** History's Restore/Delete and Reports' payroll export are visible to viewers (rules block the writes). The Pending Approvals tab shows for `isManager || owner`, while the dashboard counts pending requests for any approver including editors. `staffRequestService.decideRequest` allows only owner or manager.

---

## 4. Navigation and app shell

- No router library. The URL hash is the route: `#dashboard`, `#schedules`, `#availability`, `#nurses`, `#doctors`, `#history`, `#publish`, `#reports`, `#audit`, `#settings`, `#published`, `#me`.
- `App.tsx` order: splash while auth is ready → public pages from the hash (`#me?t=`, `#ack?token=`, `#published?token=` when signed out) → `LoginPage` when signed out → lazy `AppShell`.
- `AppShell.tsx`: loads the clinic profile (`clinics[0]`: name, timezone, weekend days), picks the roster to open (`chooseScheduleToOpen`: last opened, else the one covering today, else latest, skipping ARCHIVED), renders the view, listens for window events `clinic-roster-problems` (top bar problem count), `clinic-roster-cleared`, `clinic-name-updated`.
- Keys: `?` opens shortcuts; Ctrl/Cmd+`\` collapses the sidebar.
- `main.tsx` reloads once when a lazy chunk is missing after a new deploy.
- Every view receives a `ClinicContextState` (clinic name, timezone, active roster, warning count, current user).
- Shared UI: `notify(msg, tone)` toasts and `confirmDialog({...})` (never use `window.alert/confirm`), `useDialogA11y` for every modal (focus trap, Esc closes topmost), `MenuButton` dropdowns, `EmailHtmlPreview` (sandboxed iframe).

---

## 5. Data model (Firestore collections)

All types are in `src/types/index.ts`. Every document stores its own `id`.

| Collection | Type / content |
|---|---|
| clinics | `ClinicProfile`: name, timezone (Asia/Dubai), weekendDays, openTime, closeTime (default 09:00 to 21:00). Only `clinics[0]` is used. |
| dutyWindows | `DutyWindow` (a shift type): name, acronym (≤5), startTime, endTime, color, active, isPriority ("used first"), priorityRank. Usual ones: D (Day), E (Early), L (Late). |
| leaveTypes | `LeaveType`: acronym, creditedHours, countsTowardHoursTarget, color, active |
| seniorityLevels | `SeniorityLevel`: rank, isSenior, color |
| clinicalRoles | `ClinicalRole` (nurse skills / jobs): NC = Nurse Clinic, PHL = blood collection, others with defaultDailyQuota and times |
| specialties | `Specialty`: name, code |
| nurses | `Nurse`: fullName, gmail, employeeCode, seniorityLevelId, contractPercent, dateOfBirth, capabilityIds, isClinicNurse, preferences, preferenceFocus, leaveQuotas (days per year by leave type), active, notes |
| doctors | `Doctor`: fullName, gmail, specialtyIds, weeklyPattern (weekday, start, end, room), active |
| doctorSessions | `DoctorSession`: doctorId, date, start, end, specialtyId, room, source PATTERN or MANUAL, cancelled |
| schedules | `Schedule` (a roster): name, startDate, endDate, blockWeeks, hoursTargetFullTime, periodName, status DRAFT/PUBLISHED/ARCHIVED, activeVersionNumber |
| assignments | `Assignment` (one filled cell): scheduleId, nurseId, date, dutyWindowId, kind DOCTOR/SPECIALTY/CLINICAL_ROLE, doctorId/specialtyId/clinicalRoleId, locked, source GENERATED/MANUAL/LOCK, note |
| locks | `LockEntry` (pinned day): mode ASSIGNMENT (pinned shift) or OFF (day off), dutyWindowId, assignmentKind, targetRefId. Approved day off requests create `lock-off-{nurseId}-{date}`. |
| leaveEntries | `LeaveEntry`: nurseId, leaveTypeId, startDate, endDate, approved, status PENDING/APPROVED/REJECTED, hoursCredited, dayHours (per day overrides) |
| availabilityRequests | `AvailabilityRequest`: date, available (false = day off), preferredDutyWindowId, status, review fields |
| rules | `Rule`: templateKey, value, severity HARD/SOFT, enabled, params (see section 7) |
| holidays | `PublicHoliday`: date, name, hijriNote |
| workingHoursPeriods | `WorkingHoursPeriod`: name, startDate, endDate, workingHours (full time target) |
| versions | `ScheduleVersion`: number, snapshot {schedule, assignments, leaveEntries, locks, rulesSnapshot}, isPublished, publishedAt, kind 'BACKUP' for automatic backups (number 0, newest 5 kept) |
| shareLinks | `ShareLink`: token `sh_{uuid}`, public, allowedEmails, revoked, pointsToVersionId |
| publicRosters | `{token}`: a cleaned snapshot readable without signing in (`PublicRosterDoc`, format 2). Not listable. |
| nurseLinks | `{nurseId}`: private token `nr_{uuid}`. Editors only. |
| nurseRosters | `{token}`: a nurse's own published shifts and leave days (`NurseRosterDoc`). Readable by token. Not listable. |
| acknowledgments | Read receipts; doc id = the emailed token `ack-{uuid}`; ackAt set once |
| emailLog | `PublishLog`: kind PUBLISH/CHANGE/TEST/REMINDER, recipients with status |
| audit | `AuditEvent`: actor, action (CREATE, UPDATE, DELETE, RESTORE, LOCK, OVERRIDE_LOCK, PUBLISH, SWAP, TEMPLATE_APPLY, REBALANCE), before/after |
| userAccess | Access records (section 3) |
| systemMetadata | `initialization_state`, `email_settings` (emailMockMode, emailSenderName) |
| presence | `{uid}_{tabId}` heartbeats (who is on which roster) |
| quotas, templates, swaps, invitations | As typed |

---

## 6. Clinic model (the business rules in plain English)

From `src/services/engine/clinicModel.ts`:

- The clinic is open every day, 09:00 to 21:00 by default (from the clinic profile).
- Each doctor works one session a day and gets **one nurse** whose shift overlaps the session (full cover preferred, partial accepted; a second nurse can fill the gap).
- Every opening hour needs a **free nurse**: not with a doctor at that hour and qualified for blood collection. The free nurse job is called **Nurse Clinic (NC)**. `canBeFreeNurse` needs the NC capability (if an NC role exists) and the PHL capability (if a PHL role exists).
- At least **one senior nurse** works each day.
- On a **public holiday** doctor sessions are ignored and one nurse covers the opening hours.
- The previous roster's last 31 days count for the look back rules (days in a row, rest, late runs).
- **Exclusive Nurse Clinic nurse** (`isExclusiveNurseClinic`): not a clinic nurse, no doctor or specialty preferences, only the NC capability. Never goes to a doctor or specialty. NursesView strips doctor/specialty preferences from such a nurse on save.
- **Strict allocation (H8)**: a nurse with any doctor or specialty in her list works only with those doctors or with doctors of those specialties. A nurse with none works with anyone.

**Nurse preferences.** One ordered list mixing doctors and specialties (`preferences: {kind, refId, rank}[]`, rank 1 = first choice). `preferenceFocus` per nurse: LIST (follow the list, default), DOCTOR (all named doctors first), SPECIALTY (all specialties first). Applied by `applyPreferenceFocus` in `preferenceOrder.ts`, which reorders doctor/specialty ranks reusing the same rank numbers (clinical role preferences are not moved). Example: Amy's list is #1 Cardiology, #2 Dr Lee (Ortho). On a day both Dr Lee and Dr Khan (Cardiology) need a nurse, LIST sends Amy to Dr Khan; DOCTOR sends her to Dr Lee. For each doctor, nurses who name that doctor are still asked before nurses who only chose the specialty.

---

## 7. Rules

Lookup: `resolveRule(rules, templateKey, fallbackId, keywords, excludeKeywords)` in `SchedulingEngine.ts` (by templateKey, then id, then name keywords). A missing rule counts as enabled, HARD, default value. `ruleSyncService.syncStandardRules` adds missing canonical rules and removes duplicates.

| id | templateKey | Default | Meaning |
|---|---|---|---|
| rule-h1 | SENIOR_ON_DUTY | 1, HARD | A senior nurse every day |
| rule-h2 | MAX_CONSECUTIVE_DAYS | 6, HARD | Most working days in a row |
| rule-h3 | MIN_REST_HOURS | 11, HARD | Minimum rest between shifts (0 = off) |
| rule-h4 | MAX_DUTIES_PER_DAY | 1, HARD | One shift a day (always enforced) |
| rule-nurse-clinic | DEDICATED_NURSE_CLINIC | 1, HARD | Free nurse (Nurse Clinic) slots per day |
| rule-nurse-plus-one | MIN_ADDITIONAL_NURSE_OVER_DOCTORS | 1, HARD | A free nurse at every opening hour |
| rule-h7-max-hours | MAX_WORKING_HOURS_PER_PERIOD | 105 (%), HARD | Hours ceiling over the goal |
| rule-h8-strict-allocation | STRICT_PROFILE_ALLOCATION | HARD | Only doctors/specialties in the nurse's list (always enforced) |
| rule-s1 | MAX_CONSECUTIVE_LATE_DUTIES | 3, HARD, threshold 21:00 | Late shifts in a row. A shift is late when it ends at or after the threshold (`isLateDuty`). |

H5 = approved leave and day off locks (always). H6 = PHL shifts need the PHL skill (hard coded, no rule entry).

---

## 8. The roster engine (`src/services/engine/SchedulingEngine.ts`)

### Entry points

```ts
SchedulingEngine.computePreflight(...)   // summary shown in the fill dialog
SchedulingEngine.generate(
  schedule, mode, existingAssignments, nurses, seniorityLevels, dutyWindows,
  roles, specialties, sessions, locks, leaveEntries, rules,
  onProgress?, workingHoursPeriods?, doctors = [], leaveTypes = [],
  clinicSetup?: ClinicSetup,            // opening hours, holidays, prior roster, year to date, requests
  options: { keepManual?: boolean; onlyDates?: { start; end } } = {}
): Promise<GenerationResult>
```

Modes (`engine/types.ts`): GENERATE_ALL (rebuild; keeps hand edits when `keepManual`, default true), EMPTY_ONLY (fill empty cells), REBALANCE, CLEAR_GENERATED (remove generated shifts). Locks are rebuilt from LockEntries each run. `onlyDates` fills only a date range.

`GenerationResult`: assignments, createdCount, preservedLocksCount, preservedManualCount, unmetSlotsCount, doctorSessionsTotal, doctorPriority1/2/3Plus/Specialty/Fallback pairing counts, effectiveFullTimeTarget, periodName, requestsMet, requestsTotal.

### How a run works

1. Nurses go through `applyPreferenceFocus`, then are sorted by name. Day/Late/Early duties found by acronym.
2. Rules are read (NC quota, plus one, H1, H7 tolerance, S1, H2, H3).
3. Locks become LOCK assignments; OFF locks are hard days off.
4. Requests: approved preferred shift +30, pending +15; pending time off −60 (`REQUEST_WEIGHTS`). Rejected requests are ignored.
5. Hours: `contractTarget = round(fullTime × contractPercent/100)`, `dutyTarget = contractTarget − leave hours`, `maxAllowed = max(dutyTarget, min(dutyTarget + 8, round(dutyTarget × tolerance)))`. `hoursBehindPace` drives fairness through the period.
6. `fitsHardRules(nurse, date, duty, hours)`: one shift a day, leave and day off locks, days in a row (HARD), rest (HARD), hours ceiling (HARD), late run (HARD).
7. Day needs and **spare hours**: hours that later days will need are kept back (with a 10% margin); only the surplus may go on extra shifts, shared out by how busy each day is. Separate budgets for blood collection nurses and seniors.
8. **First choice reservation**: for each nurse, hours are kept for later sessions of her rank 1 doctor or rank 1 specialty.
9. **Each day:**
   - Public holiday: one nurse covers opening hours (Nurse Clinic role), fairness by holidays worked.
   - Slots by priority: Nurse Clinic 140, doctor ending at or after 19:00 130, doctor with a rank 1 nurse 125, other doctors 120, other roles 90.
   - **Doctor slot queue**: nurses who name the doctor (by rank, ranks 1, 2, 3+), then nurses whose specialty matches one of the doctor's specialties (rank 1, then others), then everyone else. `pairingRank(nurse, doctorId, session)` = her best rank for that doctor by name or by specialty.
   - Passes, first hit wins: within goal before over goal; "leave her for a doctor she ranks higher today" before ignoring that; nurses not needed for blood collection first when blood collection hours are short; full cover shifts before partial.
   - Score terms (higher wins): full cover +40; wasted hours −6/h; near days in a row limit −60; Nurse Clinic: exclusive NC +200, −25 per NC shift so far, NC preference +40/+20, kept for doctors who rank her −(40…160); doctor: named rank 1 +80, 2 +40, else +20; specialty rank 1 +70, 2 +35, else +15; −50 per other first choice doctor today; behind pace +1.5/h; over goal −(300 + 20/h); at target −150; weekend −25 per weekend worked; late shifts above average −15 each; request score; late run near limit −50/−150; senior +10; priority duty +30.
   - Free nurse each hour (plus one rule): stretch an existing shift, else add a nurse.
   - Senior each day (H1): add an extra senior, else swap a senior into a junior's generated shift, else add anyway.
   - Second nurse for a partly covered doctor (from spare hours).
   - Float shifts from spare hours for nurses behind pace (her top specialty, else general pool `role-float`).
10. Requests met are tallied.

Ties rotate between nurses by an FNV hash of date and nurse id, so the result is deterministic.

### Other engine files

- `assignmentChecks.ts` `checkAssignment(ctx, cell)`: hard rule reasons for hand moves, swaps and explanations (H8 and H7 not checked here).
- `explainCell.ts`: `explainNurseDay` (why a nurse is off, which shifts she could take, hours after) and `explainDay` (who could cover a day). Used by the grid popup and "Who could cover?".
- `clinicSetupService.ts` `loadClinicSetup(repo, schedule, { withYearToDate })`: opening hours, holidays, previous roster's last 31 days, year to date totals, requests.
- `leaveStatus.ts` `isPendingLeave`.

---

## 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`)

`ScheduleValidator.validate(schedule, assignments, nurses, seniorityLevels, dutyWindows, sessions, leaveEntries, locks, roles, rules, workingHoursPeriods, specialties, doctors, leaveTypes, clinicSetup, availabilityRequests)` returns `{errorCount, warnCount, infoCount, findings, hourlyCoverageMap}`. Each finding: `{id, category, severity ERROR/WARN/INFO, message, affectedNurseIds, cellRefs, date?, hour?}`. In the UI ERROR = "Must fix", WARN = "Check", INFO = "Note".

Finding id prefixes: `scale-ratio-warning`, `holiday-gap-`, `holiday-no-nurse-`, `holiday-senior-`, `cov-gap-` (no free nurse for some hours), `evening-tail-`, `nc-coverage-`, `nc-not-qualified-`, `nc-doctor-conflict-`, `exclusive-nc-doctor-conflict-`, `role-quota-`, `h1-senior-`, `session-partial-`, `session-no-overlap-`, `unassigned-session-`, `missing-gmail-`, `h4-dup-`, `dayoff-lock-`, `leave-overlap-`, `pending-leave-shift-`, `request-dayoff-shift-`, `request-shift-`, `h6-phl-capability-`, `h8-doctor-allocation-`, `h8-specialty-allocation-`, `s1-late-`, `h2-days-`, `h3-rest-`, `hours-low-` (below 75%), `h7-hours-over-`, `hours-over-`.

Whole day problems (marked on the date heading in the grid): `cov-gap-`, `h1-senior-`, `evening-tail-`, `holiday-`, `nc-coverage-`, `role-quota-`, `session-partial-`, `unassigned-session-` (`DAY_PROBLEM_IDS` in `WorkbookGrid.tsx`).

---

## 10. Hours

- **Full time target** (`hoursPolicy.resolveFullTimeTarget`): a working hours period covering the roster (prorated per day if partial), else `schedule.hoursTargetFullTime`, else 40 hours a week prorated.
- **Working hours periods**: clinic cycles from the 19th to the 18th, e.g. Dec 19 to Jan 18 = 210 h. Seeded for 2025–26 by "Load 2025–2026 Baseline".
- **Leave credit per day**: 0 when the leave type does not count; else the type's creditedHours; else entry hoursCredited ÷ days; else 8. `dayHours[date]` overrides one day. Only approved leave counts.
- **One counting rule** everywhere (`hoursAccounting.summarizeNurseHours`): a leave day counts its leave, not a shift on it; one shift per day; target = full time × contract share.
- Report status bands: under 75% critical, under 90% under, over 110% over, over 120% critical.

**Fairness across the year** (`fairness/yearToDate.ts`, `yearSeed.ts`): earlier published rosters this year give each nurse counts of weekends, holidays, late shifts and Nurse Clinic shifts. These become small head start seeds (capped at ±3) so the engine evens things out over the year.

---

## 11. Saving, live updates, versions

- **Repository**: `getRepository()` → `FirestoreRepository` (only mode). Methods: list (with `==`/`!=` filter), get, create, update (merge), remove, bulkUpsert (chunks of 450, `replace` option), bulkRemove, clearCollection, subscribe. Writes check `quotaTracker` first (Firestore daily quota; resets midnight Pacific; a banner shows when exceeded). A failed read throws instead of returning `[]`.
- **Live cache** (`liveCollectionCache.ts`): the first unfiltered list starts an `onSnapshot` listener; later reads come from memory. audit and emailLog are never cached. Idle listeners stop after 5 minutes.
- **Save queue** (`collectionSyncer.ts` `CollectionSyncer`): the roster editor saves only what changed (assignments, locks, leave), one save at a time, retries every 30 s, never deletes records it did not know about. There is no Save button; the toolbar shows "Saving…", "All changes saved ✓" or an error with "Retry now".
- **Edits** all go through `applyEdit` in `SchedulesView.tsx`: one undo step (up to 50; Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z), persist, validate after 300 ms.
- **Live updates**: assignments of the open roster are subscribed; other people's changes are merged once local saves are idle ("Updated with a change made by someone else"). Presence shows "X is also here".
- **Backups**: before every fill or clear a `BACKUP` version is saved (newest 5 kept). Restore brings back shifts only and can be undone.
- **Named copies** ("Keep a copy…"): versions with the next number. History can restore a version (uses the older `syncScheduleAssignments`, which replaces all shifts of the roster).
- **Diff** (`history/diffEngine.ts` `computeScheduleDiff`): ADDED/REMOVED/MODIFIED by `nurseId|date`. Pin only changes are not emailed.

---

## 12. Publishing and nurse links

`PublishModal.tsx` steps: VALIDATION (blocked while any "must fix") → DETAILS (whole roster or changes only, recipients, note, include link) → PREVIEW → SENDING → DONE.

1. Saves one published version per run (retries reuse it), sets the roster PUBLISHED.
2. Points all share links at the new version and rebuilds their public snapshots (`publicRosterService.syncPublicRoster`).
3. Makes sure every nurse on the roster has a private link (`nurseRosterService.ensureNurseLink`) and rewrites their private pages (`syncNurseRosters`; covers rosters ending in the last 31 days, published versions only).
4. Writes an emailLog entry before sending, then emails each nurse (`RosterPublishService.generatePersonalEmailHtml` + `dispatchEmail` → `POST /api/email/test`), creating `acknowledgments/{ackToken}` per email. All user text goes through `escapeHtml`, colours through `safeColor`.
5. Final status SENT, PARTIAL, MOCK_SENT or FAILED; "Retry failed" re-sends only failures; audit PUBLISH.

**Mock mode** is the default (`systemMetadata/email_settings.emailMockMode`, and `DEFAULT_EMAIL_SETTINGS`); real email needs it switched off in Settings → Email plus the SMTP env vars on the server.

Reminders (PublishView) re-use the original ack token. Private links: `/#me?t=nr_…`, calendar `/calendar/nr_….ics` (also `webcal://`), refreshed every 4 hours by calendar apps. Links can be regenerated or revoked (also revoked when a nurse is made inactive or deleted).

---

## 13. Screens in detail

**Dashboard** (`DashboardView.tsx`): planner path loads the current roster, runs the validator, announces the problem count to the top bar (`announceProblems`), and shows "Today at the clinic", "Current roster" (shifts, must fix, to check, version, published state) and "Needs your attention" (problems, unsent changes, unpublished roster, next roster needed within 21 days, pending requests, unconfirmed receipts, nurses with no email). Viewer path uses published versions only. Helpers in `dashboard/dashboardSummary.ts`.

**Schedules** (`SchedulesView.tsx`, the core screen):
- Toolbar: roster picker, dates, Draft/Published chip, period chip, Undo/Redo, **Fill roster ▾** (whole / empty cells only / clear), **Publish ▾** (publish / send changes only), **More** (new roster, keep a copy, backups, compare, export or print, share links, fairness, templates and copy last roster, swap, full screen).
- Step bar: Create → Fill → Fix problems (N) → Publish / Send changes (N).
- Fill dialog: preflight summary, keep hand changes (default on), only fill some dates, the Nurse Clinic rule switch (Never broken / When possible / Off), progress bar. Saves a backup first; opens the Problems panel if there are errors.
- Sheet tabs: Roster (grid), Doctors, Coverage by hour, Problems, Leave and pinned days, Hours, Key.
- Problems panel: sorted by severity; "Show in grid" jumps and flashes the cell (whole day problems go to that day's column); "Who could cover?" for missing free nurse problems with "Add" buttons.

**Roster grid** (`WorkbookGrid.tsx`):
- Toolbar: previous/next block, show all days, group by seniority, **Problem marks** switch ("Problem marks (N on these days)": red corner on cells, badge on date headers, mark by nurse names), zoom, legend.
- Cells show request marks (round = day off, square = shift; hollow = pending; amber = not followed), pending leave marks, leave.
- Keys: click = quick popup, Space = popup with focus, Enter/double click = full editor, arrows/Tab move, Delete clears (confirms for pins/leave), Ctrl+C/V copy/paste, right click menu.
- Quick popup (`QuickCellPopup.tsx`): wishes, why off / free to work, problems, unpin, work options ranked by the nurse's own order (her doctors and departments as ranked by her list and her "which comes first" setting, tags "Usual" and "Usual department"), leave options, clear, more.
- Full editor: shift or leave/day off, shift, kind (doctor/specialty/role), warnings when outside her list or Exclusive NC, leave hours override, "Keep this when the roster is filled again" (pin), note.

**Nurses** (`NursesView.tsx`): list with filters and badges (Exclusive NC, PHL, top preferences). Profile: identity (gmail required, unique), seniority, contract %, Clinic Nurse checkbox, capabilities, ordered doctor/specialty list (drag or Move up/down), "When her doctors and her specialties need a nurse on the same day" radios (shown when both kinds are present), annual leave quotas in days, active, notes. Bulk CSV import.

**Doctors** (`DoctorsView.tsx`): directory, specialties, weekly pattern editor, expand pattern into sessions over a date range, ad hoc sessions, cancel/restore. In the roster: `DoctorsScheduleSheet` changes one day or a weekday every week (`doctorScheduleService.saveDoctorShift` / `deleteDoctorShift`).

**Availability** (`AvailabilityView.tsx`): 31 day master grid (editors), drag to record leave, quota badges, pin shift locks, public holidays as PH, leave CSV import; "My Availability & Leave Requests" (`NurseSelfServicePanel`); "Pending Approvals" (`ApprovalsQueuePanel`, `staffRequestService.decideRequest`; approving a day off creates an OFF lock).

**Settings** (`SettingsView.tsx` + `settings/*`): Clinic profile, Public holidays, Time periods; Rules (plain sentences, on/off, "Must"/"Try to"), Shifts; Leave types, Seniority, Nurse skills (NC and PHL built in), Specialties; Access & permissions (owner only), Email (mock mode, sender name, test send, log), Database & backup (owner only: counts, download backup, restore, delete all data with CLEAR typed).

**Publish, History, Reports, Audit**: see sections 11 and 12; Reports has Ledger, Equity, Quotas, payroll and timesheet CSV; Audit has filters and a before/after inspector.

**Exports**: PDF (`rosterPdfService`, A4 landscape, nurses and doctors grids), Excel (`rosterExportService`, sheets Roster, Legend, Long, Hours, Doctors), CSV (formula injection safe, `utils/csv.ts`), ICS (`icsExportService`).

---

## 14. Server, security and config

**Endpoints**

| Method | Path | Auth | Limit | Purpose |
|---|---|---|---|---|
| GET | /api/health | public | 60/min | health |
| GET | /api/auth/me, /api/auth/verify | public (reports status) | 60/min | current user and privileges |
| POST | /api/auth/logout | public | 60/min | no op |
| POST | /api/email/test | signed in planner | 300/min | send a test or roster email; recipients must be clinic staff (nurse or doctor gmail) or the sender |
| GET | /calendar/:token.ics | token | 30/min | nurse calendar feed |

The server verifies Firebase ID tokens itself (jose, Google JWKS) and reads `userAccess` with the caller's own token; it has **no service account**. Helmet runs with CSP and frame protections off so the app works inside the AI Studio iframe and Google popups work.

**`firestore.rules` summary**: helpers `signedIn` (verified email), `isOwner`, `isApproved`, `isEditor`, `canApprove`, `myNurseId`. userAccess: own record read, self request create (PENDING, VIEWER, no manager), owner manages. acknowledgments: read by token or own nurse, update `ackAt` once. publicRosters and nurseRosters: get by token when not revoked, never list, editors write. nurseLinks: editors. presence: strict shape, own records. leaveEntries and availabilityRequests: approved users read, approvers write, nurses create/delete their own pending requests. locks: approvers write. emailLog: editors. audit: editors read, approvers create. Everything else: approved users read, editors write.

**Env vars** (server): `GOOGLE_SMTP_USER`, `GOOGLE_APP_PASSWORD` (or `SMTP_USER`, `SMTP_PASS`), optional `SMTP_HOST`, `SMTP_PORT`, `EMAIL_PROVIDER`, `EMAIL_SENDER_NAME`, `FIREBASE_PROJECT_ID`, `FIRESTORE_DATABASE_ID`, `PORT`, `NODE_ENV`, `DISABLE_HMR`. AI Studio injects `GEMINI_API_KEY` and `APP_URL` (Gemini is not used). `.env.example` lists only the AI Studio ones.

**Firebase**: project `gen-lang-client-0671372661`, a **named** Firestore database (`ai-studio-clinicroster-…`), config in `firebase-applet-config.json`.

**Deploy**: push to GitHub `main` → AI Studio syncs and redeploys. Rules: publish by hand in the Firebase console. CI (`.github/workflows/ci.yml`, ignored by AI Studio): type check, unit tests, build, rules tests in the emulator.

---

## 15. Tests

`tests/unit/` (Node test runner, `node --import tsx --test`): assignmentChecks, backupCheck, changeAlerts, clinicModel (main engine + validator scenarios), csv, dashboard, explainCell, generatorRequests, hoursAccounting, hoursPolicy, hoursRules, liveCollectionCache, liveUpdates, newRosterDates, nurseRoster, preferenceFocus, requestFindings, rosterSaving, ruleChecker, rules, schedulingEngine, yearFairness.

`fixtures.ts` helpers: `DAY_DUTY` (09:00 to 17:00), `SENIOR`, `makeNurse(id, overrides)`, `makeSchedule(overrides)` (week of 2026-10-05, 40 h), `ANNUAL_LEAVE`, `UNPAID_LEAVE`, `makeLeave`, `makeLock`, `hoursOnlyRules()` (turns off the Nurse Clinic and plus one rules).

Example engine test call:

```ts
const result = await SchedulingEngine.generate(
  makeSchedule({ startDate: '2026-10-07', endDate: '2026-10-07', hoursTargetFullTime: 8 }),
  'GENERATE_ALL', [], nurses, [SENIOR], [DAY_DUTY, LATE], [], specialties, sessions,
  [], [], hoursOnlyRules(), undefined, [], doctors, []
);
```

`tests/firestore-rules/rules.test.mjs`: emulator tests for every role and collection.

**Browser checks**: there is no Firebase emulator UI setup in the repo. In earlier sessions an in memory test page was built in the session scratchpad (a copy of the app wired to fake data), copied into a temporary `_preview/` folder, run with `npx vite --port 5179`, and driven with Playwright scripts (Chromium is preinstalled; `NODE_PATH=$(npm root -g)`). Delete `_preview/` before committing. A new session needs to rebuild such a page if it wants browser checks.

---

## 16. History of work (for context)

Completed and on `main`, in order:
1. Security: Firestore rules with role lookup, Google sign in only, server verifies Firebase tokens, locked down endpoints, escaped email HTML, strong tokens, local JSON database removed.
2. P1: self service leave and approvals, public share links and read receipts without sign in, reminders and .ics, Firestore only repository with chunked batches and changed cell sync, role based navigation.
3. P2: one hours calculation, rule settings honoured, engine edge cases, weekend definition, fairness and swap checks, fake features removed.
4. P3: live read cache, code splitting, CSV safety, settings split into tabs, accessibility and in app dialogs, CI.
5. Schedule review plan steps 1 to 5: save only what changed with a save queue, one open roster function, undo covering shifts/pins/leave, generate keeps hand edits; one hours calculation and leave hours per day; honest send status and change alerts; schedule screen toolbar, step bar, Problems panel, grid quick popup; explain empty cells, who could cover, day totals, backups and restore, date range fill, changes since publish, new roster dates; year fairness, nurse requests in the engine, private nurse links and calendar feed, live updates and presence.
6. Dashboard rewrite (planner and viewer paths) and review fixes.
7. Grid problem marks fix (day badges, nurse badges, switch).
8. Doctor vs specialty preferences: shared ranked list fixes in the engine and the per nurse "which comes first" setting (commit `9c0b819`).

---

## 17. Known quirks and ideas for later

- A nurse with no `contractPercent` gives NaN in the engine and validator (reports treat it as 100%).
- SOFT rules in the engine: H2 SOFT is only a −60 score; H3 SOFT is not checked; S1 SOFT gives −150/−50; H7 SOFT removes the ceiling (over goal penalties still apply). The validator reports SOFT breaks as "Check".
- `dayNeedHours` and the first choice reservation use the raw sessions list, not `doctorSessionsOn`.
- The hours report counts late shifts at a fixed 21:00, while the engine uses the rule threshold.
- Version restore in History uses `syncScheduleAssignments` (replaces all shifts, can remove other people's new shifts) and does not restore locks or leave.
- Shortcuts modal misses Space and undo/redo keys. TopBar acceptance button is dead. `WalkthroughModal` returns null.
- `.env.example` lacks the SMTP variables; `cors` dependency unused; PLANNER and STAFF roles unused; `metadata.json` mentions Gemini; `firebase-blueprint.json` is out of date; package name is still `react-example`.
- Single clinic assumed (`clinics[0]`); `publicRosters` has no TypeScript collection mapping.
- `Doctors` "Expand pattern" default dates are hard coded to October 2026.
