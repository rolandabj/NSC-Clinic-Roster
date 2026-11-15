# UI overhaul: summary and final results

**For a new chat, read `tasks/handover.md` first**, then `CLAUDE.md` and `PROJECT_GUIDE.md`.

As of 14-11-2026, all ten phases (Phases 0 to 9) of the UI overhaul plan are complete. Every box in
`tasks/todo.md` is ticked, the final audit numbers are recorded in `tasks/plan.md`, and every
step is documented in `PROJECT_GUIDE.md`, section 16 (items 42 to 112) and section 13 (*Screens in
detail*).

## 1. Where things stand

| | |
|---|---|
| Done | All ten phases: Phase 0 (setup), Phase 1 (quick fixes and safety), Phase 2 (design system and app frame), Phase 3 (roster grid speed and structure), Phase 4 (roster screen layout, words and accessibility), Phase 5 (nurse screens for phones and request decision emails), Phase 6 (planner screens), Phase 7 (dialogs, publishing, Sent rosters, History and resume publish), Phase 8 (Settings, Reports and Audit trail), and Phase 9 (tidy up, ESLint in CI, final audit and guide section 13) |
| Unit tests | 533 passing (up from 279 when the plan started), plus 98 Firestore rules checks |
| Static checks in CI | `npx tsc --noEmit` (with `noUnusedLocals`), `npx eslint . --max-warnings 0` (`react-hooks` and `jsx-a11y`), `npm test`, `npm run build` and all 4 email server modes |
| Browser checks | All 32 scripts in `.claude/skills/browser-check/scripts/` pass with 0 failures |
| Firestore rules | Not changed by the overhaul, so there is nothing to publish by hand |
| Next | Overhaul complete; optional ideas for later are in `PROJECT_GUIDE.md`, section 17 |

## 2. Why this work

On 07-10-2026 the owner asked for a review of the whole UI against standard practice, then an
overhaul of the whole app in phases, with backend changes where needed. The work used the
`ui-ux-pro-max` design skill, installed in Phase 0.

**The owner's decisions (07-10-2026 and during the phases):**

* A fresh look, shown first on one sample page and approved on 07-10-2026 with the Inter font.
* Planners edit the roster on a laptop or tablet (held upright or sideways). On a phone (under
  700 px wide or under 500 px high), planners get a read only day view (`RosterDayView`). Nurse
  screens are designed for phones first.
* Three backend changes: emailing a nurse when their request is decided, resuming a publish that
  stopped partway, and paging for the audit trail and the email log (plus Firestore count queries
  for Data and backup). Sending email from the server on its own was declined because it needs a
  service account.
* Leave allowances are in days as typed, and an empty box or `0` means 0 days allowed.
* Share links dropped its unused Invitations tab and points to Settings, Access and permissions.
* English only (unused Arabic text removed), plain words with no hyphens or dashes in prose, "they"
  for people, dates as DD-MM-YYYY, and zero ESLint warnings enforced in CI.
* The Gemini routes require any signed in user.

## 3. What the review found, and where each part stands now

The initial review inspected seven screens at laptop and phone widths with axe, timed the roster
grid on a full size clinic (60 nurses, 12 doctors, 31 days), and audited design consistency,
navigation, permissions, data flow and the server.

