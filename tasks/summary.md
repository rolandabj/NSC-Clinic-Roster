# UI overhaul: summary and next steps

**For a new chat, read `tasks/handover.md` first**: it is up to date as of the end of Phase 5
(14-10-2026). The rest of this summary stops at Phase 3.

As of 13-10-2026. Phases 0, 1 and 2 of the ten phase plan are done and on main. Phase 3, roster
grid speed and structure, is done and on main too (Checkpoint 3). Phase 4 is next.

The full plan is in `tasks/plan.md` and the checklist in `tasks/todo.md`. Each step is recorded
in detail in `PROJECT_GUIDE.md`, section 16, items 42 to 58.

## 1. Where things stand

| | |
|---|---|
| Done | Phase 0 (setup), Phase 1 (quick fixes and safety), Phase 2 (the new look and the app frame), Phase 3 (roster grid speed and structure, at Checkpoint 3) |
| On main | Everything up to the end of Phase 3 and Checkpoint 3 (13-10-2026) |
| Checks on main | CI runs 57 to 61 passed |
| Unit tests | 375 (279 when the plan started), and 96 Firestore rules checks |
| Firestore rules | Not changed by the overhaul so far, so there is nothing to publish by hand |
| Next | Phase 4: the roster screen's layout, words and accessibility, when the owner says go |

## 2. Why this work

On 07-10-2026 the owner asked for a review of the whole UI against standard practice, then an
overhaul of the whole app in phases, with backend changes where needed. The work uses the
`ui-ux-pro-max` design skill, installed in Phase 0.

**The owner's decisions (07-10-2026):**

* A fresh look, shown first on one sample page. The owner approved the sample, with the Inter
  font, the same day.
* Planners edit the roster on a laptop or tablet. On a phone, planners get a read only day view
  and the problems list. Nurse screens are designed for phones first.
* Three backend changes: an email to a nurse when their request is decided, resuming a publish
  that stopped partway, and loading the audit trail and the email log in pages. Sending email from the
  server on its own was declined, because it needs a service account.
* English only: the unused Arabic text is removed.
* The Gemini routes are for any signed in user (they had been open to anyone).

## 3. What the review found, and where each part stands

The review looked at seven screens at laptop and phone widths with an accessibility scan (axe),
timed the roster grid with a full size clinic (60 nurses, 12 doctors, 31 days), and read through
the screens, the roster screen, permissions, data flow and the server.

| Area | What was wrong | Where it stands |
|---|---|---|
| Design | No shared colours, sizes or parts: 786 made up text sizes of 7 to 11 px, text too faint to read 261 times, 12 hand made tab bars, and a separate copy of the corner message in 15 screens and dialogs | Phase 2 added the design system and the shared parts; each screen takes them up in its own phase |
| Accessibility | 58 colour contrast failures; the grid cells' spoken names left out what they show; History had nested buttons and buttons 17 px high; some signals were shown by colour only | The app frame has no serious problems on the dashboards, and its text under 12 px went from 11 places to 7; the screens follow in their phases (section 5) |
| Words | Generated jargon such as "Schedule Version History Center"; one idea under five names; dashes and hyphens in visible text | The menu and the frame's words are done; each screen's words and messages are reworded in its phase |
| Dates | About ten formats, some in US style | One date module (Phase 2); the screens switch to it in their phases |
| Phones | The sidebar left 166 px of a 390 px phone for the content; touch targets of 15 to 30 px | A slide in menu (Phase 1); nurse screens in Phase 5; the roster day view in Phase 4 |
| Grid speed | About 1 s before the cells show on the production build (the review first measured 2.2 s on the slower development build); every key press redrew all 1,860 cells | Done (Phase 3), apart from the longest task while loading, which needs fewer elements on screen (Phase 4) |
| Roster layout | Four different problem counts, the sheet tabs below the grid, Full screen twice | Phase 4 |
| Navigation | Back did nothing inside a screen; no link could open a given roster, nurse, day or tab; three screens started in October 2026 | Done for rosters, sheets, nurses, days and the Settings tabs, and the screens start from today (Phases 1 and 2); the Reports, History and Availability tabs take up links and Back in their phases |
| Permissions | Buttons shown to people the rules refuse; exports open to viewers | Done (Phase 1) |
| Backend | A publish stopped by closing the tab cannot be finished; the email log could pass Firestore's 1 MiB limit at about 40 nurses (an estimate); nurses are not told when a request is decided; the audit trail and email log load in full | The email log size guard is done (Phase 1); the rest follows in Phases 5, 7 and 8 |
| Code | Two files of about 3,000 lines each; no shared app state; no ESLint | Shared app state is done (Phase 2); the two files are split (Phase 3: 2,324 and 1,294 lines now); ESLint comes in Phase 9 |

