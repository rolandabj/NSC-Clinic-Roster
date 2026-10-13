# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 313 files · ~366,444 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2494 nodes · 7879 edges · 127 communities (117 shown, 10 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 308 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d8e693c2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- ExportModal.tsx
- clinicModel.test.ts
- PublishModal.tsx
- dialogs.tsx
- notify
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- getRepository
- App.tsx
- CollectionSyncer
- seedRunner.ts
- makeNurse
- firebaseIdentityService.ts
- MenuButton.tsx
- compilerOptions
- IRepository.ts
- assignmentChecks.ts
- GridRow.tsx
- devDependencies
- MyRosterView.tsx
- SchedulesView.tsx
- IRepository
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- cellView.ts
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- icsExportService.ts
- WorkbookGrid.tsx
- ref_node_assert
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
- SettingsView.tsx
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- authService.ts
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
- SENIOR
- published-rules.mjs
- createApiApp
- Rules
- Design system: NSC Clinic Roster
- README.md
- editSaving.test.ts
- engineRules.test.ts
- handMoves.test.ts
- uiComponents.test.ts
- links.cjs
- ClinicContextState
- types/index.ts
- fixtures.ts
- ui/index.ts
- grid-timing.cjs
- UI overhaul: summary and next steps
- analysisExportService.ts
- access.ts
- apiApp.ts
- handMoveChecks.ts
- harness/main.tsx
- LiveCollectionCache
- address.ts
- Finish a change
- Rules
- 16. History of work (for context)
- SchedulesView
- context7
- DoctorsView.tsx
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- hoursAccounting.ts
- start.sh
- stop.sh
- Rules
- nurseClinicFloat.test.ts
- index.tsx
- Sidebar.tsx
- rosterSaving.test.ts
- colorContrast.ts
- devDependencies
- teamRoster.test.ts
- checkScheduler.test.ts
- createLiveReconciler
- holidayLeave.ts
- EmailTab.tsx
- PublishedRosterSheet.tsx
- analysisExport.test.ts
- ScheduleValidator.ts
- usePresence.ts
- repository/index.ts
- plain-english-reviewer.md
- DataTable.tsx
- ddmmyyyy

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 106 edges
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
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts
- `Colours` --references--> `readableTextOn()`  [INFERRED]
  design-system/nsc-clinic-roster/MASTER.md → src/utils/colorContrast.ts

## Import Cycles
- None detected.

## Communities (127 total, 10 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.16
Nodes (58): 5. Data model (Firestore collections), EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap, PublishModalProps (+50 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.20
Nodes (15): bootstrap(), Card(), DashboardView(), loadPlannerData(), longDate(), PlannerData, readStoredId(), TodayList() (+7 more)

### Community 2 - "ExportModal.tsx"
Cohesion: 0.10
Nodes (38): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+30 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "PublishModal.tsx"
Cohesion: 0.09
Nodes (37): Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), EMAIL_LOG_HTML_BUDGET, encoder (+29 more)

### Community 5 - "dialogs.tsx"
Cohesion: 0.19
Nodes (11): ConfirmOptions, DialogState, dismissNotice(), listeners, Notice, PendingConfirm, setState(), settleConfirm() (+3 more)