| Area | What was wrong at baseline | Final state after Phase 9 |
|---|---|---|
| Design | No tokens or shared parts; 786 text sizes between 7 and 11 px; 261 faint grey labels; 12 hand made tab bars; 15 separate toast copies | Done: `MASTER.md` tokens in `src/index.css`, shared UI kit in `src/components/ui/`, `readableTextOn` and `tint`, `notify()` everywhere, 0 text under 12 px on any screen |
| Accessibility | Up to 99 serious axe problems on a screen; cell names missed visible text; nested 17 px buttons in History; signals shown by colour alone | Done: 0 serious or critical axe problems across all 75 page and width checks, 0 moderate or minor axe problems on all `view=app` and public pages, 1 `<h1>` and 1 `<main>` everywhere, 0 targets under 24 px |
| Words | Generated jargon ("Schedule Version History Center", "Master Administrator Access & Roles Console"), five names for versions, mixed terms, hyphens and "she/her" | Done: plain English across every screen, dialog, email, `README.md`, `index.html` and `PROJECT_GUIDE.md` section 13, using one set of terms and "they" |
| Dates | About ten formats, some in US style | Done: `src/utils/dateUtils.ts` and `DateInput` format and parse `DD-MM-YYYY` consistently across all screens and dialogs |
| Phones | Fixed sidebar left 166 px of a 390 px phone; touch targets 15 to 30 px; wide tables cut off | Done: slide in menu below 1024 px, full 390 px width used with 0 sideways scroll, `DataTable` renders cards on phones, read only roster day view on phones, 16 px phone first nurse screens |
| Grid speed | Every key press redrew all 1,860 cells; 4 validation runs on load; 12,300 DOM nodes | Done: memoized `GridCell` and `GridRow`, external selection store, queued single validation, rows mounted in steps of 20, 9,473 DOM nodes (down 2,827 from baseline) |
| Roster layout | Four different problem counts, sheet tabs below the grid, two keys, Full screen twice | Done: `ProblemCounts` everywhere, `RosterSheetTabs` above the sheet with `Full screen` once, one `Key` drawer, one line toolbar from 1024 px |
| Navigation | Back did nothing inside a screen; no deep links; three screens started in October 2026 | Done: deep links and Back across rosters, sheets, days, nurses, Requests, Reports and Settings tabs; sensible date defaults from today; per screen tab titles |
| Permissions | Refused buttons shown in History; viewer CSV exports open; Pending Approvals hidden from planners | Done: `permissionsFor` and `usePermissions` match `firestore.rules` across every screen and dialog |
| Backend | Stopped publish stuck on "SENDING"; `emailLog` could hit 1 MiB; no request decision emails; full collection reads for audit, email log and counts | Done: `emailLogSize` guard, `POST /api/requests/:id/notify` with `decisionEmailedFor`, `ResumePublish` with `claim`, `listPage` on Sent rosters (25) and Audit trail (100), `countOf` on Data and backup |
| Code | `SchedulesView` and `WorkbookGrid` ~3,000 lines each; window events; unused packages and dead code; no ESLint | Done: split into `src/components/roster/` and `src/components/workbook/grid/`, `AppContext`, unused packages and 102 unused names removed, `noUnusedLocals` on, ESLint with `--max-warnings 0` in CI |

## 4. What each phase did

### Phase 0: setup (07-10-2026, guide item 42)
* Installed `ui-ux-pro-max`, fixed `.claude/hooks/session-start.sh` to run via `bash`, expanded the
  browser test harness (`?seed=big`, `?as=`, `?view=app`, public views, prod build) with
  `ui-audit.cjs` and `grid-timing.cjs`, and recorded baseline numbers in `tasks/plan.md`.
* Put `/api/gemini/*` behind sign in (item 43).

### Phase 1: quick fixes and safety (07-10-2026, guide item 44)
* Fixed October 2026 date defaults (`dateDefaults.ts`), turned the sidebar into a slide in menu
  below 1024 px, aligned UI permissions with `firestore.rules` (`permissionsFor`), guarded
  `emailLog` against Firestore's 1 MiB limit (`emailLogSize.ts`), added `beforeunload` protection
  while sending emails, and removed unused Arabic text.

### Phase 2: design system and app frame (07-10-2026 to 08-10-2026, guide items 45 and 46)
* Approved the `MASTER.md` design system (`#0E7490` teal, Inter, 12 px minimum, `colorContrast.ts`),
  built the shared components in `src/components/ui/`, consolidated `dateUtils.ts` and `notify()`,
  rebuilt `AppShell`, `Sidebar` and `TopBar`, added deep links and Back (`address.ts`), and replaced
  window events with `AppContext`.

### Phase 3: roster grid speed and structure (13-10-2026, guide items 48 to 58)
* Built `cellView.ts`, memoized `GridCell` and `GridRow`, moved selection and popup state to
  `gridSelection.ts`, saved only changed lists (`changedLists.ts`, `planSync`), queued validation
  off the typing path (`checkScheduler.ts`), eliminated idle and status redraws, kept the grid
  mounted across sheet switches, and split `SchedulesView` and `WorkbookGrid` into focused modules.

### Phase 4: roster screen layout, words and accessibility (13-10-2026, guide items 59 to 67)
* Unified problem counts (`ProblemCounts`), moved `RosterSheetTabs` above the sheet with one `Key`
  drawer and one `Full screen` button, fitted `RosterToolbar` on one line from 1024 px with four
  named groups in `More`, redesigned cells to show doctor first name and rank plus start and end
  times with spoken names matching visible text, mounted rows in steps of 20 (`useRowsInSteps`), and
  added the read only phone day view (`RosterDayView.tsx`).