## 4. What has been done

### Phase 0: setup (07-10-2026)

* Installed the `ui-ux-pro-max` skill after reading every file (a local search tool with no
  network calls), and kept its data out of the code graph.
* Found why the session start script never ran (an AI Studio commit had removed its executable
  mark) and made it run through `bash`.
* Made the review repeatable on the test page (`.claude/skills/browser-check/`): a full size
  clinic (`?seed=big`), a choice of who is signed in (`?as=`), the whole app (`?view=app`), the
  pages nurses open from links, a production build, and two scripts: `ui-audit.cjs`
  (screenshots and the accessibility scan) and `grid-timing.cjs` (the grid timings).
* Recorded the starting numbers in `tasks/plan.md`.

### The Gemini routes need sign in (07-10-2026)

The Gemini change had left its routes open to anyone who found the app's address, using the
clinic's Gemini key and quota. The owner chose "any signed in user", so the routes now refuse
everyone else.

### Phase 1: quick fixes and safety (07-10-2026)

* **Dates:** Availability, the nurse request forms and the Doctors defaults started in October
  2026 whatever the date. Now Availability opens on the current month, the nurse request forms
  start a week ahead, and the Doctors defaults follow the open roster or today.
* **Phones:** below 1024 px the sidebar is a slide in menu opened from the top bar, so a 390 px
  phone gives its whole width to the content.
* **Permissions:** screens show only what the rules allow. History's Restore and Delete show for
  planners only, downloads for planners and managers, and Pending Approvals for planners too. A
  link to a screen someone may not open goes to the Dashboard. A review of the rules found more
  small gaps, all fixed, with 5 new rules checks (96 in all).
* **Publishing safety:** the email log keeps whole emails only while they fit, so a large
  publish cannot fail at its last step on Firestore's size limit. The page asks before it is
  closed while emails are going out.
* **English only:** the unused Arabic module is gone, and the menu uses plain labels (Rosters,
  Audit trail and so on).

### Phase 2: the new look and the app frame (07-10-2026 to 08-10-2026)

* **The look** was made with the `ui-ux-pro-max` skill, then edited, and is written down in
  `design-system/nsc-clinic-roster/MASTER.md`: a calm teal brand (`#0E7490`) on neutral slate,
  two levels of text, and colours for Must fix, Check, Approved and Note that always come with
  an icon and a word. Inter is the one font, 12 px is the smallest text, and controls are 36 px
  on a laptop and 44 px on touch screens. The owner approved it from a sample page on 07-10-2026.
* **In the app:** the colours and the font are in `src/index.css`, so every screen shows the new
  teal at once. A helper (`colorContrast.ts`) is ready to pick readable text for the shift and
  leave colours that planners choose; the grid and the leave screens take it up in Phases 4 and 6.
* **Shared parts** in `src/components/ui/`: buttons, badges, cards, a page header, tabs, a
  dialog, form fields (with a date field that always shows DD-MM-YYYY), notices, empty, loading
  and error states, and a table that becomes cards on a phone. The test page's `?view=gallery`
  shows them all, with no accessibility problems.
* **One date module** (`src/utils/dateUtils.ts`), now with the weekday and dates typed in; the
  unused second copy is deleted.
* **One corner message** for every screen (`notify`): screen readers hear it, and errors show as
  errors. 15 screens and dialogs had their own copy.
