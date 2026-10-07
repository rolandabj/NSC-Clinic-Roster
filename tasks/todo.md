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
- [ ] Publishing safety: email log without full emails, warning before closing while sending
- [ ] English only: remove `src/services/i18n`
- [ ] Guide section 3 corrected
- [ ] Checkpoint 1: screenshots and numbers to the owner

## Phase 2: design system and app shell
- [ ] Sample page from the `ui-ux-pro-max` design system, approved by the owner
- [ ] Tokens in `src/index.css`
- [ ] Shared components in `src/components/ui/` and a gallery view
- [ ] One date module
- [ ] App shell: skip link, titles, deep links, Back between tabs, app context
- [ ] Checkpoint 2

## Phase 3: roster grid speed and structure
- [ ] Memoized cells and per cell views
- [ ] Selection store, keys on the grid
- [ ] Derived data once per change; compare dialog only while open
- [ ] Only changed lists saved and fingerprinted
- [ ] Checker off the typing path
- [ ] No extra renders; grid kept mounted
- [ ] Split SchedulesView and WorkbookGrid
- [ ] Checkpoint 3 with timings against the targets

## Phase 4: roster screen layout, words and accessibility
- [ ] Tabs above the content, one problem count, no duplicates
- [ ] Toolbar regrouped
- [ ] Grid cells, marks, spoken names, keyboard reach
- [ ] Read only day view below 1024 px
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