### Phase 5: nurse screens for phones and request decision emails (13-10-2026 to 14-10-2026, guide items 68 to 74)
* Rebuilt `MyRosterView` (`#me?t=`), `NurseSelfServicePanel` (*My requests*), `AcknowledgePage`
  (`#ack?token=`), `PublishedRosterView` (`#published?token=`), `PublishedRosterSheet` and the nurse
  dashboard for phones first with 16 px text and 44 to 48 px touch targets.
* Added `POST /api/requests/:id/notify` (`decisionEmail.ts`), controlled by a switch in Settings →
  Email, storing `decisionEmailedFor` on the request so restarts never email a decision twice.

### Phase 6: planner screens (14-10-2026 to 17-10-2026, guide items 75 to 82)
* Rebuilt `NursesView` and `DoctorsView` on `DataTable` and `Dialog` with field by field validation
  (`nurseForm.ts`, `doctorForm.ts`).
* Split Availability into `Leave and days off` (`AvailabilityView`, keyboard and click range picking
  via `leaveGridPick.ts` without requiring drag) and `Requests` (`RequestsView` with `Waiting` and
  `All` tabs).
* Enforced leave allowances strictly in days as typed, treating blank or `0` as 0 days allowed.

### Phase 7: dialogs, publishing, History and resume publish (17-10-2026, guide items 83 to 93)
* Moved Leave, Requests, Doctors, Roster and Settings dialogs onto the shared `Dialog`.
* Rebuilt `HistoryView` with plain version kinds (`Saved copy`, `Automatic backup`, `Published
  version`), single button rows, `Open larger` (`full` dialog size) and `Compare versions`.
* Unified publishing in `PublishModal` (removing the unused Invitations tab from `ShareLinksModal`),
  rebuilt `#publish` as **Sent rosters** (`PublishView`) with `listPage` paging (25 sends at a
  time), and added **Resume sending** (`ResumePublish` and `resumePublish.ts`) with `claim` locking
  so an interrupted publish finishes cleanly without duplicate emails.

### Phase 8: Settings, Reports and Audit trail (17-10-2026 to 03-11-2026, guide items 94 to 104)
* Rebuilt `SettingsView` with five link groups (`#settings?tab=...`), `Save` and `Cancel` draft
  protection on Clinic, Rules and Email (`leaveGuard.ts`, `ruleDraft.ts`, `rebaseDraft`,
  `rebaseRules`), smart next cycle defaults on Time periods (`nextPeriod.ts`), plain English
  Access and permissions (`accessWords.ts`), Firestore `countOf` queries on Data and backup, and
  accessible 36 px actions across all six list tabs.
* Rebuilt `ReportsView` (`reportWords.ts`) with `Goal`, `Worked`, `Leave`, `Difference` and `Share
  of goal`, 10 px Fairness bars and normal case status badges.
* Rebuilt `AuditTrailView` (`auditWords.ts`) loading 100 records at a time via `listPage` and
  `countOf`, with a `What changed` dialog showing only changed fields.
* Moved `AuthModal` (*Your access*) onto the shared `Dialog`.

### Phase 9: tidy up, ESLint in CI, final audit and guide section 13 (03-11-2026 to 14-11-2026, guide items 105 to 112)
* Removed unused packages (`cors`, `@types/cors`, `date-fns`, `dotenv`, `autoprefixer`), deleted
  `WalkthroughModal`, removed 102 unused names and enabled `noUnusedLocals` in `tsconfig.json`.
* Fixed dev and preview port resolution so all four server modes (`dev`, `start`, `vite`, `preview`)
  pass in CI (item 106).
* Renamed `package.json` to `nsc-clinic-roster`, updated `metadata.json`, `index.html` and
  `README.md` in plain English, and aligned calendar and email footers to `NSC Clinic Roster`.
* Added `<h1 className="sr-only">Rosters</h1>` and raised the last sub 12 px badges and labels on
  the Roster screen and sheets to `text-xs` (12 px).
* Added `eslint.config.mjs` (`react-hooks` and `jsx-a11y`) and enforced `npx eslint . --max-warnings 0`
  in `.github/workflows/ci.yml`, fixing findings across 36 files.
