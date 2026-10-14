# Graph Report - NSC-Clinic-Roster  (2026-10-14)

## Corpus Check
- 361 files · ~401,691 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2717 nodes · 8775 edges · 137 communities (125 shown, 12 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 389 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3a14758d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- emailService.ts
- hoursBalance.ts
- clinicModel.test.ts
- nurseRosterService.ts
- handMoveChecks.ts
- notify
- authService
- ui-audit.cjs
- package.json
- ClinicContextState
- dependencies
- Test-Driven Development
- gridSelection.ts
- savingSafety.test.ts
- CollectionSyncer
- GridTable.tsx
- nurseClinicFloat.test.ts
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- yearToDate.ts
- App.tsx
- apiApp.ts
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
- NurseSelfServicePanel.tsx
- PublishModal.tsx
- Optimization Patterns
- cellView.test.ts
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- EntityForCollection
- hoursAccounting.ts
- firestore-rules/package.json
- getRepository
- WhoCanCover.tsx
- UI overhaul: checklist
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
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
- cellView.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- authService.ts
- Rules
- Design system: NSC Clinic Roster
- README.md
- FirestoreRepository.ts
- engineRules.test.ts
- grid-keys.cjs
- analysisExportService.ts
- links.cjs
- icsExportService.ts
- types/index.ts
- makeNurse
- TopBar.tsx
- ref_playwright
- UI overhaul: summary and next steps
- geminiApi.test.ts
- PublishedRosterView.tsx
- DashboardView.tsx
- Phases
- harness/main.tsx
- Handover for a new chat
- MyRosterView.tsx
- Finish a change
- Rules
- RulesTab.tsx
- SchedulesView.tsx
- context7
- doctorScheduleService.ts
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- ref_node_assert
- start.sh
- stop.sh
- Rules
- 16. History of work (for context)
- LiveCollectionCache
- WorkbookGrid.tsx
- sharing.test.ts
- IRepository
- RosterGrid
- explainCell.test.ts
- analysisExport.test.ts
- quotaTracker
- lastResort.test.ts
- HistoryView.tsx
- holidayLeave.ts
- WorkingHoursPeriodsPanel.tsx
- usePresence.ts
- weekHours.test.ts
- firestoreRest.ts
- Sidebar.tsx
- colorContrast.ts
- weekHours.ts
- grid-timing.cjs
- NSC Clinic Roster: complete project guide
- fakeAuth.ts
- 12. Publishing and nurse links
- my-requests.cjs
- plain-english-reviewer.md
- ui/index.ts
- EmailTab.tsx
- address.ts
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
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts

## Import Cycles
- None detected.

## Communities (137 total, 12 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.15
Nodes (64): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+56 more)

