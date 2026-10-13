# UI overhaul: checklist

The plan is in `tasks/plan.md`. Tick a box when its slice is committed with its checks passing.
Main moves only when the owner says "push to main".

## Phase 0: setup
- [x] Install the `ui-ux-pro-max` skill and read every file before keeping it
- [x] Keep the skill out of the code graph (`.graphifyignore`)
- [x] Session start hook runs through `bash` (the script had lost its executable mark, so it never ran)
- [x] Test page: `?seed=big`, `?as=` people, `?view=app`, `me`, `published`, `ack`, production build
- [x] Scripts: `ui-audit.cjs`, `grid-timing.cjs`
- [x] Baseline numbers in `tasks/plan.md`
- [x] Guide item 42, graph, commit, push the working branch

## Phase 1: quick fixes and safety
- [x] Dates: Availability month, nurse request form, Doctors defaults
- [x] Phones: sidebar becomes a slide in menu below 1024 px, top bar trimmed on phones
- [x] Permissions: `usePermissions`, hide refused History actions and viewer exports, Pending Approvals for planners, viewers' roster button and forbidden routes
- [x] Publishing safety: email log kept under the size limit (whole emails while they fit), warning before closing while sending
- [x] English only: remove `src/services/i18n`, plain menu labels
- [x] Guide section 3 corrected
- [x] Reviews: rules reviewer (fixes made, 96 rules checks) and wording reviewer
- [x] Checkpoint 1: screenshots and numbers to the owner; pushed to main on 07-10-2026

## Phase 2: design system and app shell
- [x] Sample page from the `ui-ux-pro-max` design system (`?view=sample`, `?view=sample-nurse`), checked, and `design-system/nsc-clinic-roster/MASTER.md`
- [x] The owner approved the sample with Inter (07-10-2026)
- [x] Tokens in `src/index.css`, Inter, focus ring, indigo shown as the new teal, `colorContrast.ts`
- [x] Shared components in `src/components/ui/` and a gallery view (`?view=gallery`)
- [x] The 15 local copies of the corner message replaced by `notify`, and its look updated
- [x] One date module (`dateUtils.ts`: day with weekday, typed dates; `dateFormatter.ts` deleted)
- [x] App shell look: sidebar and top bar, skip link, a title for each screen, one app name
- [x] Links to a roster, nurse, date or settings tab, and Back between tabs
- [x] App context in place of the window events
- [x] Checkpoint 2 (08-10-2026): the review's two fixes, `links.cjs`, the numbers in `tasks/plan.md`; pushed to main on 08-10-2026

## Phase 3: roster grid speed and structure
- [x] Memoized cells and per cell views (`grid/cellView.ts`, `grid/GridCell.tsx`, `grid-flow.cjs`)
- [x] Selection store, keys on the grid (`grid/gridSelection.ts`; `grid-timing.cjs` also measures in the page)
- [x] Derived data once per change; compare dialog only while open (`grid/GridRow.tsx`, `grid/dayTotals.ts`)
- [x] Only changed lists saved and fingerprinted (`changedLists`, `planSync`)
- [x] Checker off the typing path (`checkScheduler.ts`; about 60 ms a check, so no worker)
- [x] No extra renders; grid kept mounted (`withProblemCount`, `usePresence`, memoized grid, `useLatestCallback`)
- [x] Split SchedulesView and WorkbookGrid (SchedulesView: toolbar, steps, sheet tabs, fill dialog, roster picker, useRosterChecks and useRosterEdits; loading stays for now. WorkbookGrid: toolbar, table, status bar, legend, cell editor, right click menu, useGridSelection, useGridKeyboard)
- [ ] Checkpoint 3 with timings against the targets

## Phase 4: roster screen layout, words and accessibility
- [ ] Tabs above the content, one problem count, no duplicates
- [ ] Toolbar regrouped
- [ ] Grid cells, marks, spoken names, keyboard reach
- [ ] Read only day view on phones (under 700 px wide or under 500 px high); tablets edit, held either way (owner, 13-10-2026)
- [ ] Checkpoint 4

## Phase 5: nurse screens for phones, request decision emails
- [ ] My roster and My requests for phones
- [ ] Read receipt, shared roster and viewer Dashboard for phones
- [ ] `POST /api/requests/:id/notify` with tests, and the Settings switch
- [ ] Checkpoint 5

## Phase 6: planner screens
- [ ] Nurses and Doctors lists and editors
- [ ] Availability split into Leave and days off, and Requests
- [ ] Leave grid without dragging
- [ ] Checkpoint 6

## Phase 7: publishing, History and dialogs
- [ ] Every dialog on the shared `Dialog`
- [ ] One publish flow; Sent rosters screen with paging
- [ ] Resume a stopped publish
- [ ] History tidied
- [ ] Checkpoint 7

## Phase 8: Settings, Reports, Audit
- [ ] Settings sections with links and Save and Cancel
- [ ] Time periods: the new period form starts at the next cycle, not at 19-01-2026
- [ ] Reports in plain words
- [ ] Audit paging and count queries
- [ ] Checkpoint 8

## Phase 9: tidy up and final audit
- [ ] Dead code and unused packages
- [ ] Package name and page description
- [ ] ESLint in CI
- [ ] Final audit and guide section 13
