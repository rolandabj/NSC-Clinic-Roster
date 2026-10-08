# NSC Clinic Roster: UI review and overhaul in phases

Approved by the owner on 07-10-2026. Progress is ticked off in `tasks/todo.md`; PROJECT_GUIDE.md section 16 records each phase as it is done.

## Context

The owner asked to install the `ui-ux-pro-max` skill, then for a plan that reviews the whole UI against standard practice and overhauls the entire app in phases, with backend changes where needed.

**Owner's decisions (07-10-2026):**
* Fresh look, with one sample page approved before any screen changes.
* Planners edit the roster on a laptop or tablet. On a phone, planners get a read only day view and the problems list. Nurse screens are designed for phones first.
* Three backend changes:
  * emails to nurses when a request is decided;
  * resuming a publish that stopped;
  * paging for the audit trail and the email log.
* English only: the unused Arabic text is removed.

**How the review was done:**
* Seven test page screens at 1366 px and 390 px, with screenshots and an axe accessibility scan.
* A full size clinic on the test page (60 nurses, 12 doctors, 31 days) to time the roster grid.
* Code sweeps of design consistency, the roster screen, permissions, data flow and the server.

## What the review found

1. **No design system.**
   * There are no colour, type or spacing tokens.
   * 786 text sizes are made up between 7 and 11 px, and grey text that is too faint is used 261 times.
   * The monospace font is used 326 times, including on plain words.
   * There are 12 hand made tab bars in 4 styles, and no shared button, table, input or tab component (467 raw buttons).
   * There are 14 local copies of the toast message code and 228 dark mode classes that never apply.
2. **Accessibility (axe, laptop width).**
   * 58 colour contrast failures across 6 screens.
   * The grid cells' spoken names leave out their visible text.
   * History has nested buttons, buttons only 17 px high and scroll areas the keyboard cannot reach.
   * Several signals on the roster are shown by colour only.
3. **Words.**
   * Nurses, Doctors, Availability, History, Publish, Reports, Audit and four Settings tabs still use the original generated jargon, for example "Schedule Version History Center", "Deterministic Invariant" and "Master Administrator Access & Roles Console".
   * One idea goes by five names: version, snapshot, checkpoint, copy and backup.
   * Terms are mixed: roster and schedule, pinned day and lock, shift and duty.
   * 24 lines of visible text use dashes, and some use hyphenated words.
4. **Dates come in about ten formats.**
   * 16-11-2026 and 2026-11-16 (shown raw in 32 places).
   * 10/2/2026 3:45 PM, Oct 2, 2026, and "Fri, Oct 2" (US English is forced in the new roster dialog).
   * `dateFormatter.ts` is an unused duplicate, and date-fns is installed but never used.
5. **Phones.**
   * The sidebar never collapses on a phone, leaving about 166 px of a 390 px screen for content.
   * The top bar does not wrap.
   * The nurse request tables are cut off.
   * Touch targets are 15 to 30 px.
   * Tab bars hide tabs off the edge of the screen.
6. **The roster grid is slow with a full clinic.**
   * Times measured on the development build:
     * 2.2 s until the first cells show;
     * about 200 ms for each arrow key;
     * 700 ms to open the cell popup;
     * 960 ms to delete a shift, of which 744 ms blocks the page.
   * Causes:
     * the whole 1,860 cell grid renders again on every key press, and no cell is memoized;
     * each edit replaces all three lists and fingerprints every record;
     * the checker runs on the main thread, several times while the screen loads;
     * extra renders come from the top bar count, the presence timer and fill progress;
     * the compare dialog works out its differences even while it is closed.
7. **The roster screen's layout.**
   * Four different problem counts:
     * the step bar counts must fix only;
     * the tab counts must fix plus check;
     * the Problems sheet counts everything;
     * the marks count only the days shown.
   * The sheet tabs sit below the grid, and switching tabs resets zoom and selection.
   * Full screen appears twice, and the Legend repeats the Key tab.
   * There is a red count on every date.
