# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 360 files · ~398,757 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2708 nodes · 8763 edges · 136 communities (125 shown, 11 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 387 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9bf6ef3c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SchedulesView.tsx
- emailService.ts
- hoursBalance.ts
- clinicModel.test.ts
- nurseRosterService.ts
- handMoveChecks.ts
- getRepository
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- GridTable.tsx
- rosterSaveQueues.ts
- CollectionSyncer
- NurseSelfServicePanel.tsx
- nurseClinicFloat.test.ts
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- yearToDate.ts
- PublishedRosterView.tsx
- middleware/auth.ts
- devDependencies
- RosterToolbar.tsx
- quick reference
- decisionEmail.test.ts
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- react
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- fixtures.ts
- dayView.test.ts
- PublishModal.tsx
- Optimization Patterns
- makeNurse
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- ref_node_assert
- NurseTimesheetModal.tsx
- firestore-rules/package.json
- AvailabilityView.tsx
- WhoCanCover.tsx
- usePresence.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- seedRunner.ts
- Incremental Implementation
- handMoves.test.ts
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- approvedDayOff.test.ts
- Planning and Task Breakdown
- Find Skills
- WorkbookGrid.tsx
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- apiApp.ts
- Rules
- Design system: NSC Clinic Roster
- README.md
- UI overhaul: checklist
- engineRules.test.ts
- grid-keys.cjs
- analysisExportService.ts
- links.cjs
- icsExportService.ts
- types/index.ts
- makeSchedule
- RosterSheetTabs.tsx
- ref_playwright
- UI overhaul: summary and next steps
- weekHours.test.ts
- HistoryView.tsx
- editSaving.test.ts
- savingSafety.test.ts
- harness/main.tsx
- firestoreRest.ts
- MyRosterView.tsx
- Finish a change
- Rules
- RulesTab.tsx
- formatDate
- context7
- doctorScheduleService.ts
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- DashboardView.tsx
- start.sh
- stop.sh
- Rules
- checkScheduler.test.ts
- FirestoreRepository.ts
- createLiveReconciler
- sharing.test.ts
- IRepository
- RosterGrid
- cellView.test.ts
- 16. History of work (for context)
- authService.ts
- lastResort.test.ts
- FillDialog.tsx
- holidayLeave.ts
- access.ts
- ClinicRoster
- weekHours.ts
- scheduleTransactions.test.ts
- grid-timing.cjs
- NSC Clinic Roster: complete project guide
- fakeAuth.ts
- my-requests.cjs
- SchedulesView
- ui/index.ts
- ClinicTab.tsx
- authorizedFetch
- address.ts
- publicRosterService.ts
- usePhoneLayout.ts
- nurse-page.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 117 edges
2. `Assignment` - 113 edges
3. `Nurse` - 96 edges
4. `getRepository()` - 95 edges
5. `Schedule` - 92 edges
6. `16. History of work (for context)` - 91 edges
7. `lucide-react` - 89 edges
8. `DutyWindow` - 89 edges
9. `Doctor` - 78 edges
10. `useDialogA11y()` - 76 edges

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

## Communities (136 total, 11 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.15
Nodes (67): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+59 more)

### Community 1 - "emailService.ts"
Cohesion: 0.19
Nodes (12): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+4 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.09
Nodes (36): NurseTimesheetModalProps, SortField, TabMode, LeaveAndLocksSheet(), askedCarry(), closePeriod(), earlierPeriodTotals(), HoursPart (+28 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.12
Nodes (26): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), PublishedRosterView(), loadPublishedRoster(), downloadIcsFile(), addDaysIso(), BuildNurseRosterInput (+18 more)

### Community 5 - "handMoveChecks.ts"
Cohesion: 0.36
Nodes (11): Other engine files, SwapManagerModal(), listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings(), rebalancedFields() (+3 more)

### Community 6 - "getRepository"
Cohesion: 0.15
Nodes (38): confirmDialog(), notify(), TemplateModal(), AccessManagementPanel(), NursesView(), DatabaseTabProps, DutiesTab(), DutiesTabProps (+30 more)