* **The app frame:** a white sidebar with the open screen in teal, one app name (NSC Clinic
  Roster), a title for each browser tab, a skip link, and an account panel that works with the
  keyboard and in Safari.
* **Links and Back:** an address can open a given roster, sheet, nurse, day or settings tab (for
  example `#schedules?roster=nov&sheet=problems` or `#settings?tab=email`), and Back moves
  between tabs.
* **One app context** in place of four separate browser events, so the screens share the clinic, the
  person signed in, their permissions and the open roster's problem count.
* **The Checkpoint 2 review** found two problems, both fixed. Creating a roster while another was
  open made the page stop answering (over 200,000 database reads in 45 seconds on the test
  page); it now makes 48 database reads. In Safari, a click in the account panel could be lost. A new browser
  check, `links.cjs` (9 checks), covers both, along with the links and Back.

### Phase 3: roster grid speed and structure (13-10-2026)

* **Cells drawn only when they change:** what each cell shows is worked out in advance, once per
  change, and each cell and each nurse's row is drawn again only when what it shows changes.
* **The selection kept in one small place:** an arrow key or a click draws two cells, not 1,860; the
  keys are handled on the grid itself.
* **Less work per edit:** an edit saves only the lists it changed, the save no longer compares
  records it saved last time, the compare dialog is built only while it is open, and "Who could
  cover?" no longer works its answer out on every redraw.
* **The roster check kept out of the way:** it runs once after the screen has drawn (opening the
  full size roster ran it four times), and its result is drawn so a key press can interrupt it.
* **No extra redraws:** the top bar count, presence ("X is also here") and the fill progress no
  longer redraw the grid; another sheet and back keeps the zoom and the selection.
* **Smaller files:** the roster screen's toolbar, steps, sheet tabs, fill dialog, roster picker,
  the check and the edits, and the grid's toolbar, table, status bar, legend, cell editor and right click
  menu, each in their own file.
* **Checked at every slice:** the page's and the grid's HTML in 82 states stayed byte for byte the
  same, and browser scripts for edits, undo, the popup, a fill, a swap, a failed save, the keys,
  the menus, the editor and the links pass.
* The owner's answer before Phase 4: tablets can edit the roster, held upright or sideways; only
  phones get the read only day view.
* **Checkpoint 3:** a code review of the whole phase found nothing serious and three small
  problems, all fixed: a "Show in grid" flash that could stay on, a roster opened just after an
  edit on another that showed the other roster's problems, and the popup staying open in the
  hidden grid after Back.

## 5. Numbers

**Roster grid on the full size clinic, production build** (Checkpoint 3, median of 7 runs, the
same machine and script for both columns; times in the page, from the press or the key to the
next frame drawn):

| | Before Phase 3 | Checkpoint 3 | Phase 3 target | |
|---|---|---|---|---|
| First cells | 523 ms | 450 ms | under 1,000 ms | met |
| Cell popup opens | 112 ms | 48 ms | under 100 ms | met |
| One arrow key | 56 ms | 27 ms | under 50 ms | met |
| Deleting a shift | 147 ms | 86 ms | under 100 ms | met |
| Longest task that blocks the page while using the grid | 107 ms | 51 ms | under 200 ms | met |
| Longest task that blocks the page while loading | 270 ms | 274 ms | under 200 ms | not met |

