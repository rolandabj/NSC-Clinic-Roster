# Graph Report - NSC-Clinic-Roster  (2026-11-15)

## Corpus Check
- 431 files · ~441,393 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 3024 nodes · 10411 edges · 158 communities (126 shown, 32 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 441 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1d732e7d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- nurseRosterService.ts
- clinicModel.test.ts
- authService
- GridTable.tsx
- getRepository
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- quotaTracker
- DashboardView.tsx
- seedRunner.ts
- FairnessModal.tsx
- IRepository
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- Button
- App.tsx
- emailService.ts
- devDependencies
- access.ts
- quick reference
- decisionEmail.test.ts
- checkScheduler.test.ts
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- Sidebar.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- auditWords.ts
- SchedulesView.tsx
- fixtures.ts
- Optimization Patterns
- Nurse
- EntityForCollection
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- Assignment
- firestore-rules/package.json
- lucide-react
- continuousHours.test.ts
- leave-dialogs.cjs
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- dialogs.tsx
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- explainCell.ts
- Planning and Task Breakdown
- Find Skills
- ClinicContextState
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- fakeAuth.ts
- Rules
- RosterToolbar.tsx
- README.md
- emailPublishing.test.ts
- holidayLeave.ts
- apiApp.ts
- PublishedRosterView.tsx
- links.cjs
- icsExportService.ts
- cellView.ts
- makeNurse
- GridSelection
- gridSelection.ts
- UI overhaul: summary and next steps
- FirestoreRepository
- types/index.ts
- Design system: NSC Clinic Roster
- firestoreRest.ts
- harness/main.tsx
- gridKeys.test.ts
- dateDefaults.ts
- Finish a change
- Rules
- weekHours.test.ts
- authorizedFetch
- context7
- ref_playwright
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- geminiApi.test.ts
- start.sh
- stop.sh
- Rules
- engineRules.test.ts
- analysisExport.test.ts
- savingSafety.test.ts
- address.ts
- yearToDate.ts
- LiveCollectionCache
- HistoryView.tsx
- futureReservations.test.ts
- nurseList.test.ts
- peopleImport.ts
- authService.ts
- NSC Clinic Roster: complete project guide
- 16. History of work (for context)
- RosterGrid
- approvedDayOff.test.ts
- leaveGuard.ts
- IRepository.ts
- nurseClinicFloat.test.ts
- ref_node_assert
- grid-timing.cjs
- colorContrast.ts
- rowsInSteps.ts
- dayView.test.ts
- my-requests.cjs
- request-clinic-dialogs.cjs
- ui/index.ts
- doctorWeekChange.test.ts
- requests.cjs
- CellEditorDialog.tsx
- allowance.cjs
- grid-keys.cjs
- data-backup.cjs
- roster-dialogs.cjs
- nurse-editor.cjs
- nurse-page.cjs
- nurses-list.cjs
- form-dialogs.cjs
- history.cjs
- toolbar.cjs
- sent-rosters.cjs
- settings-save.cjs
- leave-grid.cjs
- your-access.cjs
- roster-editing-dialogs.cjs
- access.cjs
- grid-flow.cjs
- SENIOR
- newRosterDates.ts
- resume.cjs
- time-periods.cjs

## God Nodes (most connected - your core abstractions)
1. `16. History of work (for context)` - 127 edges
2. `react` - 119 edges
3. `Assignment` - 113 edges
4. `Nurse` - 106 edges
5. `getRepository()` - 99 edges
6. `DutyWindow` - 94 edges
7. `Button()` - 93 edges
8. `formatDate()` - 92 edges
9. `Schedule` - 91 edges
10. `lucide-react` - 89 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `16. History of work (for context)` --references--> `ProblemMark`  [INFERRED]
  PROJECT_GUIDE.md → src/components/workbook/grid/GridTable.tsx

## Import Cycles
- None detected.

## Communities (158 total, 32 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (53): jspdf, jspdf-autotable, ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps, fmtHours(), HoursAccountingSheet() (+45 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.08
Nodes (63): 6. Clinic model (the business rules in plain English), 7. Rules, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, bloodCollectionRole(), canBeFreeNurse(), ClinicSetup (+55 more)

### Community 2 - "nurseRosterService.ts"
Cohesion: 0.13
Nodes (25): LoadState, MyRosterView(), MyRosterViewProps, MyDay, myShiftDays(), dayMonth(), ensureNurseLink(), formatRosterAsText() (+17 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.06
Nodes (27): Steps, apps, { initializeTestEnvironment }, planner(), requireRules, history(), D, DOCTORS (+19 more)

### Community 5 - "GridTable.tsx"
Cohesion: 0.17
Nodes (24): CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps (+16 more)

### Community 6 - "getRepository"
Cohesion: 0.12
Nodes (53): confirmDialog(), notify(), TemplateModal(), Checkbox(), Field(), Input(), AccessManagementPanel(), ClinicTab() (+45 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.07
Nodes (26): firebase, name, private, scripts, build, clean, dev, lint (+18 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.10
Nodes (29): CellContextMenu(), cellSummary(), isDayProblem(), dayTotalsOf(), GRID_KEY_ID, GridLegend(), rowViewsOf(), GridStatusBar() (+21 more)

### Community 11 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, express, express-rate-limit, firebase, @google/genai, helmet, jose, jspdf (+11 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "quotaTracker"
Cohesion: 0.13
Nodes (9): defaultFirebaseConfig, FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener (+1 more)

### Community 14 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (23): loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), ViewerData, addDays(), countChangedCells(), nextRosterNeeded() (+15 more)

### Community 15 - "seedRunner.ts"
Cohesion: 0.14
Nodes (20): useAppContext(), DatabaseTab(), countOf(), toScheduleRange(), SEED_WORKING_HOURS_PERIODS, ALL_COLLECTIONS, BackupCheck, checkBackup() (+12 more)

### Community 16 - "FairnessModal.tsx"
Cohesion: 0.06
Nodes (50): Other engine files, NONE, NurseFairnessMetrics, ProposedSwap, NONE, checkAssignment(), hardRule(), listProblem() (+42 more)

### Community 17 - "IRepository"
Cohesion: 0.09
Nodes (19): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, fingerprint(), syncScheduleAssignments(), repositoryManager, IRepository (+11 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.11
Nodes (23): jose, AuthUser, BackendRole, Express, requireOwner, requirePlanner, ROLE_HIERARCHY, verifyToken() (+15 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "Button"
Cohesion: 0.09
Nodes (56): EmailHtmlPreview(), usePermissions(), FairnessModal(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, CHANGE_LABELS, CHANGE_TONES (+48 more)

### Community 22 - "App.tsx"
Cohesion: 0.15
Nodes (12): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+4 more)

### Community 23 - "emailService.ts"
Cohesion: 0.17
Nodes (13): emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, ServerEmailConfig, SMTP_CONNECTION_KEYS, withoutConnectionSettings() (+5 more)

### Community 24 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, esbuild, tailwindcss, @types/express, @types/node, @types/nodemailer, @types/react, @types/react-dom (+2 more)

### Community 25 - "access.ts"
Cohesion: 0.20
Nodes (15): 3. Users, roles and access, signOutSafely(), AccountMenu(), TopBar(), TopBarProps, Card(), DashboardView(), TodayList() (+7 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (20): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, isGoogleAccountEmail(), SendEmailPayload, SendEmailResult (+12 more)

### Community 28 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 29 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (33): askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE (+25 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "Sidebar.tsx"
Cohesion: 0.31
Nodes (10): 4. Navigation and app shell, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, Sidebar(), SidebarProps (+2 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.06
Nodes (30): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+22 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "auditWords.ts"
Cohesion: 0.23
Nodes (12): ACTION_WORDS, actionWord(), AUDIT_ACTIONS, AuditFilters, changedFields(), ENTITY_WORDS, entityWord(), FieldChange (+4 more)

### Community 38 - "SchedulesView.tsx"
Cohesion: 0.07
Nodes (44): Report, What to check, What to look at, react, useLatestCallback(), SwapManagerModal(), ResumePublish(), PHONE_QUERY (+36 more)

### Community 39 - "fixtures.ts"
Cohesion: 0.10
Nodes (17): ANNUAL_LEAVE, DAY_DUTY, UNPAID_LEAVE, LONG, NOV, OCT, D, E (+9 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Nurse"
Cohesion: 0.12
Nodes (68): 5. Data model (Firestore collections), VersionRosterProps, WEEKDAY_NAMES, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps (+60 more)

### Community 42 - "EntityForCollection"
Cohesion: 0.12
Nodes (11): 11. Saving, live updates, versions, saveHolidayLeave(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+3 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.10
Nodes (27): computeScheduleDiff(), formatAssignment(), EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), nurseLinkUrl(), findStoppedPublish() (+19 more)

### Community 46 - "Assignment"
Cohesion: 0.19
Nodes (17): TemplateModalProps, RosterSnapshot, CellFacts, LeaveAndLocksSheetProps, daysInclusive(), LeaveImportRow, ResolvedClinicSetup, RosterBackupInput (+9 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "lucide-react"
Cohesion: 0.12
Nodes (45): lucide-react, uuid, NoticeTone, AuthModal(), BulkImportModal(), CreateScheduleModal(), DeleteScheduleModal(), DoctorWeekChangeDialog() (+37 more)

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.15
Nodes (23): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+15 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "dialogs.tsx"
Cohesion: 0.16
Nodes (19): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+11 more)

### Community 56 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 57 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 58 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 59 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 60 - "NSC Clinic Roster"
Cohesion: 0.40
Nodes (4): Always, with every change (owner's standing instruction), Caveman voice in every chat (owner's choice of 13-10-2026), graphify, NSC Clinic Roster

### Community 65 - "explainCell.ts"
Cohesion: 0.12
Nodes (25): DayProblem, DayRow, dayViewOf(), firstDayShown(), KIND, ORDER, fmt(), hoursText() (+17 more)

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "ClinicContextState"
Cohesion: 0.13
Nodes (21): AppContext, AppContextValue, AuthModalProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+13 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.09
Nodes (21): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+13 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "fakeAuth.ts"
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "RosterToolbar.tsx"
Cohesion: 0.07
Nodes (33): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), FillDialogProps, moreMenuItems(), RosterMenuItem (+25 more)

### Community 77 - "emailPublishing.test.ts"
Cohesion: 0.14
Nodes (12): nodemailer, EmailReadiness, readEmailResponse(), configured, live, all, backup, lastYear (+4 more)

### Community 78 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 79 - "apiApp.ts"
Cohesion: 0.14
Nodes (13): repoRoot, swaps, express, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp() (+5 more)

### Community 80 - "PublishedRosterView.tsx"
Cohesion: 0.18
Nodes (14): 12. Publishing and nurse links, PublicMessage(), PublicPageFrame(), dateLabel(), PublishedRosterSheet(), AcknowledgePage(), AcknowledgePageProps, PublishedRosterView() (+6 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.17
Nodes (17): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+9 more)

### Community 83 - "cellView.ts"
Cohesion: 0.13
Nodes (22): CellDay, cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews(), sameView(), shortDoctorNames(), SOURCE_SPOKEN (+14 more)

### Community 84 - "makeNurse"
Cohesion: 0.12
Nodes (21): hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account(), doctorOfAmy() (+13 more)

### Community 85 - "GridSelection"
Cohesion: 0.13
Nodes (5): GridSelection, GridSelectionState, HOURS_COLUMN, TOTALS_ROW, SelectionView()

### Community 86 - "gridSelection.ts"
Cohesion: 0.23
Nodes (11): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), keyOf(), PopupRef (+3 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 89 - "types/index.ts"
Cohesion: 0.05
Nodes (37): Request, RuleDef, NEXT_ROSTER_WARNING_DAYS, OnDutyEntry, isPairing(), PREFERENCE_FOCUS_LABELS, WEEK_HOURS_DEFAULT, DispatchResult (+29 more)

### Community 90 - "Design system: NSC Clinic Roster"
Cohesion: 0.17
Nodes (11): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+3 more)

### Community 91 - "firestoreRest.ts"
Cohesion: 0.36
Nodes (8): calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs()

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "gridKeys.test.ts"
Cohesion: 0.27
Nodes (6): isRosterCell(), moveSelection(), CellAction, useGridKeyboard(), DATES, NURSES

### Community 94 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "weekHours.test.ts"
Cohesion: 0.07
Nodes (16): SchedulingEngine, CARD, KHAN, LATE, LEE, ORTHO, SESSIONS, DR_PCC (+8 more)

### Community 98 - "authorizedFetch"
Cohesion: 0.31
Nodes (8): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ref_playwright"
Cohesion: 0.10
Nodes (13): args, { chromium }, args, { chromium }, { chromium }, args, { chromium }, args (+5 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "geminiApi.test.ts"
Cohesion: 0.28
Nodes (8): geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured(), RosterInsightsInput

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 109 - "analysisExport.test.ts"
Cohesion: 0.08
Nodes (22): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+14 more)

### Community 110 - "savingSafety.test.ts"
Cohesion: 0.14
Nodes (7): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS

### Community 111 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 112 - "yearToDate.ts"
Cohesion: 0.13
Nodes (23): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+15 more)

### Community 113 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 114 - "HistoryView.tsx"
Cohesion: 0.23
Nodes (21): shiftTargetName(), VersionRoster(), DeleteVersionModal(), plural(), ExportModal(), VersionViewModal(), CHANGE_WORDS, HistoryView() (+13 more)

### Community 115 - "futureReservations.test.ts"
Cohesion: 0.22
Nodes (5): dates, doctors, fill(), rules, specialties

### Community 116 - "nurseList.test.ts"
Cohesion: 0.32
Nodes (4): filterNurses(), nurseCounts(), NurseFilters, nurses

### Community 117 - "peopleImport.ts"
Cohesion: 0.07
Nodes (30): byDayAndTime(), DoctorFilters, DoctorFormErrors, DoctorFormValues, usualWeekLines(), WEEKDAY_NAMES, addDays(), MONTHS (+22 more)

### Community 118 - "authService.ts"
Cohesion: 0.17
Nodes (12): LoginPageProps, AppShellProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, computePrivileges(), MASTER_ADMIN_EMAIL, UserPrivileges, UserProfile (+4 more)

### Community 119 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.12
Nodes (14): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, ClinicRoster, Development (+6 more)

### Community 120 - "16. History of work (for context)"
Cohesion: 0.08
Nodes (56): 13. Screens in detail, 16. History of work (for context), isPhoneSize(), Switch(), AllRequestsPanel(), Draft, KindFilter, STATUS (+48 more)

### Community 121 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 122 - "approvedDayOff.test.ts"
Cohesion: 0.25
Nodes (6): DR, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 123 - "leaveGuard.ts"
Cohesion: 0.43
Nodes (6): addLeaveGuard(), Guard, guards, isChanged(), leaveReason(), rebaseDraft()

### Community 124 - "IRepository.ts"
Cohesion: 0.16
Nodes (18): FirebaseClientConfig, SubscribeCallback, Unsubscribe, listPage(), Page, pageFromList(), PageRequest, assertScheduleRangeAvailable() (+10 more)

### Community 125 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 126 - "ref_node_assert"
Cohesion: 0.07
Nodes (19): CapacityJob, Edge, futureCapacity(), MONTHS, suggestRosterName(), LATE, nurse, AL (+11 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "colorContrast.ts"
Cohesion: 0.50
Nodes (6): contrastRatio(), INK, INK_MUTED, luminance(), rgbOf(), tint()

### Community 129 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 130 - "dayView.test.ts"
Cohesion: 0.25
Nodes (6): amy, LEE, lookups, mary, nina, shift

### Community 131 - "my-requests.cjs"
Cohesion: 0.20
Nodes (7): args, { chromium }, args, { chromium }, args, { chromium }, t()

### Community 133 - "ui/index.ts"
Cohesion: 0.08
Nodes (42): LocalModeBannerProps, PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, ButtonProps, ButtonSize (+34 more)

### Community 134 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 136 - "CellEditorDialog.tsx"
Cohesion: 0.53
Nodes (5): CellChoice, CellEditorDialog(), choiceClass(), withDr(), AssignmentKind

### Community 155 - "SENIOR"
Cohesion: 0.07
Nodes (17): ScheduleValidator, check(), nurse, nurse2, schedule, SENIOR, DR_PEDS, ENT (+9 more)

### Community 157 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

## Knowledge Gaps
- **1017 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1012 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1245 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SchedulesView.tsx` to `ExportModal.tsx`, `rowsInSteps.ts`, `nurseRosterService.ts`, `ui/index.ts`, `getRepository`, `GridTable.tsx`, `CellEditorDialog.tsx`, `package.json`, `WorkbookGrid.tsx`, `DashboardView.tsx`, `seedRunner.ts`, `FairnessModal.tsx`, `NurseSample.tsx`, `Button`, `App.tsx`, `access.ts`, `PlannerSample.tsx`, `ui.tsx`, `Sidebar.tsx`, `fixtures.ts`, `Nurse`, `Assignment`, `lucide-react`, `AppShell.tsx`, `dialogs.tsx`, `explainCell.ts`, `ClinicContextState`, `RosterToolbar.tsx`, `PublishedRosterView.tsx`, `GridSelection`, `gridSelection.ts`, `harness/main.tsx`, `gridKeys.test.ts`, `HistoryView.tsx`, `authService.ts`, `16. History of work (for context)`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `ExportModal.tsx`, `nurseRosterService.ts`, `ui/index.ts`, `getRepository`, `GridTable.tsx`, `CellEditorDialog.tsx`, `package.json`, `WorkbookGrid.tsx`, `DashboardView.tsx`, `seedRunner.ts`, `FairnessModal.tsx`, `NurseSample.tsx`, `Button`, `App.tsx`, `access.ts`, `PlannerSample.tsx`, `ui.tsx`, `Sidebar.tsx`, `SchedulesView.tsx`, `Nurse`, `Assignment`, `AppShell.tsx`, `dialogs.tsx`, `explainCell.ts`, `RosterToolbar.tsx`, `PublishedRosterView.tsx`, `gridSelection.ts`, `harness/main.tsx`, `HistoryView.tsx`, `authService.ts`, `16. History of work (for context)`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `ExportModal.tsx`, `rowsInSteps.ts`, `nurseRosterService.ts`, `SchedulingEngine.ts`, `colorContrast.ts`, `ui/index.ts`, `getRepository`, `GridTable.tsx`, `CellEditorDialog.tsx`, `WorkbookGrid.tsx`, `seedRunner.ts`, `Button`, `access.ts`, `checkScheduler.test.ts`, `Sidebar.tsx`, `SchedulesView.tsx`, `Nurse`, `EntityForCollection`, `resumePublish.ts`, `Assignment`, `lucide-react`, `AppShell.tsx`, `dialogs.tsx`, `explainCell.ts`, `ClinicContextState`, `RosterToolbar.tsx`, `apiApp.ts`, `PublishedRosterView.tsx`, `cellView.ts`, `GridSelection`, `gridSelection.ts`, `FirestoreRepository`, `types/index.ts`, `firestoreRest.ts`, `gridKeys.test.ts`, `dateDefaults.ts`, `address.ts`, `HistoryView.tsx`, `peopleImport.ts`, `NSC Clinic Roster: complete project guide`, `leaveGuard.ts`, `IRepository.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Are the 126 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 126 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1017 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06656426011264721 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08034061458718993 - nodes in this community are weakly interconnected._