### Community 7 - "authService"
Cohesion: 0.15
Nodes (3): authService, computePrivileges(), getAppAuth()

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): firebase, name, private, type, version, autoprefixer, cors, date-fns (+12 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.07
Nodes (50): 4. Navigation and app shell, react-dom, AppContext, AppContextValue, AppShell(), bootstrap(), AuditTrailView, AvailabilityView (+42 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "GridTable.tsx"
Cohesion: 0.06
Nodes (46): CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps (+38 more)

### Community 14 - "rosterSaveQueues.ts"
Cohesion: 0.24
Nodes (6): forgetCachedRoster(), afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS

### Community 16 - "NurseSelfServicePanel.tsx"
Cohesion: 0.14
Nodes (26): RosterDayView(), Badge(), ProblemBadge(), Button(), Dialog(), Notice(), wholeDates(), NurseSelfServicePanel() (+18 more)

### Community 17 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.19
Nodes (14): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+6 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.10
Nodes (31): FairnessModal(), YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), consecutiveLateRuleOf(), isLateDuty(), lateDutyThreshold() (+23 more)

### Community 22 - "PublishedRosterView.tsx"
Cohesion: 0.12
Nodes (17): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps (+9 more)

### Community 23 - "middleware/auth.ts"
Cohesion: 0.18
Nodes (9): express, authMiddleware(), AuthUser, BackendRole, Express, requireOwner, ROLE_HIERARCHY, verifyToken() (+1 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "RosterToolbar.tsx"
Cohesion: 0.30
Nodes (8): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar()

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.13
Nodes (19): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, DecidedRequest (+11 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (57): CoverageSheet(), checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+49 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "react"
Cohesion: 0.10
Nodes (33): lucide-react, react, ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners (+25 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.15
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "fixtures.ts"
Cohesion: 0.10
Nodes (19): ANNUAL_LEAVE, DAY_DUTY, makeLeave(), SENIOR, UNPAID_LEAVE, account(), LONG, NOV (+11 more)

### Community 38 - "dayView.test.ts"
Cohesion: 0.22
Nodes (7): isPhoneSize(), amy, LEE, lookups, mary, nina, shift

### Community 39 - "PublishModal.tsx"
Cohesion: 0.10
Nodes (37): Things that went wrong before, Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), PublishViewProps (+29 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "makeNurse"
Cohesion: 0.08
Nodes (22): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+14 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "ref_node_assert"
Cohesion: 0.11
Nodes (11): LATE, nurse, nurses, published, refs, schedule, today, emptyProps (+3 more)

### Community 46 - "NurseTimesheetModal.tsx"
Cohesion: 0.32
Nodes (10): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, ReportsView(), csvCell(), CsvValue (+2 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "AvailabilityView.tsx"
Cohesion: 0.13
Nodes (30): AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf(), WEEKDAYS (+22 more)

### Community 49 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 50 - "usePresence.ts"
Cohesion: 0.21
Nodes (9): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, frame, november (+1 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "seedRunner.ts"
Cohesion: 0.15
Nodes (17): DatabaseTab(), defaultFirebaseConfig, SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase() (+9 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "handMoves.test.ts"
Cohesion: 0.10
Nodes (16): uuid, AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN (+8 more)

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

### Community 65 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "WorkbookGrid.tsx"
Cohesion: 0.07
Nodes (48): 6. Clinic model (the business rules in plain English), DayProblem, DayRow, dayViewOf(), KIND, ORDER, CellContextMenu(), CellChoice (+40 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.15
Nodes (12): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+4 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "apiApp.ts"
Cohesion: 0.11
Nodes (20): repoRoot, swaps, express-rate-limit, @google/genai, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react (+12 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 78 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 80 - "analysisExportService.ts"
Cohesion: 0.08
Nodes (55): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, fmtHours() (+47 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 83 - "types/index.ts"
Cohesion: 0.06
Nodes (34): isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditAction, AuditEvent, BlockWeeks, DoctorSessionSource, EmailLogKind (+26 more)

### Community 84 - "makeSchedule"
Cohesion: 0.09
Nodes (22): SchedulingEngine, hoursOnlyRules(), makeSchedule(), LATE, run(), setup(), DOCTOR, generateAll() (+14 more)

### Community 85 - "RosterSheetTabs.tsx"
Cohesion: 0.43
Nodes (4): ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), render()

### Community 86 - "ref_playwright"
Cohesion: 0.13
Nodes (9): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "weekHours.test.ts"
Cohesion: 0.14
Nodes (7): ScheduleValidator, EARLY, LATE, restFindings(), shifts, LONG, OCT

### Community 89 - "HistoryView.tsx"
Cohesion: 0.15
Nodes (20): DeleteScheduleModal(), DeleteVersionModal(), DeleteVersionModalProps, ShareModalProps, CHANGE_LABELS, VersionCompareModal(), VersionViewModal(), HistoryView() (+12 more)

### Community 90 - "editSaving.test.ts"
Cohesion: 0.21
Nodes (9): 11. Saving, live updates, versions, useLatestCallback(), useRosterEdits(), planSync(), changedLists(), sameItems(), Phase 3: roster grid speed and structure, countedShift() (+1 more)

### Community 91 - "savingSafety.test.ts"
Cohesion: 0.21
Nodes (7): clearYearToDateCache(), Desired, fingerprint(), Known, SyncPlan, rebaseEdit(), CollectionName

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "firestoreRest.ts"
Cohesion: 0.39
Nodes (7): calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument()

### Community 94 - "MyRosterView.tsx"
Cohesion: 0.14
Nodes (16): LoadState, MyRosterView(), MyRosterViewProps, MyDay, myShiftDays(), NurseRosterDoc, NurseRosterShift, Phase 0: setup (right after approval) (+8 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

### Community 98 - "formatDate"
Cohesion: 0.10
Nodes (27): Report, What to check, What to look at, FillDialog(), ProblemCounts(), GridSelectionState, TOTALS_ROW, GridStatusBar() (+19 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "doctorScheduleService.ts"
Cohesion: 0.08
Nodes (44): 13. Screens in detail, CreateScheduleModal(), CreateScheduleModalProps, EditDoctorShiftModal(), TIME_PRESETS, DoctorsView(), DoctorsScheduleSheet(), WEEKDAY_ABBR (+36 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "DashboardView.tsx"
Cohesion: 0.20
Nodes (20): useAppContext(), Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList() (+12 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 109 - "FirestoreRepository.ts"
Cohesion: 0.07
Nodes (24): nextQuotaResetMs(), QuotaExceededError, quotaTracker, FirebaseClientConfig, FirestoreRepository, sanitizePayload(), SubscribeCallback, Unsubscribe (+16 more)

### Community 110 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 111 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 112 - "IRepository"
Cohesion: 0.13
Nodes (16): saveRosterBackup(), restoreVersion(), VersionRestoreResult, saveHolidayLeave(), removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments() (+8 more)

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 114 - "cellView.test.ts"
Cohesion: 0.18
Nodes (9): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+1 more)

### Community 115 - "16. History of work (for context)"
Cohesion: 0.25
Nodes (13): 16. History of work (for context), firstDayShown(), EmptyState(), ErrorState(), LoadingState(), addDays(), DateRange, defaultPatternRange() (+5 more)

### Community 116 - "authService.ts"
Cohesion: 0.14
Nodes (16): signOutSafely(), AppShellProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, MASTER_ADMIN_EMAIL, UserPrivileges (+8 more)

### Community 117 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 118 - "FillDialog.tsx"
Cohesion: 0.43
Nodes (6): FillDialogProps, FillRange, RosterToolbarProps, GenerationPreflightSummary, GenerationProgress, RegenerateMode

### Community 119 - "holidayLeave.ts"
Cohesion: 0.36
Nodes (9): 10. Hours, DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy(), withHolidaysAtZero() (+1 more)

### Community 120 - "access.ts"
Cohesion: 0.31
Nodes (9): 3. Users, roles and access, AccountMenu(), TopBar(), canAccessRoute(), canEditClinicData(), canExportReports(), permissionsFor(), roleLabel() (+1 more)

### Community 121 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 122 - "weekHours.ts"
Cohesion: 0.52
Nodes (6): addDays(), fitsWeekHours(), heaviestWeekAround(), over(), WeekHours, weeksOverLimit()

### Community 126 - "scheduleTransactions.test.ts"
Cohesion: 0.17
Nodes (9): nurse(), Browser check, Steps, apps, { initializeTestEnvironment }, planner(), requireRules, history() (+1 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.14
Nodes (12): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 7. Rules, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points (+4 more)

### Community 129 - "fakeAuth.ts"
Cohesion: 0.33
Nodes (3): AuthService, MASTER_ADMIN_EMAIL, PEOPLE

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 132 - "SchedulesView"
Cohesion: 0.23
Nodes (8): RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), readStoredScheduleId(), SchedulesView(), storeScheduleId(), base

### Community 133 - "ui/index.ts"
Cohesion: 0.10
Nodes (37): PROBLEM_MARKS, ProblemKind, Tone, TONE_CLASSES, ButtonProps, ButtonSize, ButtonVariant, IconButtonProps (+29 more)

### Community 134 - "ClinicTab.tsx"
Cohesion: 0.38
Nodes (6): ClinicTab(), ClinicTabProps, EmailTabProps, SaveStatus, WEEKDAY_NAMES, getWeekendDays()

### Community 135 - "authorizedFetch"
Cohesion: 0.31
Nodes (8): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload

### Community 136 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 137 - "publicRosterService.ts"
Cohesion: 0.40
Nodes (8): ShareModal(), TabType, ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), syncPublicRoster()

### Community 138 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

## Knowledge Gaps
- **926 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+921 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1128 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SchedulesView.tsx`, `NSC Clinic Roster: complete project guide`, `hoursBalance.ts`, `nurseRosterService.ts`, `SchedulesView`, `ui/index.ts`, `ClinicTab.tsx`, `getRepository`, `package.json`, `AppShell.tsx`, `publicRosterService.ts`, `usePhoneLayout.ts`, `GridTable.tsx`, `NurseSelfServicePanel.tsx`, `NurseSample.tsx`, `PublishedRosterView.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `PublishModal.tsx`, `ref_node_assert`, `NurseTimesheetModal.tsx`, `AvailabilityView.tsx`, `WhoCanCover.tsx`, `usePresence.ts`, `seedRunner.ts`, `WorkbookGrid.tsx`, `analysisExportService.ts`, `RosterSheetTabs.tsx`, `HistoryView.tsx`, `editSaving.test.ts`, `harness/main.tsx`, `MyRosterView.tsx`, `RulesTab.tsx`, `formatDate`, `doctorScheduleService.ts`, `DashboardView.tsx`, `16. History of work (for context)`, `authService.ts`, `FillDialog.tsx`, `access.ts`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `SchedulesView.tsx`, `hoursBalance.ts`, `nurseRosterService.ts`, `SchedulesView`, `ui/index.ts`, `ClinicTab.tsx`, `getRepository`, `package.json`, `AppShell.tsx`, `publicRosterService.ts`, `GridTable.tsx`, `NurseSelfServicePanel.tsx`, `NurseSample.tsx`, `PublishedRosterView.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `PublishModal.tsx`, `NurseTimesheetModal.tsx`, `AvailabilityView.tsx`, `seedRunner.ts`, `WorkbookGrid.tsx`, `analysisExportService.ts`, `RosterSheetTabs.tsx`, `HistoryView.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `RulesTab.tsx`, `formatDate`, `doctorScheduleService.ts`, `DashboardView.tsx`, `16. History of work (for context)`, `authService.ts`, `FillDialog.tsx`, `access.ts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `SchedulesView.tsx`, `NSC Clinic Roster: complete project guide`, `SchedulesView`, `ui/index.ts`, `getRepository`, `address.ts`, `publicRosterService.ts`, `usePhoneLayout.ts`, `AppShell.tsx`, `GridTable.tsx`, `NurseSelfServicePanel.tsx`, `PublishedRosterView.tsx`, `RosterToolbar.tsx`, `SchedulingEngine.ts`, `react`, `dayView.test.ts`, `NurseTimesheetModal.tsx`, `AvailabilityView.tsx`, `usePresence.ts`, `WorkbookGrid.tsx`, `Design system: NSC Clinic Roster`, `RosterSheetTabs.tsx`, `editSaving.test.ts`, `firestoreRest.ts`, `MyRosterView.tsx`, `formatDate`, `doctorScheduleService.ts`, `checkScheduler.test.ts`, `FirestoreRepository.ts`, `RosterGrid`, `access.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _926 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08974358974358974 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `nurseRosterService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1206896551724138 - nodes in this community are weakly interconnected._