* Rebuilt `LoginPage.tsx` on `PublicPageFrame` and added `relative` to `DataTable`'s scroll wrapper,
  bringing all 75 page and width audit checks to zero issues, recorded Final audit numbers in
  `tasks/plan.md`, and rewrote `PROJECT_GUIDE.md` section 13 in plain English.

## 5. Numbers: baseline vs final

**Accessibility and layout (`ui-audit.cjs` across 25 pages at 1366, 1024 and 390 px):**

| Page | Baseline serious axe | Final serious axe | Baseline text under 12 px | Final text under 12 px |
|---|---|---|---|---|
| Dashboard | 0 | 0 | 7 | 0 |
| Roster | 13 | 0 | 214 | 0 |
| Nurses | 4 | 0 | 32 | 0 |
| Doctors | 6 | 0 | 31 | 0 |
| Availability and Requests | 9 | 0 | 43 | 0 |
| History | 28 | 0 | 127 | 0 |
| Sent rosters | not in baseline | 0 | not in baseline | 0 |
| Reports | 13 | 0 | 42 | 0 |
| Audit trail | not in baseline | 0 | not in baseline | 0 |
| Settings | not in baseline | 0 | not in baseline | 0 |
| Nurse's private page | 25 | 0 | 71 | 0 |
| Shared roster page | 99 | 0 | 157 | 0 |
| Sign in and read receipt | 0 | 0 | 1 | 0 |
| Whole app on a 390 px phone | 166 px content width | 390 px content width | | 0 sideways scroll |

Across all 75 page and width checks in the final audit: **0** serious or critical axe problems,
**0** moderate or minor axe problems on all signed in `view=app` and public pages, **0** targets
under 24 px, **0** text under 12 px, **0** sideways scroll, **0** cut off boxes and **0** page
errors.

**Roster grid on the full size clinic (60 nurses by 31 days, production build):**

* Page elements (`dom`): **9,473** at Phase 9 (down by **2,827** from **12,300** at baseline and
  **12,328** at Checkpoint 2).
* Same machine timings at Checkpoint 3 / Checkpoint 4 (7 runs, in the page): first cells **450 to
  464 ms** (target under 1,000 ms), longest loading task **113 ms** after Phase 4's stepped rows
  (down from 274 ms; target under 200 ms), cell popup **46 to 48 ms** (target under 100 ms), arrow
  key **21 to 27 ms** (target under 50 ms), deleting a shift **86 to 96 ms** (target under 100 ms).
  Even on the slower shared cloud CPU in Phase 9, opening the cell popup in the page takes **89 ms**
  (under 100 ms) and arrow keys have **0 ms** blocking task time.

## 6. Next steps and items outside the plan

All ten phases (0 to 9) and every item noticed during the overhaul are finished.

**Left outside the plan by design (see `tasks/plan.md` and `PROJECT_GUIDE.md` section 17):**

* Sending email from the server on its own without a browser tab open (requires a service account,
  which the owner declined; `ResumePublish` handles interrupted sends instead).
* Arabic translation.
* Tightening Firestore read rules for viewers on collections where only the UI hides exports today.
* Making full JSON database restore atomic in a single batch or transaction.
* Optional engine and reporting quirks documented in `PROJECT_GUIDE.md`, section 17.

## 7. Where to find things

| What | Where |
|---|---|
| Handover for starting a new chat | `tasks/handover.md` |
| Full project and screen guide | `PROJECT_GUIDE.md` (section 13 for screens, section 16 items 42 to 112 for overhaul history) |
| The plan, baseline and final audit numbers | `tasks/plan.md` |
| The completed checklist | `tasks/todo.md` |
| The approved design system | `design-system/nsc-clinic-roster/MASTER.md` |
| Colours, typography and focus styles | `src/index.css` |
| Shared UI components | `src/components/ui/` (`?view=gallery` on the test page) |
| ESLint configuration | `eslint.config.mjs` (`npx eslint . --max-warnings 0`) |
| Dates and colour contrast helpers | `src/utils/dateUtils.ts`, `src/utils/colorContrast.ts` |
| Deep links, Back and unsaved draft guard | `src/services/navigation/address.ts`, `src/components/common/leaveGuard.ts` |
| Paging and count helpers | `src/services/repository/paging.ts` |
| Browser check harness and 32 flow scripts | `.claude/skills/browser-check/` |