### Community 1 - "emailService.ts"
Cohesion: 0.24
Nodes (9): nodemailer, emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, ServerEmailConfig, SMTP_CONNECTION_KEYS (+1 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (36): BlockedShift, explainNurseDay(), ExplainNurseDayInput, plainReason(), PossibleShift, requestOn(), round1(), shiftDate() (+28 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.16
Nodes (19): AuthService, Things that went wrong before, PublishView(), addDaysIso(), BuildNurseRosterInput, buildTeamRosterSheet(), ensureNurseLink(), newToken() (+11 more)

### Community 5 - "handMoveChecks.ts"
Cohesion: 0.35
Nodes (11): Other engine files, listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings(), rebalancedFields(), suggestMoves() (+3 more)

### Community 6 - "notify"
Cohesion: 0.09
Nodes (56): useAppContext(), ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners (+48 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (24): repoRoot, swaps, firebase, name, private, type, version, autoprefixer (+16 more)

### Community 10 - "ClinicContextState"
Cohesion: 0.10
Nodes (25): AppContext, AppContextValue, TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+17 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "gridSelection.ts"
Cohesion: 0.11
Nodes (22): CELL_FLASH, CELL_POPUP, CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN, isRosterCell(), keyOf() (+14 more)

### Community 14 - "savingSafety.test.ts"
Cohesion: 0.08
Nodes (19): Desired, fingerprint(), Known, planSync(), SyncPlan, createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue (+11 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.15
Nodes (3): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer

### Community 16 - "GridTable.tsx"
Cohesion: 0.11
Nodes (27): CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps (+19 more)

### Community 17 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (16): jose, AuthUser, verifyToken(), AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig (+8 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.11
Nodes (25): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+17 more)

### Community 22 - "App.tsx"
Cohesion: 0.15
Nodes (12): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps (+4 more)

### Community 23 - "apiApp.ts"
Cohesion: 0.13
Nodes (16): express, express-rate-limit, helmet, vite, createApiApp(), startServer(), authMiddleware(), BackendRole (+8 more)

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
Cohesion: 0.12
Nodes (20): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, isGoogleAccountEmail(), SendEmailPayload, SendEmailResult (+12 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (53): 7. Rules, FillDialogProps, RosterToolbarProps, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate() (+45 more)

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
Nodes (29): lucide-react, react, uuid, openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModal(), DeleteScheduleModalProps (+21 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "fixtures.ts"
Cohesion: 0.09
Nodes (22): 15. Tests, ANNUAL_LEAVE, DAY_DUTY, makeLeave(), UNPAID_LEAVE, LONG, NOV, OCT (+14 more)

### Community 38 - "NurseSelfServicePanel.tsx"
Cohesion: 0.15
Nodes (22): DateInput(), Field(), wholeDates(), NurseSelfServicePanel(), STATUS, useFocusFirstError(), checkDayRequest(), checkLeaveRequest() (+14 more)

### Community 39 - "PublishModal.tsx"
Cohesion: 0.16
Nodes (22): Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes() (+14 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "cellView.test.ts"
Cohesion: 0.17
Nodes (10): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+2 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "EntityForCollection"
Cohesion: 0.32
Nodes (3): FirestoreRepository, sanitizePayload(), EntityForCollection

### Community 46 - "hoursAccounting.ts"
Cohesion: 0.16
Nodes (25): usePermissions(), fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, ReportsView(), SortField (+17 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "getRepository"
Cohesion: 0.12
Nodes (36): 13. Screens in detail, 3. Users, roles and access, NoticeTone, ShareModal(), TabType, AllRequestsPanel(), Draft, KindFilter (+28 more)

### Community 49 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 50 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.18
Nodes (21): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+13 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "handMoves.test.ts"
Cohesion: 0.11
Nodes (14): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+6 more)

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

### Community 68 - "cellView.ts"
Cohesion: 0.10
Nodes (34): DayProblem, DayRow, dayViewOf(), firstDayShown(), isPhoneSize(), KIND, ORDER, RosterDayView() (+26 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.17
Nodes (11): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+3 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "authService.ts"
Cohesion: 0.17
Nodes (14): signOutSafely(), AppShellProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, canExportReports(), permissionsFor() (+6 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.17
Nodes (11): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+3 more)

### Community 77 - "FirestoreRepository.ts"
Cohesion: 0.14
Nodes (17): FirebaseClientConfig, CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict() (+9 more)

### Community 78 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 80 - "analysisExportService.ts"
Cohesion: 0.08
Nodes (53): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+45 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 83 - "types/index.ts"
Cohesion: 0.06
Nodes (31): PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditAction, AuditEvent, BlockWeeks, DoctorSessionSource, EmailLogKind, EmailLogStatus (+23 more)

### Community 84 - "makeNurse"
Cohesion: 0.12
Nodes (22): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+14 more)

### Community 85 - "TopBar.tsx"
Cohesion: 0.24
Nodes (9): react-dom, AccountMenu(), TopBar(), ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), roleLabel() (+1 more)

### Community 86 - "ref_playwright"
Cohesion: 0.13
Nodes (9): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 89 - "PublishedRosterView.tsx"
Cohesion: 0.19
Nodes (14): DeleteVersionModalProps, ShareModalProps, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile(), withoutBackups(), ensurePublicRosters() (+6 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.21
Nodes (19): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+11 more)

### Community 91 - "Phases"
Cohesion: 0.22
Nodes (9): Phase 0: setup (right after approval), Phase 1: quick fixes and safety, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, and request decision emails, Phase 6: Nurses, Doctors, Availability and Requests (planner screens), Phase 7: publishing, History and all dialogs, Phase 8: Settings, Reports, Audit, Phase 9: tidy up and final audit (+1 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 94 - "MyRosterView.tsx"
Cohesion: 0.21
Nodes (14): dateLabel(), PublishedRosterSheet(), LoadState, MyRosterView(), MyRosterViewProps, MyDay, myShiftDays(), dayMonth() (+6 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

### Community 98 - "SchedulesView.tsx"
Cohesion: 0.08
Nodes (41): useLatestCallback(), FairnessModal(), SwapManagerModal(), TemplateModal(), VersionCompareModal(), PHONE_QUERY, FillDialog(), FillRange (+33 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "doctorScheduleService.ts"
Cohesion: 0.12
Nodes (31): CreateScheduleModal(), CreateScheduleModalProps, EditDoctorShiftModal(), TIME_PRESETS, DoctorsView(), DoctorsScheduleSheet(), WEEKDAY_ABBR, WorkingHoursCalculationResult (+23 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "ref_node_assert"
Cohesion: 0.08
Nodes (17): BACKUPS_KEPT, addDays(), iso(), monthEnd(), suggestNewRosterDates(), diff(), LATE, nurse (+9 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "16. History of work (for context)"
Cohesion: 0.14
Nodes (19): 16. History of work (for context), PublicMessage(), PublicPageFrame(), AcknowledgePage(), AcknowledgePageProps, DayColumn, ProblemMark, nextRowLimit() (+11 more)

### Community 110 - "WorkbookGrid.tsx"
Cohesion: 0.16
Nodes (15): CellChoice, CellEditorDialog(), withDr(), findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption (+7 more)

### Community 111 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 112 - "IRepository"
Cohesion: 0.09
Nodes (30): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), removePublicRoster(), fingerprint(), syncScheduleAssignments() (+22 more)

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 114 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 115 - "analysisExport.test.ts"
Cohesion: 0.15
Nodes (12): ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift() (+4 more)

### Community 116 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 117 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 118 - "HistoryView.tsx"
Cohesion: 0.23
Nodes (10): CHANGE_LABELS, WEEKDAY_NAMES, FLOAT_ROLE_ID, AssignmentDiffItem, ChangeType, computeScheduleDiff(), formatAssignment(), FormattedAssignmentState (+2 more)

### Community 119 - "holidayLeave.ts"
Cohesion: 0.23
Nodes (11): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+3 more)

### Community 120 - "WorkingHoursPeriodsPanel.tsx"
Cohesion: 0.31
Nodes (10): WorkingHoursPeriodsPanel(), calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown, SEED_CLINIC_PROFILE (+2 more)

### Community 121 - "usePresence.ts"
Cohesion: 0.29
Nodes (7): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 122 - "weekHours.test.ts"
Cohesion: 0.10
Nodes (10): ScheduleValidator, SENIOR, LATE, schedule, wishFindings(), EARLY, LATE, shifts (+2 more)

### Community 123 - "firestoreRest.ts"
Cohesion: 0.39
Nodes (7): calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument()

### Community 124 - "Sidebar.tsx"
Cohesion: 0.39
Nodes (6): APP_NAME, SCREEN_NAMES, NAV_ITEMS, SidebarProps, DashboardViewProps, AppRoute

### Community 125 - "colorContrast.ts"
Cohesion: 0.50
Nodes (7): contrastRatio(), INK, INK_MUTED, luminance(), readableTextOn(), rgbOf(), tint()

### Community 126 - "weekHours.ts"
Cohesion: 0.52
Nodes (6): addDays(), fitsWeekHours(), heaviestWeekAround(), over(), WeekHours, weeksOverLimit()

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.05
Nodes (34): nurse(), Browser check, Steps, 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout (+26 more)

### Community 130 - "12. Publishing and nurse links"
Cohesion: 0.60
Nodes (3): 12. Publishing and nurse links, RosterPublishService, safeColor()

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 132 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 133 - "ui/index.ts"
Cohesion: 0.08
Nodes (49): LocalModeBanner(), LocalModeBannerProps, Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES (+41 more)

### Community 135 - "EmailTab.tsx"
Cohesion: 0.19
Nodes (14): EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse (+6 more)

### Community 136 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

## Knowledge Gaps
- **930 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+925 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1133 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `NSC Clinic Roster: complete project guide`, `ui/index.ts`, `notify`, `EmailTab.tsx`, `package.json`, `ClinicContextState`, `gridSelection.ts`, `GridTable.tsx`, `NurseSample.tsx`, `App.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `fixtures.ts`, `NurseSelfServicePanel.tsx`, `PublishModal.tsx`, `hoursAccounting.ts`, `getRepository`, `WhoCanCover.tsx`, `AppShell.tsx`, `cellView.ts`, `authService.ts`, `analysisExportService.ts`, `TopBar.tsx`, `PublishedRosterView.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `RulesTab.tsx`, `SchedulesView.tsx`, `doctorScheduleService.ts`, `16. History of work (for context)`, `WorkbookGrid.tsx`, `HistoryView.tsx`, `WorkingHoursPeriodsPanel.tsx`, `usePresence.ts`, `Sidebar.tsx`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `ui/index.ts`, `notify`, `EmailTab.tsx`, `package.json`, `GridTable.tsx`, `NurseSample.tsx`, `App.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `NurseSelfServicePanel.tsx`, `PublishModal.tsx`, `hoursAccounting.ts`, `getRepository`, `AppShell.tsx`, `cellView.ts`, `authService.ts`, `analysisExportService.ts`, `TopBar.tsx`, `PublishedRosterView.tsx`, `DashboardView.tsx`, `harness/main.tsx`, `MyRosterView.tsx`, `RulesTab.tsx`, `SchedulesView.tsx`, `doctorScheduleService.ts`, `16. History of work (for context)`, `WorkbookGrid.tsx`, `HistoryView.tsx`, `WorkingHoursPeriodsPanel.tsx`, `Sidebar.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `Assignment`, `NSC Clinic Roster: complete project guide`, `ui/index.ts`, `notify`, `address.ts`, `ClinicContextState`, `gridSelection.ts`, `savingSafety.test.ts`, `GridTable.tsx`, `RosterToolbar.tsx`, `SchedulingEngine.ts`, `react`, `NurseSelfServicePanel.tsx`, `EntityForCollection`, `hoursAccounting.ts`, `getRepository`, `AppShell.tsx`, `cellView.ts`, `authService.ts`, `TopBar.tsx`, `MyRosterView.tsx`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `IRepository`, `RosterGrid`, `usePresence.ts`, `firestoreRest.ts`, `colorContrast.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _930 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09851551956815115 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `notify` be split into smaller, more focused modules?**
  _Cohesion score 0.0886615515771526 - nodes in this community are weakly interconnected._