### Community 6 - "notify"
Cohesion: 0.15
Nodes (31): confirmDialog(), notify(), BulkImportModal(), TemplateModal(), NursesView(), DatabaseTabProps, DutiesTab(), DutiesTabProps (+23 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.17
Nodes (20): AppShell(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView, PublishedRosterView (+12 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "getRepository"
Cohesion: 0.13
Nodes (37): AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf(), WEEKDAYS (+29 more)

### Community 14 - "App.tsx"
Cohesion: 0.10
Nodes (19): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps (+11 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.16
Nodes (3): 11. Saving, live updates, versions, CollectionSyncer, EntityForCollection

### Community 16 - "seedRunner.ts"
Cohesion: 0.15
Nodes (21): FirebaseClientConfig, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap() (+13 more)

### Community 17 - "makeNurse"
Cohesion: 0.18
Nodes (14): hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account(), doctorOfAmy() (+6 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.11
Nodes (23): jose, authMiddleware(), AuthUser, Express, requireOwner, requirePlanner, ROLE_HIERARCHY, verifyToken() (+15 more)

### Community 19 - "MenuButton.tsx"
Cohesion: 0.50
Nodes (3): MenuButton(), MenuButtonProps, MenuItem

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "IRepository.ts"
Cohesion: 0.09
Nodes (15): Desired, fingerprint(), Known, SyncPlan, SubscribeCallback, Unsubscribe, queuesByRepo, RETRY_EVERY_MS (+7 more)

### Community 22 - "assignmentChecks.ts"
Cohesion: 0.11
Nodes (25): 6. Clinic model (the business rules in plain English), checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+17 more)

### Community 23 - "GridRow.tsx"
Cohesion: 0.08
Nodes (25): CellView, GridCell, GridCellActions, GridCellProps, fmtHours(), GridRow, GridRowActions, GridRowProps (+17 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "MyRosterView.tsx"
Cohesion: 0.24
Nodes (14): DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps, shortDate(), downloadIcsFile() (+6 more)

### Community 26 - "SchedulesView.tsx"
Cohesion: 0.11
Nodes (36): lucide-react, react, uuid, NoticeTone, openStack, useDialogA11y(), CreateScheduleModalProps, DeleteScheduleModal() (+28 more)

### Community 27 - "IRepository"
Cohesion: 0.12
Nodes (19): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), removePublicRoster(), fingerprint(), syncScheduleAssignments() (+11 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.11
Nodes (28): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, ClinicSetup, DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes(), hoursToCover() (+20 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "cellView.ts"
Cohesion: 0.17
Nodes (18): cellViewOf(), fmtHours(), reuseCellViews(), sameView(), SOURCE_WORDS, specialtyMatches(), withDr(), describeRequest() (+10 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "data.ts"
Cohesion: 0.11
Nodes (22): Cell, dayLabel(), DAYS, DOCTORS, LEAVE, Nurse, NURSES, parse() (+14 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.09
Nodes (18): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, clone(), FirestoreRepository, Listener, MemoryRepo, repo (+10 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "icsExportService.ts"
Cohesion: 0.13
Nodes (22): RFC-5545, calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText() (+14 more)

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.10
Nodes (31): cellLookupsOf(), DayTotal, dayTotalsOf(), findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption (+23 more)

### Community 39 - "ref_node_assert"
Cohesion: 0.08
Nodes (17): ctx(), EARLY, LATE, diff(), LATE, nurse, DAY_DUTY, CARD (+9 more)

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
Cohesion: 0.15
Nodes (20): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), clearYearToDateCache() (+12 more)

### Community 49 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.11
Nodes (16): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, ClinicRoster, Development (+8 more)

### Community 50 - "SettingsView.tsx"
Cohesion: 0.16
Nodes (22): AccessManagementPanel(), ClinicTab(), ClinicTabProps, SaveStatus, SettingsTab, WEEKDAY_NAMES, SettingsView(), WorkingHoursPeriodsPanel() (+14 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "authService.ts"
Cohesion: 0.13
Nodes (10): FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider, testFirestoreConnection(), nextQuotaResetMs(), QuotaExceededError (+2 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.15
Nodes (18): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+10 more)

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

### Community 68 - "hoursBalance.ts"
Cohesion: 0.16
Nodes (22): askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS, MAX_CATCH_UP_SHARE (+14 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval) (+12 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "SENIOR"
Cohesion: 0.09
Nodes (13): ScheduleValidator, SENIOR, DR_PEDS, ENT, FULL, PEDS, RULES, LATE (+5 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.13
Nodes (14): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+6 more)

### Community 77 - "editSaving.test.ts"
Cohesion: 0.12
Nodes (16): planSync(), changedLists(), sameItems(), Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility (+8 more)

### Community 78 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 79 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (21): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+13 more)

### Community 80 - "uiComponents.test.ts"
Cohesion: 0.20
Nodes (12): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, nextTabIndex(), TabItem (+4 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "ClinicContextState"
Cohesion: 0.13
Nodes (20): AppContext, AppContextValue, AuthModalProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps (+12 more)

### Community 83 - "types/index.ts"
Cohesion: 0.10
Nodes (23): PREFERENCE_FOCUS_LABELS, ApprovalStatus, BlockWeeks, DoctorSessionSource, EmailLogKind, EmailLogStatus, Invitation, InvitationStatus (+15 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.11
Nodes (14): ANNUAL_LEAVE, UNPAID_LEAVE, LONG, NOV, OCT, D, E, L (+6 more)

### Community 85 - "ui/index.ts"
Cohesion: 0.15
Nodes (19): Button(), ButtonProps, ButtonSize, ButtonVariant, IconButtonProps, SIZES, VARIANTS, Card() (+11 more)

### Community 86 - "grid-timing.cjs"
Cohesion: 0.20
Nodes (6): { chromium }, args, { chromium }, { chromium }, median(), once()

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "analysisExportService.ts"
Cohesion: 0.17
Nodes (18): resolveClinicSetup(), uncoveredParts(), isPendingLeave(), isLateDuty(), ANALYSIS_FORMAT_VERSION, analysisFileName(), buildRosterAnalysis(), countBy() (+10 more)

### Community 89 - "access.ts"
Cohesion: 0.28
Nodes (11): 3. Users, roles and access, 4. Navigation and app shell, AccountMenu(), TopBar(), TopBarProps, canAccessRoute(), canEditClinicData(), canExportReports() (+3 more)

### Community 90 - "apiApp.ts"
Cohesion: 0.16
Nodes (12): express, @google/genai, BackendRole, authRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions (+4 more)

### Community 91 - "handMoveChecks.ts"
Cohesion: 0.26
Nodes (15): Other engine files, FairnessModal(), SwapManagerModal(), listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings() (+7 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 94 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "16. History of work (for context)"
Cohesion: 0.24
Nodes (14): 16. History of work (for context), cx(), Checkbox(), DateInput(), Field(), FieldInputProps, Input(), inputClass (+6 more)

### Community 98 - "SchedulesView"
Cohesion: 0.13
Nodes (21): readStoredScheduleId(), SchedulesView(), storeScheduleId(), CoverageSheet(), HolidayDayOffPicker(), HolidayDayOffPickerProps, LeaveAndLocksSheet(), ProblemsPanel() (+13 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "DoctorsView.tsx"
Cohesion: 0.09
Nodes (42): 13. Screens in detail, CreateScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal(), DoctorsView(), WEEKDAY_NAMES (+34 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "hoursAccounting.ts"
Cohesion: 0.10
Nodes (33): usePermissions(), BulkImportModalProps, fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, AuditTrailView() (+25 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 109 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 110 - "Sidebar.tsx"
Cohesion: 0.36
Nodes (7): APP_NAME, SCREEN_NAMES, screenTitle(), NAV_ITEMS, SidebarProps, DashboardViewProps, AppRoute

### Community 111 - "rosterSaving.test.ts"
Cohesion: 0.11
Nodes (11): SchedulingEngine, DOCTOR, handEdit, leave(), DR_PCC, DR_PEDS, FULL, NINE_SEVEN (+3 more)

### Community 112 - "colorContrast.ts"
Cohesion: 0.50
Nodes (7): contrastRatio(), INK, INK_MUTED, luminance(), readableTextOn(), rgbOf(), tint()

### Community 113 - "devDependencies"
Cohesion: 0.50
Nodes (4): devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools

### Community 114 - "teamRoster.test.ts"
Cohesion: 0.26
Nodes (13): loadViewerData(), addDaysIso(), buildNurseRosterDoc(), buildTeamRosterSheet(), latestPublishedVersions(), shiftDetail(), syncNurseRosters(), todayIso() (+5 more)

### Community 115 - "checkScheduler.test.ts"
Cohesion: 0.23
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler(), history()

### Community 116 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 117 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 118 - "EmailTab.tsx"
Cohesion: 0.10
Nodes (27): nodemailer, emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult (+19 more)

### Community 119 - "PublishedRosterSheet.tsx"
Cohesion: 0.31
Nodes (8): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), PublishedRosterView(), loadPublishedRoster(), loadPublicRoster(), escapeHtml(), safeColor()

### Community 120 - "analysisExport.test.ts"
Cohesion: 0.13
Nodes (16): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+8 more)

### Community 121 - "ScheduleValidator.ts"
Cohesion: 0.14
Nodes (27): 7. Rules, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay() (+19 more)

### Community 122 - "usePresence.ts"
Cohesion: 0.29
Nodes (6): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 123 - "repository/index.ts"
Cohesion: 0.43
Nodes (5): useAppContext(), DatabaseTab(), defaultFirebaseConfig, StorageMode, getDatabaseStatistics()

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 125 - "DataTable.tsx"
Cohesion: 0.33
Nodes (6): Column, DataTable(), SortDirection, sortRows(), SortState, Phase 6: Nurses, Doctors, Availability and Requests (planner screens)

### Community 126 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

## Knowledge Gaps
- **867 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+862 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1059 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SchedulesView.tsx` to `Assignment`, `DashboardView.tsx`, `ExportModal.tsx`, `PublishModal.tsx`, `dialogs.tsx`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `MenuButton.tsx`, `GridRow.tsx`, `MyRosterView.tsx`, `PlannerSample.tsx`, `data.ts`, `WorkbookGrid.tsx`, `ref_node_assert`, `ui.tsx`, `NSC Clinic Roster: complete project guide`, `SettingsView.tsx`, `RulesTab.tsx`, `Design system: NSC Clinic Roster`, `uiComponents.test.ts`, `ClinicContextState`, `types/index.ts`, `ui/index.ts`, `access.ts`, `harness/main.tsx`, `16. History of work (for context)`, `SchedulesView`, `DoctorsView.tsx`, `hoursAccounting.ts`, `Sidebar.tsx`, `EmailTab.tsx`, `PublishedRosterSheet.tsx`, `ScheduleValidator.ts`, `usePresence.ts`, `repository/index.ts`, `DataTable.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `SchedulesView.tsx` to `Assignment`, `DashboardView.tsx`, `ExportModal.tsx`, `PublishModal.tsx`, `dialogs.tsx`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `GridRow.tsx`, `MyRosterView.tsx`, `PlannerSample.tsx`, `data.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `SettingsView.tsx`, `RulesTab.tsx`, `uiComponents.test.ts`, `ClinicContextState`, `types/index.ts`, `ui/index.ts`, `access.ts`, `harness/main.tsx`, `16. History of work (for context)`, `SchedulesView`, `DoctorsView.tsx`, `hoursAccounting.ts`, `Sidebar.tsx`, `EmailTab.tsx`, `PublishedRosterSheet.tsx`, `repository/index.ts`, `DataTable.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `useDialogA11y()` connect `SchedulesView.tsx` to `Assignment`, `ExportModal.tsx`, `PublishModal.tsx`, `dialogs.tsx`, `notify`, `AppShell.tsx`, `getRepository`, `WorkbookGrid.tsx`, `SettingsView.tsx`, `NSC Clinic Roster: UI review and overhaul in phases`, `Design system: NSC Clinic Roster`, `ClinicContextState`, `types/index.ts`, `ui/index.ts`, `access.ts`, `handMoveChecks.ts`, `16. History of work (for context)`, `SchedulesView`, `DoctorsView.tsx`, `hoursAccounting.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _867 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09745293466223699 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `PublishModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09219858156028368 - nodes in this community are weakly interconnected._