8. **Navigation.**
   * The back button does nothing inside a screen.
   * No link can open a given roster, nurse, date or settings tab.
   * The browser tab title never changes, and the app's name is spelt two ways.
   * **Bugs:**
     * Availability always opens on October 2026;
     * the nurse request form defaults to dates from 15 to 20 October 2026;
     * the Doctors defaults are hard coded to October 2026.
9. **Permissions.**
   * History shows Restore, Delete version and Delete roster to viewers and managers, but the rules refuse them.
   * The payroll and timesheet exports in Reports, and the History exports (including the full analysis file), download for viewers.
   * Planners who are not managers cannot see Pending Approvals, although the rules allow it.
   * A viewer's roster button lands silently on the Dashboard.
10. **Backend.**
    * Each email is sent from the browser.
    * If the tab is closed partway through, the email log stays "SENDING", no audit entry is written, and the nurses who were missed cannot be found or sent their email again.
    * The email log stores every recipient's full email in one document, which may pass Firestore's 1 MiB limit at about 40 nurses (an estimate).
    * Nurses are never told when a request is decided, and managers cannot send email today.
    * The audit trail and the email log load in full.
    * Database statistics read every collection just to count it.
11. **Code.**
    * `SchedulesView.tsx` and `WorkbookGrid.tsx` are about 3,000 lines each.
    * There is no shared app state, and each screen loads its own data.
    * There is no ESLint, TypeScript strict mode is off, and several dependencies are unused.

**What to keep:**
* the save queues and live updates;
* `useDialogA11y` on every dialog, and `confirmDialog` and `notify`;
* the Dashboard's plain English;
* the grid's keyboard model;
* the Problems panel's "Show in grid";
* the page landmarks, print styles and lazy exports;
* the server hardening in `server/apiApp.ts`;
* the browser check test page.

## How every phase is done

* **Working branch.** Each phase is built in small slices on the working branch (`incremental-implementation`).
* **Each slice is checked before it is committed:**
  * type check, unit tests (274 today), build and the email server check;
  * the emulator tests when database code changes;
  * a browser check of every screen it changes.
