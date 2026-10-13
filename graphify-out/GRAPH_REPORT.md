# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 306 files · ~360,817 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 4, (none) 3, .example 1)

## Summary
- 2432 nodes · 7769 edges · 128 communities (118 shown, 10 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 293 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4c046985`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- analysisExportService.ts
- clinicModel.test.ts
- PublishModal.tsx
- react
- notify
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- AvailabilityView.tsx
- App.tsx
- CollectionSyncer
- FirestoreRepository.ts
- makeNurse
- firebaseIdentityService.ts
- SchedulesView.tsx
- compilerOptions
- savingSafety.test.ts
- getRepository
- GridRow.tsx
- devDependencies
- nurseRosterService.ts
- HistoryView.tsx
- IRepository
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- engineRules.test.ts
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- icsExportService.ts
- WorkbookGrid.tsx
- hoursTopUp.test.ts
- Optimization Patterns
- cellView.test.ts
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- ui.tsx
- firestore-rules/package.json
- yearToDate.ts
- NSC Clinic Roster: complete project guide
- dialogs.tsx
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- guide-with-code.mjs
- Incremental Implementation
- RulesTab.tsx
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
- hoursBalance.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- emailService.ts
- published-rules.mjs
- createApiApp
- Button.tsx
- Design system: NSC Clinic Roster
- README.md
- hoursRules.test.ts
- weekHours.test.ts
- handMoves.test.ts
- uiComponents.test.ts
- links.cjs
- ClinicContextState
- types/index.ts
- fixtures.ts
- ui/index.ts
- grid-timing.cjs
- UI overhaul: summary and next steps
- address.ts
- navigation.ts
- apiApp.ts
- hoursAccounting.ts
- harness/main.tsx
- DoctorsView.tsx
- handMoveChecks.ts
- Finish a change
- lastResort.test.ts
- 16. History of work (for context)
- dateUtils.ts
- context7
- DoctorsScheduleSheet.tsx
- firestore-rules-reviewer.md
- ref_node_assert
- firebase-mcp.sh
- NurseTimesheetModal.tsx
- start.sh
- stop.sh
- ClinicRoster
- nurseClinicFloat.test.ts
- index.tsx
- usePresence.ts
- colorContrast.ts
- UI overhaul: checklist
- devDependencies
- emailLogSize.ts
- IRepository.ts
- createLiveReconciler
- explainCell.test.ts
- EmailTab.tsx
- fakeAuth.ts
- WhoCanCover.tsx
- weekHours.ts
- teamRoster.test.ts
- CreateScheduleModal.tsx
- plain-english-reviewer.md
- ask-before-main.mjs
- ddmmyyyy
- shiftMoves.ts

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 103 edges
2. `getRepository()` - 95 edges
3. `react` - 94 edges
4. `Nurse` - 87 edges
5. `Schedule` - 86 edges
6. `DutyWindow` - 83 edges
7. `lucide-react` - 77 edges
8. `useDialogA11y()` - 74 edges
9. `Doctor` - 73 edges
10. `notify()` - 69 edges

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

## Communities (128 total, 10 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.14
Nodes (65): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+57 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (24): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+16 more)

### Community 2 - "analysisExportService.ts"
Cohesion: 0.08
Nodes (53): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+45 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "PublishModal.tsx"
Cohesion: 0.18
Nodes (22): Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), ensureNurseLink(), nurseLinkUrl() (+14 more)

### Community 5 - "react"
Cohesion: 0.12
Nodes (28): lucide-react, react, uuid, LoginPageProps, NoticeTone, signOutSafely(), openStack, useDialogA11y() (+20 more)

### Community 6 - "notify"
Cohesion: 0.12
Nodes (45): useAppContext(), confirmDialog(), notify(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTab(), DatabaseTabProps (+37 more)

### Community 7 - "authService"
Cohesion: 0.05
Nodes (17): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs() (+9 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.17
Nodes (22): 4. Navigation and app shell, AppShell(), bootstrap(), AppShellProps, AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+14 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.11
Nodes (37): 10. Hours, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+29 more)

### Community 14 - "App.tsx"
Cohesion: 0.15
Nodes (13): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+5 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.11
Nodes (11): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+3 more)

### Community 16 - "FirestoreRepository.ts"
Cohesion: 0.30
Nodes (12): FirebaseClientConfig, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap() (+4 more)

### Community 17 - "makeNurse"
Cohesion: 0.12
Nodes (23): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+15 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.13
Nodes (20): jose, authMiddleware(), AuthUser, Express, requireOwner, ROLE_HIERARCHY, verifyToken(), AccessRecordFields (+12 more)

### Community 19 - "SchedulesView.tsx"
Cohesion: 0.21
Nodes (17): MenuButton(), MenuButtonProps, MenuItem, SwapManagerModal(), readStoredScheduleId(), SchedulesView(), storeScheduleId(), CoverageSheet() (+9 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "savingSafety.test.ts"
Cohesion: 0.14
Nodes (8): clearYearToDateCache(), queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, apps, { initializeTestEnvironment }, requireRules

### Community 22 - "getRepository"
Cohesion: 0.26
Nodes (15): ShareModal(), TabType, NurseSelfServicePanel(), ensurePublicRosters(), pick(), removePublicRoster(), syncPublicRoster(), getRepository() (+7 more)

### Community 23 - "GridRow.tsx"
Cohesion: 0.09
Nodes (22): GridCell, GridCellActions, GridCellProps, fmtHours(), GridRow, GridRowActions, hoursDisplay(), PROBLEM_SEPARATOR (+14 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "nurseRosterService.ts"
Cohesion: 0.12
Nodes (32): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+24 more)

### Community 26 - "HistoryView.tsx"
Cohesion: 0.12
Nodes (25): DeleteScheduleModal(), DeleteVersionModal(), DeleteVersionModalProps, ShareModalProps, CHANGE_LABELS, VersionCompareModal(), SOURCE_LABELS, VersionViewModal() (+17 more)

### Community 27 - "IRepository"
Cohesion: 0.10
Nodes (27): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments(), repositoryManager (+19 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.10
Nodes (50): 6. Clinic model (the business rules in plain English), 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+42 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "data.ts"
Cohesion: 0.11
Nodes (22): Cell, dayLabel(), DAYS, DOCTORS, LEAVE, Nurse, NURSES, parse() (+14 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.11
Nodes (14): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, nurse() (+6 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "icsExportService.ts"
Cohesion: 0.13
Nodes (22): RFC-5545, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine() (+14 more)

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.08
Nodes (44): cellLookupsOf(), CellView, cellViewOf(), fmtHours(), reuseCellViews(), sameView(), SOURCE_WORDS, specialtyMatches() (+36 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "cellView.test.ts"
Cohesion: 0.18
Nodes (9): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+1 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.15
Nodes (12): duties, first, goal8(), history, long, nurse, p8, periods (+4 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.15
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 46 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.20
Nodes (9): @firebase/rules-unit-testing, firebase-tools, description, firebase, name, private, scripts, test (+1 more)

### Community 48 - "yearToDate.ts"
Cohesion: 0.13
Nodes (22): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+14 more)

### Community 49 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.15
Nodes (12): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), Entry points (+4 more)

### Community 50 - "dialogs.tsx"
Cohesion: 0.20
Nodes (12): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+4 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "guide-with-code.mjs"
Cohesion: 0.13
Nodes (7): command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() }, builtServer, __dirname, __filename

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

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
Cohesion: 0.50
Nodes (3): Always, with every change (owner's standing instruction), graphify, NSC Clinic Roster

### Community 65 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "hoursBalance.ts"
Cohesion: 0.10
Nodes (33): askedCarry(), closePeriod(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE, nurseContractShare() (+25 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval) (+12 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "emailService.ts"
Cohesion: 0.17
Nodes (13): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+5 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 73 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 74 - "Button.tsx"
Cohesion: 0.17
Nodes (14): LocalModeBanner(), LocalModeBannerProps, Button(), ButtonProps, ButtonSize, ButtonVariant, IconButton(), IconButtonProps (+6 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (12): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+4 more)

### Community 77 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 78 - "weekHours.test.ts"
Cohesion: 0.15
Nodes (6): ScheduleValidator, EARLY, LATE, shifts, LONG, OCT

### Community 79 - "handMoves.test.ts"
Cohesion: 0.12
Nodes (13): AGREED_EXCEPTION_NOTE, AMY, BEA, CARA, DAN, DOCTORS, DUTIES, EARLY (+5 more)

### Community 80 - "uiComponents.test.ts"
Cohesion: 0.20
Nodes (12): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, nextTabIndex(), TabItem (+4 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "ClinicContextState"
Cohesion: 0.16
Nodes (15): AppContext, AppContextValue, AvailabilityViewProps, DashboardViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps (+7 more)

### Community 83 - "types/index.ts"
Cohesion: 0.07
Nodes (30): isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, BlockWeeks, DoctorSessionSource, EmailLogKind, EmailLogStatus, Invitation (+22 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.08
Nodes (26): 15. Tests, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift() (+18 more)

### Community 85 - "ui/index.ts"
Cohesion: 0.14
Nodes (26): Card(), Crumb, PageHeader(), cx(), Column, DataTable(), SortDirection, sortRows() (+18 more)

### Community 86 - "grid-timing.cjs"
Cohesion: 0.20
Nodes (6): { chromium }, args, { chromium }, { chromium }, median(), once()

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 89 - "navigation.ts"
Cohesion: 0.16
Nodes (15): 3. Users, roles and access, APP_NAME, SCREEN_NAMES, NAV_ITEMS, SidebarProps, AccountMenu(), TopBar(), TopBarProps (+7 more)

### Community 90 - "apiApp.ts"
Cohesion: 0.14
Nodes (14): express, express-rate-limit, helmet, BackendRole, authRouter, calendarRouter, geminiRouter, GEMINI_MODEL (+6 more)

### Community 91 - "hoursAccounting.ts"
Cohesion: 0.21
Nodes (13): NurseTimesheetModalProps, SortField, TabMode, HoursPart, NurseHoursBalance, calculateClinicHoursMetrics(), ClinicHoursMetrics, contractShare (+5 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "DoctorsView.tsx"
Cohesion: 0.14
Nodes (24): DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, DoctorsView(), WEEKDAY_NAMES, InternalSlot, doctorFromDate(), missingPatternSessions() (+16 more)

### Community 94 - "handMoveChecks.ts"
Cohesion: 0.38
Nodes (11): Other engine files, FairnessModal(), listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings(), rebalancedFields() (+3 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 97 - "16. History of work (for context)"
Cohesion: 0.44
Nodes (8): 16. History of work (for context), addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 98 - "dateUtils.ts"
Cohesion: 0.17
Nodes (12): ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, FindingCategory, FindingSeverity, ValidationFinding (+4 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "DoctorsScheduleSheet.tsx"
Cohesion: 0.36
Nodes (9): 13. Screens in detail, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), getWeekdayFromIsoDate(), saveDoctorShift() (+1 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "ref_node_assert"
Cohesion: 0.08
Nodes (16): BACKUPS_KEPT, ctx(), EARLY, LATE, LATE, nurse, DR_PCC, DR_PEDS (+8 more)

### Community 104 - "NurseTimesheetModal.tsx"
Cohesion: 0.22
Nodes (14): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), AuditTrailViewProps, ReportsView() (+6 more)

### Community 107 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 108 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 109 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 110 - "usePresence.ts"
Cohesion: 0.29
Nodes (6): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 111 - "colorContrast.ts"
Cohesion: 0.50
Nodes (7): contrastRatio(), INK, INK_MUTED, luminance(), readableTextOn(), rgbOf(), tint()

### Community 112 - "UI overhaul: checklist"
Cohesion: 0.17
Nodes (11): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs (+3 more)

### Community 113 - "devDependencies"
Cohesion: 0.50
Nodes (4): devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools

### Community 114 - "emailLogSize.ts"
Cohesion: 0.39
Nodes (5): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), EmailRecipientLog

### Community 115 - "IRepository.ts"
Cohesion: 0.32
Nodes (3): SubscribeCallback, Unsubscribe, ScheduleDeleteResult

### Community 116 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 117 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 118 - "EmailTab.tsx"
Cohesion: 0.18
Nodes (15): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+7 more)

### Community 119 - "fakeAuth.ts"
Cohesion: 0.29
Nodes (4): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Things that went wrong before

### Community 120 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 121 - "weekHours.ts"
Cohesion: 0.52
Nodes (6): addDays(), fitsWeekHours(), heaviestWeekAround(), over(), WeekHours, weeksOverLimit()

### Community 122 - "teamRoster.test.ts"
Cohesion: 0.29
Nodes (5): nurses, published, refs, schedule, today

### Community 123 - "CreateScheduleModal.tsx"
Cohesion: 0.40
Nodes (7): CreateScheduleModal(), CreateScheduleModalProps, generateDoctorSessionsForDateRange(), addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 125 - "ask-before-main.mjs"
Cohesion: 0.50
Nodes (4): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }

### Community 126 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

## Knowledge Gaps
- **834 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+829 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1019 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `DashboardView.tsx`, `analysisExportService.ts`, `PublishModal.tsx`, `notify`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `SchedulesView.tsx`, `getRepository`, `GridRow.tsx`, `nurseRosterService.ts`, `HistoryView.tsx`, `PlannerSample.tsx`, `data.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `NSC Clinic Roster: complete project guide`, `dialogs.tsx`, `RulesTab.tsx`, `Button.tsx`, `Design system: NSC Clinic Roster`, `uiComponents.test.ts`, `ClinicContextState`, `fixtures.ts`, `ui/index.ts`, `navigation.ts`, `hoursAccounting.ts`, `harness/main.tsx`, `DoctorsView.tsx`, `dateUtils.ts`, `DoctorsScheduleSheet.tsx`, `NurseTimesheetModal.tsx`, `usePresence.ts`, `EmailTab.tsx`, `WhoCanCover.tsx`, `CreateScheduleModal.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `DashboardView.tsx`, `analysisExportService.ts`, `PublishModal.tsx`, `notify`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `SchedulesView.tsx`, `getRepository`, `GridRow.tsx`, `nurseRosterService.ts`, `HistoryView.tsx`, `PlannerSample.tsx`, `data.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `dialogs.tsx`, `RulesTab.tsx`, `Button.tsx`, `uiComponents.test.ts`, `ui/index.ts`, `navigation.ts`, `hoursAccounting.ts`, `harness/main.tsx`, `DoctorsView.tsx`, `dateUtils.ts`, `DoctorsScheduleSheet.tsx`, `NurseTimesheetModal.tsx`, `EmailTab.tsx`, `CreateScheduleModal.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `authService` connect `authService` to `Assignment`, `DashboardView.tsx`, `PublishModal.tsx`, `react`, `notify`, `NurseTimesheetModal.tsx`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `usePresence.ts`, `SchedulesView.tsx`, `getRepository`, `fakeAuth.ts`, `EmailTab.tsx`, `navigation.ts`, `CreateScheduleModal.tsx`, `nurseRosterService.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _834 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.14456140350877192 - nodes in this community are weakly interconnected._
- **Should `analysisExportService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07978142076502732 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._