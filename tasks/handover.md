# Handover for a new chat

Written 14-11-2026, at the completion of the ten phase UI overhaul (Phases 0 to 9, guide items 42 to 112).
Start a new chat by reading this file, then `CLAUDE.md` and `PROJECT_GUIDE.md`.

## 1. Where things stand

| | |
|---|---|
| Package and app name | `nsc-clinic-roster` / **NSC Clinic Roster** |
| Working branch | `claude/ui-overhaul` (main fast forwards to it on the owner's word) |
| UI overhaul status | All ten phases (0 to 9) and all checklist items in `tasks/todo.md` are done |
| Unit tests | 533 passing (`npm test`), plus 98 Firestore rules checks in the emulator |
| Static checks | `npx tsc --noEmit` (`noUnusedLocals` on) and `npx eslint . --max-warnings 0` (0 warnings) |
| Browser checks | All 32 scripts in `.claude/skills/browser-check/scripts/` pass; `ui-audit.cjs` has 0 serious or critical axe problems, 0 text under 12 px, 0 small targets and 0 sideways scroll across all screens |
| Firestore rules | Not changed by the overhaul, so there is nothing to publish by hand |
| HawkScan | Never run: the session has no `HAWK_API_KEY`. The owner knows |

The plan and final audit numbers are in `tasks/plan.md`, the completed checklist in `tasks/todo.md`,
the full overhaul summary in `tasks/summary.md`, and the detailed record of every slice in
`PROJECT_GUIDE.md`, section 16 (items 42 to 112) and section 13 (*Screens in detail*).

## 2. How the owner likes to work

* Chat replies in the caveman voice (`.claude/skills/caveman/SKILL.md`), until the owner says
  "stop caveman" or "normal mode". Questions to the owner, their options, security warnings and
  steps before something that cannot be undone stay in full sentences.
* Everything kept outside the chat (the guide, `tasks/`, commits, code comments, words on screen,
  GitHub posts) is plain English with no hyphens or dashes in prose, "they" for people, and dates
  as DD-MM-YYYY.
* Use the `ui-ux-pro-max` skill for screen work.
* Work in small slices. Inspect before fixing. Write a test that fails without the change for any
  logic change. Ask before pushing to main: main moves only when the owner says "push to main" or
  "push to github".

## 3. Every commit

1. Run the checks: `npx tsc --noEmit`, `npx eslint . --max-warnings 0`, `npm test`,
   `npm run build`, and `node --import tsx tests/integration/emailServer.test.ts` (4 PASS lines).
2. For screen changes, check in the browser: `bash .claude/skills/browser-check/scripts/start.sh prod`
   serves the test page at `http://localhost:5180` (`?view=app&as=owner#...`, `?view=app&as=nurse#...`,
   `?view=app&as=none`, `?view=me`, `?view=published`, `?view=ack`, `?seed=big`;
   `window.__repo.col(name)` is a Map of what was saved). Run the scripts in
   `.claude/skills/browser-check/scripts/` with `node <script> --base http://localhost:5180`
   (pass `NODE_PATH` pointing to global `playwright`), and run `stop.sh` and remove `_preview/`
   before committing.
3. When repository or server code changes, run the `firestore-rules-reviewer` agent (it runs the
   emulator tests). Have new words checked by the `plain-english-reviewer` agent.
4. Update `PROJECT_GUIDE.md`: the sections touched, the test count (section 0 table and
   section 15), a new item at the end of section 16, and the "Last updated" line (say whether
   the work is on main).
5. `graphify update .`, then `git checkout -- .claude/skills/ui-ux-pro-max/scripts/__pycache__/`.
   Never commit a `package-lock.json` (the rules tests leave one in `tests/firestore-rules/`).
6. Stage, then commit as a separate command chained with `&&`, so a failed edit stops the commit.
   End with the attribution lines given by the session, and no model name in the message.
7. Push the working branch; push to `main` only when the owner approves.

**Pushing to main** (only on the owner's word): check `git merge-base --is-ancestor origin/main HEAD`;
in the guide, record the owner's approval and update the Last updated line; push the branch, then
`git push origin HEAD:main`; after about 100 seconds check the CI run on main.

## 4. What the UI overhaul did (Phases 0 to 9, guide items 42 to 112)

* **Phase 0 and Phase 1 (items 42 to 44):** installed `ui-ux-pro-max`, set up the production browser
  test harness (`ui-audit.cjs`, `grid-timing.cjs`), put `/api/gemini/*` behind sign in, fixed
  October 2026 date defaults, made the sidebar a slide in menu below 1024 px, aligned screen
  actions with `firestore.rules` (`permissionsFor`, `usePermissions`), capped `emailLog` size under
  Firestore's 1 MiB limit, and removed unused Arabic text.
* **Phase 2 (items 45 and 46):** created the approved design system (`design-system/nsc-clinic-roster/MASTER.md`:
  calm teal `#0E7490`, Inter, 12 px minimum text, `colorContrast.ts`), built the shared UI kit in
  `src/components/ui/`, unified dates in `src/utils/dateUtils.ts` and corner messages in `notify()`,
  rebuilt `AppShell`, `Sidebar` and `TopBar`, added deep links and Back support (`address.ts`), and
  replaced window events with `AppContext`.
* **Phase 3 (items 48 to 58):** sped up and split `SchedulesView.tsx` and `WorkbookGrid.tsx`
  (memoized `GridCell` and `GridRow`, external selection store in `gridSelection.ts`, saving only
  changed lists, single queued validation in `checkScheduler.ts`, keeping the grid mounted across
  sheets).
* **Phase 4 (items 59 to 67):** unified problem counts (`ProblemCounts`), moved sheet tabs above the
  roster with one `Key` drawer and one `Full screen` button, regrouped the toolbar on one line from
  1024 px, redesigned cells (doctor first name and rank, start and end times, problem icons, spoken
  names, rows mounted in steps of 20), and added the read only phone day view (`RosterDayView.tsx`
  under 700 px wide or 500 px high).
* **Phase 5 (items 68 to 74):** rebuilt nurse screens for phones first (`MyRosterView`,
  `NurseSelfServicePanel`, `AcknowledgePage`, `PublishedRosterView`, `PublishedRosterSheet` and the
  nurse dashboard), and added request decision emails (`POST /api/requests/:id/notify`, guarded by
  `decisionEmailedFor` on the request so server restarts never send twice).
* **Phase 6 (items 75 to 82):** rebuilt `NursesView` and `DoctorsView` on `DataTable` and `Dialog`
  with field checks, split Availability into `Leave and days off` (`AvailabilityView`, keyboard and
  click range picking without dragging) and `Requests` (`RequestsView`), and enforced the owner's
  leave allowance rules (days as typed; blank or 0 means 0 days).
* **Phase 7 (items 83 to 93):** moved roster, request, doctor and settings dialogs onto the shared
  `Dialog`, tidied `HistoryView`, unified publishing into `PublishModal` (removing the unused
  Invitations tab from Share links), turned `#publish` into `Sent rosters` (`PublishView`) with
  email log paging (`listPage`, 25 at a time), and added resuming a stopped publish (`ResumePublish`
  with single sender `claim` protection).
* **Phase 8 (items 94 to 104):** rebuilt `SettingsView` into five link groups with `Save` and
  `Cancel` drafts on Clinic, Rules and Email (`leaveGuard.ts`, `ruleDraft.ts`), fixed Time periods
  defaults (`nextPeriod.ts`), switched Data and backup counts to Firestore `countOf`, rebuilt
  `ReportsView` in plain words with 10 px bars, paged `AuditTrailView` 100 at a time, and moved
  `AuthModal` (*Your access*) onto `Dialog`.
* **Phase 9 (items 105 to 112):** removed unused packages and dead code, turned on `noUnusedLocals`,
  fixed dev and CI server port resolution across all four modes (`dev`, `start`, `vite`, `preview`),
  renamed the package to `nsc-clinic-roster` with plain English metadata and `NSC Clinic Roster`
  branding across emails and calendar feeds, added `<h1 className="sr-only">Rosters</h1>` and 12 px
  minimum text on the Roster screen, added ESLint (`react-hooks` and `jsx-a11y`) with
  `--max-warnings 0` in CI, rebuilt `LoginPage` on `PublicPageFrame`, fixed `DataTable` scroll box
  positioning, ran the final audit (`tasks/plan.md`), and rewrote `PROJECT_GUIDE.md` section 13.

## 5. What comes next

* All phases (0 to 9) of the UI overhaul plan are complete.
* Known quirks and optional ideas for future work live in `PROJECT_GUIDE.md`, section 17, whenever
  the owner chooses to pick one up.

## 6. Points to know

* Request decision emails (`POST /api/requests/:id/notify`) are not written to `emailLog` (only
  editors may write `emailLog`, while managers also decide requests). Once sent, the server marks
  `decisionEmailedFor` on the request using the caller's token, so a restart within the 15 minute
  window never emails the same decision twice.
* `staffRequestService.decideRequest` starts the decision email without waiting for it, so an email
  hiccup never blocks approving or declining a request.
* `ResumePublish` stores a `claim` on `emailLog` and checks it before each email so two tabs or two
  planners do not email the same waiting nurses twice.
* JSON clinic backups (`seedRunner.ts`) still write `app: 'ClinicRoster'` inside the backup file on
  purpose so older backup files keep restoring cleanly; every screen, email and calendar feed uses
  `NSC Clinic Roster`.