The longest task while loading is the browser alone (the browser's own work to lay out and
draw the grid's 12,000 elements); Phase 4's cells, or drawing only the rows in view, can bring it down. Earlier
numbers in `tasks/plan.md` came from the script's own clock, which includes the test tool's work
and a different machine, so they do not compare with these. Hospital computers slower than the
test machine will feel these times more.

**Serious accessibility problems** (axe, laptop width):

| Page | Before | Now | Fixed in |
|---|---|---|---|
| Whole app, owner's dashboard | 1 | 0 | done |
| Whole app, nurse's dashboard | 1 | 0 | done |
| Dashboard screen, sign in page, read receipt page | 0 | 0 | done |
| Roster | 13 | 13 | Phase 4 |
| Nurse's private page | 25 | 25 | Phase 5 |
| Shared roster page | 99 | 99 | Phase 5 |
| Nurses | 4 | 4 | Phase 6 |
| Doctors | 6 | 6 | Phase 6 |
| Availability | 9 | 9 | Phase 6 |
| History | 28 | 26 | Phase 7 |
| Reports | 13 | 13 | Phase 8 |

For the whole app, "before" means before the new app frame in Phase 2; for the rest it means
before the overhaul.

## 6. How the work is done

* Every change is built in small slices on the working branch `claude/ui-overhaul`.
* Before each commit: the type check, the unit tests, the build and the email server check; the
  emulator test when repository code changes, and the rules tests when `firestore.rules` changes; and a browser check on the test
  page for every screen change.
* Every commit updates `PROJECT_GUIDE.md` and the code graph (`graphify-out/`).
* Wording is checked for plain English: no hyphens, "they" for people, dates as DD-MM-YYYY.
* Each phase ends at a checkpoint with screenshots and numbers for the owner. Main moves only
  when the owner says "push to main", and the CI run on main is checked afterwards. AI Studio
  then rebuilds the live app from main.
* If the Firestore rules ever change, the owner publishes them by hand in the Firebase console.

## 7. Next steps

### Now

1. Say go for Phase 4.

### The phases after that

| Phase | What | Backend | Size |
|---|---|---|---|
| 4 | Roster screen layout, words and accessibility: the sheet tabs above the content, one problem count everywhere ("N must fix · M to check"), a regrouped toolbar, readable cells and marks, and a read only day view on phones (see the owner's answer below) | none | large |
| 5 | Nurse screens for phones (My roster as cards, My requests with a clear status, the read receipt page, the shared roster page and the viewer Dashboard), and an email to a nurse when their request is decided | a new route, `POST /api/requests/:id/notify`, with a switch in Settings | medium |
| 6 | Planner screens: the Nurses and Doctors lists and editors, Availability split into "Leave and days off" and "Requests", and a leave grid that works without dragging | none | large |
| 7 | Every dialog moved onto the shared dialog, one publish flow, a "Sent rosters" screen, History tidied, and resuming a publish that stopped | resuming a publish; the email log loaded in pages | large |
| 8 | Settings in clear sections with Save and Cancel, Reports in plain words, and the audit trail loaded in pages | the audit trail loaded in pages, and counts that do not read every record | medium |
| 9 | Dead code and unused packages removed, the package renamed with a plain English description, ESLint in CI, the final audit, and the guide's screens section rewritten | none | medium |

No phase is expected to change the Firestore rules. If one does, the change is reviewed and the
owner publishes it by hand.

### The question before Phase 4, answered

The plan gave the read only day view to screens narrower than 1024 px, which includes a tablet
held upright, while the owner's decision says planners edit the roster on a laptop or a tablet.
Asked on 13-10-2026 whether a tablet held upright should edit the roster or get the day view,
the owner chose editing. So only phones get the day view: a screen under 700 px wide or under
500 px high, which covers a phone held either way, while the smallest iPad is 744 px wide held
upright.

### Noticed, and waiting for their phase

* Done in Phase 4, slice 1: one problem count everywhere ("28 must fix · 6 to check · 3 notes"), and no
  count in the top bar until a screen has checked the roster (it showed 0).
* The selected cell shows only a light tint: its ring hardly shows. Phase 4 (readable cells).
* At 1024 px, with the menu showing, the roster toolbar's buttons wrap onto a second row and
  the day range breaks across two lines. Phase 4.
* "ClinicRoster" still appears on the Doctors screen (Phase 6), and in the roster email and the
  footer of the test email (Phase 7).
* When the compare dialog closes, the focus goes to the page rather than back to More (the menu
  item that opened it is gone by then). Phase 7.
* The New roster dialog suggests a name with the month first, in US style and with dashes in it,
  and falls back to names that start with "Schedule". Phase 7.
* The Time periods form in Settings starts at 19-01-2026. Phase 8.
* Each screen's own accessibility problems (section 5) are fixed in that screen's phase.

### Not in the plan

* Sending email from the server on its own (it needs a service account; the owner declined).
* Arabic.
* Limiting what viewers can read in the database itself. Today the screens hide the exports,
  but the rules still let approved users read most collections. This can be planned later.
* Making a database restore all or nothing.

## 8. Where to find things

| What | Where |
|---|---|
| The plan, with the starting and Checkpoint 2 numbers | `tasks/plan.md` |
| The checklist | `tasks/todo.md` |
| This summary | `tasks/summary.md` |
| The full record of each step | `PROJECT_GUIDE.md`, section 16, items 42 to 58 |
| The approved look | `design-system/nsc-clinic-roster/MASTER.md` |
| Colours and font | `src/index.css` |
| Shared parts | `src/components/ui/` (on the test page at `?view=gallery`) |
| Dates | `src/utils/dateUtils.ts` |
| Links and Back | `src/services/navigation/address.ts` |
| Shared app state | `src/components/common/AppContext.tsx` |
| The test page and its scripts | `.claude/skills/browser-check/` (`ui-audit.cjs`, `grid-timing.cjs`, `links.cjs`, `grid-flow.cjs`) |
| The roster screen's parts, and the grid's | `src/components/roster/`, `src/components/workbook/grid/` |

## 9. Commits on main

**Phases 0 and 1, and the Gemini fix** (main at `f5d5b17`, 07-10-2026):

* `177429f` UI overhaul Phase 0: plan, `ui-ux-pro-max` skill, test page tools
* `e3ce826` Gemini routes need sign in
* `7c5adbb` Screens start from today instead of October 2026
* `d135e84` Phones get a slide in menu instead of a fixed sidebar
* `332366d` Screens show only what the rules allow each person
* `1f02c9d` Publishing: the email log stays under Firestore's size limit
* `ba890cd` English only, with plain menu labels
* `b946a32` Permission review fixes and tests
* `f5d5b17` Guide: items 42 to 44 approved for main

**Phase 2** (main at `39ae8d8`, 08-10-2026):

* `970b2f1` Sample of the new look for the owner (UI overhaul Phase 2)
* `ea77021` The owner approved the new look with Inter
* `e63bb4f` One date module: day with weekday and typed DD-MM-YYYY dates
* `a4ed8c2` The approved look's colours and font in the app
* `a6f63ee` Shared parts of the new look in `src/components/ui`
* `0b57d27` One corner message for every screen, in the new look
* `e351323` The app frame in the new look, with one name and page titles
* `35bda41` Links to a roster, nurse, day or settings tab, and Back between tabs
* `b0ae060` One app context in place of window events
* `0a3fe24` Phase 2 checkpoint: a new roster stays open, and the account panel works in Safari
* `122493a` Checkpoint 2 wording: clearer address details, labelled numbers
* `39ae8d8` Guide: items 45 and 46 approved for main

**Phase 3, slices 1 to 3, and the caveman voice skills** (main at `bf22360`, 13-10-2026):

* `02708a0` Roster grid cells drawn only when what they show changes (slice 1)
* `4c04698` Grid selection and popup in a small store, keys on the grid (slice 2)
* `32e7519` Grid rows drawn again only when an edit changes them (slice 3)
* `cd6f17f` Caveman voice skills, on in every chat (the owner's choice)
* `bf22360` Guide: items 48 to 51 approved for main

**Phase 3, slices 4 to 8, and Checkpoint 3** (pushed to main on 13-10-2026):

* `d8e693c` An edit saves only the lists it changed (slice 4)
* `11ba50f` Roster check runs once, after the screen has drawn (slice 5)
* `355876f` No extra grid redraws; grid kept while another sheet is open (slice 6)
* `a570713` Roster screen parts out of SchedulesView (slice 7, part 1)
* `c2023dc` Roster check and edits into hooks (slice 7, part 2)
* `31f0a7c` Roster grid split into parts (slice 8)
* `601b361` Grid selection hook: the comment says where the cell is scrolled to (a comment fix, after slice 8)
* `0773825` Checkpoint 3: timings against the targets, and the summary brought up to date
* `81040dc` Checkpoint 3: three fixes from the code review, guide item 58
* Guide: items 52 to 58 approved for main