* **Each commit** updates `PROJECT_GUIDE.md` and the code graph (`finish-change`).
* **Reviews:**
  * `plain-english-reviewer` reads all new wording (no hyphens, "they", DD-MM-YYYY, the app's terms);
  * `firestore-rules-reviewer` is used whenever database or access code changes.
* **Logic changes start with a failing test** (`test-driven-development`), using the existing `renderToStaticMarkup` test style for components.
* **The `ui-ux-pro-max` skill** is used throughout:
  * to generate the design system;
  * for its guidelines on UX, data tables, mobile, forms and charts;
  * for its checklist before each delivery.
  * Its command here is `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>` (its examples use a plugin path that does not apply to this repo).
* **Checkpoint.** Every phase ends with screenshots and numbers for the owner. Main moves only on "push to main", and CI is checked after each push.

## Phases

| Phase | What | Size | Backend |
|---|---|---|---|
| 0 | Install the skill, save the plan, make the review repeatable | S | none |
| 1 | Quick fixes and safety | M | email log size |
| 2 | Design system (sample first) and app shell | L | none |
| 3 | Roster grid speed and structure | L | none |
| 4 | Roster screen layout, words and accessibility | L | none |
| 5 | Nurse screens for phones, request decision emails | M | new email route |
| 6 | Nurses, Doctors, Availability and Requests (planner screens) | L | none |
| 7 | Publishing, History and all dialogs, resume a stopped publish | L | publish resume, email log paging |
| 8 | Settings, Reports, Audit | M | audit paging, counts |
| 9 | Tidy up and final audit | M | none |

### Phase 0: setup (right after approval)

1. Install the skill:
   * Run `npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max -a claude-code --copy -y`.
   * Read every file before keeping it (the SKILL.md, the Python scripts and the data).
   * The install records its source in `skills-lock.json`. Add it to the skills table in the guide.
2. Stop the old test page (`.claude/skills/browser-check/scripts/stop.sh`). This removes `_preview/`, which still holds this review's temporary full size data.
3. Save this plan as `tasks/plan.md` and its checklist as `tasks/todo.md`.
4. Make the review repeatable in `.claude/skills/browser-check/`:
   * Data:
     * a `?seed=big` clinic (60 nurses, 12 doctors, 31 days) in `harness/seed.ts`;
     * views for the app shell and the nurse pages (My roster, my requests, the read receipt page, the published roster).
   * Scripts:
     * `scripts/ui-audit.cjs`: screenshots at 1366, 1024 and 390 px plus an axe scan of every view;
     * `scripts/grid-timing.cjs`: the grid timings, run on a production build of the test page as well, because the development build is slower.
   * axe is fetched once into `~/.cache/nsc-browser-check` by the audit script, not added to `package.json`, so the app's install on AI Studio is unchanged (`bun.lock` already differs from `package.json`).
   * Record the baseline numbers in `tasks/plan.md`.
5. PROJECT_GUIDE.md item 42 (item 41 is the Gemini change made on main on 07-10-2026), the graph, commit, and push the working branch.

### Phase 1: quick fixes and safety

* **Dates:** Availability opens on the current month (`AvailabilityView.tsx:85`). The nurse request form defaults to upcoming dates (`NurseSelfServicePanel.tsx:74`). The Doctors defaults follow the roster or today (`DoctorsView.tsx:117`, `:759`).
* **Phones:** below 1024 px the sidebar becomes a drawer opened from a menu button in the top bar, which wraps (`Sidebar.tsx`, `TopBar.tsx`, `AppShell.tsx`).
* **Permissions:**
  * Add one `usePermissions` helper built on `src/services/auth/access.ts`, and add `isManager` and `linkedNurseId` to the context.
  * Hide History's Restore and Delete buttons (`HistoryView.tsx:805`, `:820`, `:956`) and the Reports and History exports from viewers.
  * Show Pending Approvals to planners.
  * Send viewers' roster button and forbidden routes to the Dashboard with the right address.
* **Publishing safety:**
  * The email log keeps each recipient's status, subject and receipt token, but no longer the full email (`rosterPublishService.ts:404`). The preview is rebuilt from the saved version.
  * The page warns before the tab is closed while emails are going out.
  * Unit tests cover both.
* **English only:** remove `src/services/i18n` and use plain English menu labels.
* Correct PROJECT_GUIDE.md section 3 (the payroll export works for viewers).

### Phase 2: design system and app shell

1. **Sample first.**
   * Generate the design system with `ui-ux-pro-max` (`--design-system`, a healthcare staff scheduling dashboard, dense data, calm).
   * Build one sample page on the test page: a dashboard card, part of the grid, a form, a dialog, tabs and a table.
   * Send the owner screenshots, and change nothing else until they approve.
2. **Tokens** in `src/index.css` with Tailwind 4 `@theme`:
   * Colour roles: brand, surface, border, text, muted text (at least 4.5:1), danger, warning, success, info and focus.
   * Roster colours for Must fix, Check and Note.
   * Type: a 12 px minimum and one sans font family, with tabular numbers instead of monospace.
   * Radius, shadow and motion, honouring reduced motion.
   * A helper that picks readable text on the stored shift and leave colours.
3. **Shared components** in `src/components/ui/`:
   * `Button` and `IconButton` (at least 24 px; 44 px on touch screens);
   * `Card`, `PageHeader`, `Tabs` (the ARIA tabs pattern, scrollable on phones) and `Dialog` (a shell over `useDialogA11y` that fits a 1280 by 720 screen);
   * `Badge`, `DataTable` (sticky header and sorting; rows become cards on phones) and `FormField` with Input, Select, Textarea, Checkbox and Switch, showing errors inline;
   * `EmptyState`, `LoadingState` and `ErrorState` with Retry, and `Toast` (only `notify`; the 14 local copies are removed).
   * Reuse `MenuButton` and `confirmDialog`.
4. **Dates:** one module, `src/utils/dateUtils.ts` (`formatDate` already gives DD-MM-YYYY). Add date with time, long day and range formats, with tests. Delete `dateFormatter.ts`.
5. **App shell:**
   * a skip link, a browser tab title for each screen and one app name;
   * hash links that open a given roster, nurse, date or settings tab, and Back that moves between tabs (a small parser, no new library);
   * a React context for the clinic, the user and permissions, in place of the window events.
6. A component gallery view on the test page, kept clear of axe errors.

### Phase 3: roster grid speed and structure

Targets on the full size clinic (production build; the baseline is at the end of this file):
* the grid shows in under 1 s;
* an arrow key takes under 50 ms;
* the popup opens in under 100 ms;
* a deleted shift disappears in under 100 ms;
* nothing blocks the page for more than 200 ms while typing.

Each slice is measured with `grid-timing.cjs`:
1. A memoized `GridCell` with simple props and a precomputed view of each cell (pure functions, unit tested).
2. Selection and popup state in a small store (`useSyncExternalStore`), so a key press renders only two cells. Keys are handled on the grid itself, not by a window listener that is added again after every render.
3. Work out the hours per nurse, the day totals and the problem maps once per change. Mount the compare dialog only while it is open. Give "Who could cover?" stable inputs.
4. `applyEdit` replaces only the lists that changed. The save code (`CollectionSyncer`) fingerprints only the records that changed.
5. Keep the checker out of the typing path (`startTransition`). If it still takes over 100 ms, move it into a Web Worker.
6. Stop the extra renders from the top bar count, the presence timer and fill progress. Keep the grid mounted when another sheet tab is open.
7. Split `SchedulesView.tsx` into `RosterPage`, `RosterToolbar`, `RosterSteps`, `RosterSheets`, `FillDialog` and the hooks `useRosterData`, `useRosterEdits` (`applyEdit`, undo and redo) and `useRosterChecks`.
8. Split `WorkbookGrid.tsx` into `GridToolbar`, `GridTable`, `GridCell`, `GridStatusBar`, `CellEditorDialog`, `CellContextMenu`, `useGridSelection` and `useGridKeyboard`.

Risks: the save queues, live updates, undo and shift ids. These are covered by the existing tests (rosterSaving, savingSafety, liveUpdates, shiftIds), the emulator test and a browser flow script: an edit, undo, the popup, a fill, a swap, and a failed save (`window.__repo.failWrites`).

### Phase 4: roster screen layout, words and accessibility

* **Tabs and problems:**
  * The sheet tabs move above the content as real tabs.
  * Problems stay in the side panel.
  * One count everywhere: "N must fix · M to check".
* **Duplicates:** Full screen appears once, and the Legend and the Key tab are merged.
* **Toolbar:** the roster, its dates, Draft or Published, and the save status, then Fill, Publish, and More in groups (Roster, Copies, Share and export, Tools).
* **Grid:**
  * Wider readable cells with short doctor names.
  * Problem marks with an icon and text, not colour alone.
  * A calmer date header.
  * Shorter spoken cell names that start with the visible text.
  * No extra Tab stops in the headers; the hours column and the totals row can be reached by keyboard.
  * The zoom buttons say which level is on (`aria-pressed`).
* **Below 1024 px:** a read only day view (choose a day, see each nurse's shift) and the problems list, with a note that editing needs a laptop or tablet.

### Phase 5: nurse screens for phones, and request decision emails

* **My roster** (`MyRosterView`):
  * upcoming shifts as cards (date, shift, times, doctor);
  * Add to calendar;
  * 44 px targets and 16 px text;
  * the team sheet keeps its scrolling grid.
* **My requests** (`NurseSelfServicePanel`):
  * upcoming dates by default;
  * checks before sending;
  * a clear Waiting, Approved or Declined status, with the reviewer's note.
* **Other screens:** the read receipt page, the published roster page and the viewer Dashboard follow the same layout for phones.
* **Backend (approved): `POST /api/requests/:id/notify`** in a new `server/routes/requests.ts`.
  * Allowed for planners and managers.
  * The server reads the request and the nurse with the caller's own token, writes a plain email itself (no HTML from the browser), sends it to that nurse only, and follows mock mode and the rate limits.
  * It is called after Approve or Decline, and after an automatic decline when a pin is removed.
  * A switch in Settings, Email: "Email nurses when their request is decided".
  * Tests: the email text, and the route's checks on roles and recipients (in the style of the email server integration test).
  * No Firestore rules change is expected; `firestore-rules-reviewer` confirms this.

### Phase 6: Nurses, Doctors, Availability and Requests (planner screens)

* **Nurses and Doctors:**
  * `DataTable` lists with search and filters.
  * The editor checks each field as it is filled in.
  * The date of birth is no longer in the list.
  * Delete moves into the editor, which suggests "make inactive" first.
  * The preference list can be ordered from the keyboard.
* **Availability is split in two:**
  * "Leave and days off": the planner's grid.
  * "Requests": approvals, Waiting and All, as its own menu item with a count for approvers.
* **Leave grid:** click to start and click to end, as an alternative to dragging (WCAG 2.5.7). Leave letters with readable colours, and "pinned day" wording everywhere.

### Phase 7: publishing, History and all dialogs

* **Dialogs:** all of about 45 move onto the shared `Dialog` (the same header, footer and button order, and they fit a laptop screen).
* **Publish:** one flow from the roster screen, with a stepper. The Publish screen becomes "Sent rosters": the email log (paged, 25 at a time), read receipts, reminders and private links.
* **Backend (approved): resume a stopped publish.**
  * The email log keeps each nurse's status (Waiting, Sent, Failed), with the receipt tokens made in advance.
  * When someone returns, the roster and Sent rosters screens show "Sending stopped after 12 of 40 nurses" with Resume.
  * Resume sends only to the nurses waiting or failed, from the same version (no new version), and then writes the audit entry.
  * The resume plan is a pure function with unit tests.
  * No rules change (the email log is already a planner collection).
* **History:**
  * One set of filters.
  * Clear names: "Saved copy", "Automatic backup", "Published version".
  * Restore and delete only for planners.
  * Deleting a roster stays only in the roster's More menu.

### Phase 8: Settings, Reports, Audit

* **Settings sections:**
  * Clinic: profile and opening hours, public holidays, time periods.
  * Roster rules: rules, shifts, leave types, seniority, nurse skills, specialties.
  * People and access (owner only).
  * Email.
  * Data and backup (owner only).
  * Each section has a link, Save and Cancel, and a warning about unsaved changes.
* **Reports:**
  * Plain headings and columns: Goal, Worked, Leave, Difference (no OT or DEF).
  * Status words in normal case, not capitals.
  * Charts follow the `dataviz` skill.
* **Backend (approved): paging.**
  * Add `listPage(collection, { orderBy, limit, startAfter, where })` to `IRepository` and `FirestoreRepository`.
  * The audit trail loads 100 at a time, with "Load more".
  * Database statistics use Firestore count queries.
  * Filters use single field ordering to avoid new indexes.
  * Run the emulator test.

### Phase 9: tidy up and final audit

* **Remove dead code and unused packages:**
  * unused packages: cors, @types/cors, date-fns, and dotenv and autoprefixer if unused (`@google/genai` is used since the Gemini change on main, item 41);
  * the walkthrough stub and the dark mode classes.
* **Names:** rename the package to `nsc-clinic-roster`, and write the page description in plain English.
* **ESLint:** react hooks and accessibility rules, added to CI as warnings first.
* **Final audit:**
  * axe finds no serious or critical issue on any test page view;
  * no sideways scrolling on nurse screens at 390 px;
  * the grid timings meet their targets;
  * a full plain English review.
* Rewrite PROJECT_GUIDE.md section 13 (screens).

## Backend summary

| Change | Phase | Server | Firestore rules |
|---|---|---|---|
| Email log without full emails (size limit) | 1 | none | none |
| Request decision emails | 5 | new route `server/routes/requests.ts`, mounted in `server/apiApp.ts` | none expected |
| Resume a stopped publish | 7 | none | none |
| Paging for audit and email log, count queries | 7, 8 | none | none (queries stay within the current rules) |

If a rules change turns out to be needed, `firestore-rules-reviewer` checks it, and the owner publishes it by hand in the Firebase console.

## Not in this plan

* Sending from the server on its own (it needs a service account; the owner declined).
* Arabic.
* Restricting what viewers can read in the database itself (today the rules let approved users read most collections; hiding exports is a screen change only). Can be planned later if wanted.
* Making the database restore all or nothing.

## Verification

* **Every slice:**
  * `npx tsc --noEmit` and `npm test`;
  * `npm run build`, then `node --import tsx tests/integration/emailServer.test.ts`;
  * the emulator test (`tests/integration/scheduleTransactions.test.ts`) when repository code changes;
  * the rules tests if `firestore.rules` changes.
* **Every screen change:**
  * `ui-audit.cjs`: axe on the changed views, with screenshots at 1366, 1024 and 390 px compared before and after;
  * `grid-timing.cjs` for the roster;
  * the flow scripts: edit, undo, popup, fill, swap, publish in mock mode and deciding a request.
* **Each checkpoint:**
  * `code-review-and-quality`, `plain-english-reviewer`, and the `ui-ux-pro-max` checklist before delivery;
  * screenshots and numbers to the owner;
  * main only after "push to main", then the CI run on main.

## Right after approval

1. Run Phase 0 (install the skill first), then Phase 1.
2. Stop at Checkpoint 1 with screenshots, for the owner to say "push to main".
3. Phase 2 then starts with the sample page for the owner's approval.

## Baseline, 07-10-2026 (before any phase)

Measured with the browser check scripts added in Phase 0.

**Roster grid, full size clinic** (`grid-timing.cjs`, median of 3 runs, 60 nurses by 31 days, 12,300 page elements):

| | Production build | Development build | Phase 3 target |
|---|---|---|---|
| Cells shown | 1,004 ms | 1,928 ms | under 1,000 ms |
| Longest blocking task while loading | 341 ms | 432 ms | under 200 ms |
| Cell popup opens | 209 ms | 609 ms | under 100 ms |
| One arrow key | 62 ms | 213 ms | under 50 ms |
| Deleting a shift | 147 ms | 489 ms | under 100 ms |

The review's first figures (2.2 s, 700 ms, 200 ms, 960 ms) came from the development build, which is several times slower. Hospital computers slower than this container will feel the production numbers more.

**Screens** (`ui-audit.cjs`, laptop width 1366 px unless stated; serious axe problems / text under 12 px):

| Page | Serious axe | Text under 12 px | Notes |
|---|---|---|---|
| Dashboard | 0 | 7 | |
| Roster | 13 | 214 | cell names without their visible text, white on green Publish |
| Nurses | 4 | 32 | |
| Doctors | 6 | 31 | |
| Availability | 9 | 43 | |
| History | 28 | 127 | nested buttons, 17 px high buttons |
| Reports | 13 | 42 | |
| Nurse's private page | 25 | 71 | 5 at 390 px |
| Shared roster page | 99 | 157 | faint text in the team sheet |
| Sign in, read receipt | 0 | 1 | |
| Whole app on a 390 px phone | | | the content gets 166 px of 390: the sidebar never collapses |


## Checkpoint 2, 08-10-2026 (after Phase 2)

**Roster grid, full size clinic, production build** (`grid-timing.cjs`, median of 3 runs, 12,328 page elements):

| | Baseline | Checkpoint 2 | Phase 3 target |
|---|---|---|---|
| Cells shown | 1,004 ms | 963 ms | under 1,000 ms |
| Longest blocking task while loading | 341 ms | 257 ms | under 200 ms |
| Cell popup opens | 209 ms | 208 ms | under 100 ms |
| One arrow key | 62 ms | 55 ms | under 50 ms |
| Deleting a shift | 147 ms | 132 ms | under 100 ms |

Phase 2 did not change the grid, so these stay close to the baseline; Phase 3 works on them.

**Screens** (`ui-audit.cjs`, 1366 px): no page has more serious axe problems than the baseline. History has 26 serious axe problems, down from 28. The whole app's dashboard has no serious axe problems for the owner or the nurse (1 each before the new app frame), and its text under 12 px went from 11 to 7. The single screens keep their numbers until their own phases.

**Links and Back** (`links.cjs`, 9 checks): all pass. Before the review's fixes, creating a roster while another was open made the page stop answering, and a click in the account panel was lost when the browser did not focus the button (as in Safari).
