# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 333 files · ~373,231 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2558 nodes · 8211 edges · 125 communities (115 shown, 10 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 340 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `601b361c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DashboardView.tsx
- DataTable.tsx
- clinicModel.test.ts
- PublishView.tsx
- react
- getRepository
- authService
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- AvailabilityView.tsx
- PublishedRosterView.tsx
- CollectionSyncer
- IRepository.ts
- makeNurse
- firebaseIdentityService.ts
- weekHours.test.ts
- compilerOptions
- yearToDate.ts
- published-rules.mjs
- GridTable.tsx
- devDependencies
- nurseRosterService.ts
- NurseTimesheetModal.tsx
- nurseRoster.test.ts
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- lucide-react
- Hardening Controls
- seedRunner.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- explainCell.test.ts
- WorkbookGrid.tsx
- emailService.ts
- Optimization Patterns
- analysisExport.test.ts
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- EntityForCollection
- HistoryView.tsx
- firestore-rules/package.json
- yearSeed.ts
- checkScheduler.test.ts
- ClinicRoster
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- quotaTracker
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
- 17. Known quirks and ideas for later
- guide-with-code.mjs
- apiApp.ts
- Rules
- Design system: NSC Clinic Roster
- README.md
- UI overhaul: checklist
- engineRules.test.ts
- handMoves.test.ts
- analysisExportService.ts
- links.cjs
- ClinicContextState
- types/index.ts
- fixtures.ts
- uiComponents.test.ts
- grid-timing.cjs
- UI overhaul: summary and next steps
- authService.ts
- ShareModal.tsx
- geminiApi.test.ts
- ref_node_assert
- harness/main.tsx
- collectionSyncer.ts
- WarningsSheet.tsx
- Finish a change
- Rules
- ui/index.ts
- scheduleTransactions.test.ts
- context7
- DoctorsView.tsx
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- SchedulesView.tsx
- start.sh
- stop.sh
- Rules
- nurseClinicFloat.test.ts
- versionRestore.ts
- LiveCollectionCache
- sharing.test.ts
- IRepository
- devDependencies
- fakeAuth.ts
- address.ts
- colorContrast.ts
- holidayLeave.ts
- EmailTab.tsx
- hoursRules.test.ts
- createLiveReconciler
- weekend.ts
- plain-english-reviewer.md
- middleware/auth.ts
- 16. History of work (for context)

## God Nodes (most connected - your core abstractions)
1. `react` - 111 edges
2. `Assignment` - 110 edges
3. `getRepository()` - 95 edges
4. `Nurse` - 94 edges
5. `Schedule` - 92 edges
6. `DutyWindow` - 88 edges
7. `lucide-react` - 85 edges
8. `useDialogA11y()` - 78 edges
9. `Doctor` - 77 edges
10. `LeaveEntry` - 71 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `16. History of work (for context)` --references--> `ProblemMark`  [INFERRED]
  PROJECT_GUIDE.md → src/components/workbook/grid/GridTable.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts

## Import Cycles
- None detected.

## Communities (125 total, 10 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.13
Nodes (73): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+65 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.19
Nodes (17): useAppContext(), Card(), DashboardView(), loadPlannerData(), longDate(), PlannerData, readStoredId(), TodayList() (+9 more)

### Community 2 - "DataTable.tsx"
Cohesion: 0.33
Nodes (6): Column, DataTable(), SortDirection, sortRows(), SortState, Phase 6: Nurses, Doctors, Availability and Requests (planner screens)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "PublishView.tsx"
Cohesion: 0.18
Nodes (19): EmailHtmlPreview(), PublishModal(), PublishTab, PublishView(), ensureNurseLink(), newToken(), nurseLinkUrl(), regenerateNurseLink() (+11 more)

### Community 5 - "react"
Cohesion: 0.09
Nodes (32): react, openStack, useDialogA11y(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), DeleteVersionModalProps, DoctorWeekChangeDialog() (+24 more)

### Community 6 - "getRepository"
Cohesion: 0.12
Nodes (47): confirmDialog(), notify(), TemplateModal(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTab(), DatabaseTabProps (+39 more)

### Community 7 - "authService"
Cohesion: 0.08
Nodes (14): authService, computePrivileges(), getAppAuth(), getAppFirestore(), getFirebaseApp(), othersOnRoster(), samePeople(), STALE_MS (+6 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.11
Nodes (34): 4. Navigation and app shell, PageLoading(), AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+26 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.11
Nodes (38): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+30 more)

### Community 14 - "PublishedRosterView.tsx"
Cohesion: 0.19
Nodes (19): RFC-5545, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, buildNurseIcs(), buildNurseRosterIcs(), downloadIcsFile(), escapeIcsText() (+11 more)

### Community 16 - "IRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 17 - "makeNurse"
Cohesion: 0.10
Nodes (26): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+18 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.13
Nodes (20): jose, verifyToken(), calendarRouter, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig (+12 more)

### Community 19 - "weekHours.test.ts"
Cohesion: 0.10
Nodes (11): ScheduleValidator, DR_PEDS, ENT, FULL, PEDS, RULES, EARLY, LATE (+3 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.13
Nodes (15): clearYearToDateCache(), earlierRostersThisYear(), emptyCounts(), forgetCachedRoster(), latestPublishedVersion(), loadEarlierRosters(), LoadedRoster, loadPublishedRoster() (+7 more)

### Community 22 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 23 - "GridTable.tsx"
Cohesion: 0.07
Nodes (35): CellView, DayTotal, GridCell, GridCellActions, GridCellProps, fmtHours(), GridRow, GridRowActions (+27 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "nurseRosterService.ts"
Cohesion: 0.15
Nodes (25): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+17 more)

### Community 26 - "NurseTimesheetModal.tsx"
Cohesion: 0.23
Nodes (14): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView(), exportRosterToCsvLong() (+6 more)

### Community 27 - "nurseRoster.test.ts"
Cohesion: 0.15
Nodes (15): loadViewerData(), buildNurseRosterDoc(), latestPublishedVersions(), shiftDetail(), syncNurseRosters(), todayIso(), base, dutyWindows (+7 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (57): 6. Clinic model (the business rules in plain English), 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+49 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.06
Nodes (82): Cell, countOf(), dayLabel(), dayProblems(), DAYS, ddmmyyyy(), DOCTORS, LEAVE (+74 more)

### Community 31 - "lucide-react"
Cohesion: 0.18
Nodes (15): lucide-react, uuid, ConfirmOptions, DialogState, dismissNotice(), listeners, Notice, NoticeTone (+7 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "seedRunner.ts"
Cohesion: 0.16
Nodes (16): toScheduleRange(), ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase(), ClearResult, DatabaseStats, downloadFullDatabaseBackup() (+8 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.15
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.09
Nodes (37): CellContextMenu(), CellChoice, CellEditorDialog(), withDr(), cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews() (+29 more)

### Community 39 - "emailService.ts"
Cohesion: 0.20
Nodes (12): nodemailer, emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult (+4 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "analysisExport.test.ts"
Cohesion: 0.09
Nodes (23): 15. Tests, CellDay, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE (+15 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.15
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "EntityForCollection"
Cohesion: 0.29
Nodes (3): FirestoreRepository, sanitizePayload(), EntityForCollection

### Community 46 - "HistoryView.tsx"
Cohesion: 0.19
Nodes (13): CHANGE_LABELS, SOURCE_LABELS, VersionViewModal(), WEEKDAY_NAMES, WEEKDAY_NAMES, AssignmentDiffItem, ChangeType, computeScheduleDiff() (+5 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.20
Nodes (9): @firebase/rules-unit-testing, firebase-tools, description, firebase, name, private, scripts, test (+1 more)

### Community 48 - "yearSeed.ts"
Cohesion: 0.29
Nodes (7): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds()

### Community 49 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 50 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "quotaTracker"
Cohesion: 0.11
Nodes (10): FirebaseConfig, googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter (+2 more)

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
Cohesion: 0.10
Nodes (30): NurseTimesheetModalProps, SortField, TabMode, askedCarry(), closePeriod(), HoursPart, HoursSchedule, Leftover (+22 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+12 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "17. Known quirks and ideas for later"
Cohesion: 0.50
Nodes (3): 17. Known quirks and ideas for later, WalkthroughModal(), WalkthroughModalProps

### Community 72 - "guide-with-code.mjs"
Cohesion: 0.10
Nodes (11): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+3 more)

### Community 73 - "apiApp.ts"
Cohesion: 0.17
Nodes (12): repoRoot, swaps, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp() (+4 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.13
Nodes (14): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+6 more)

### Community 77 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 78 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 79 - "handMoves.test.ts"
Cohesion: 0.06
Nodes (42): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps (+34 more)

### Community 80 - "analysisExportService.ts"
Cohesion: 0.08
Nodes (52): jspdf, jspdf-autotable, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift(), isLateDuty() (+44 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "ClinicContextState"
Cohesion: 0.13
Nodes (20): AppContext, AppContextValue, signOutSafely(), AccountMenu(), TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps (+12 more)

### Community 83 - "types/index.ts"
Cohesion: 0.06
Nodes (37): isPairing(), PREFERENCE_FOCUS_LABELS, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), ApprovalStatus, AuditAction (+29 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.12
Nodes (13): ANNUAL_LEAVE, DAY_DUTY, SENIOR, UNPAID_LEAVE, LONG, NOV, OCT, OCT (+5 more)

### Community 85 - "uiComponents.test.ts"
Cohesion: 0.20
Nodes (12): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, nextTabIndex(), TabItem (+4 more)

### Community 86 - "grid-timing.cjs"
Cohesion: 0.20
Nodes (6): { chromium }, args, { chromium }, { chromium }, median(), once()

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "authService.ts"
Cohesion: 0.27
Nodes (9): LoginPageProps, AppShellProps, AuthModalProps, AccessManagementPanelProps, MASTER_ADMIN_EMAIL, UserPrivileges, UserProfile, UserAccessRecord (+1 more)

### Community 89 - "ShareModal.tsx"
Cohesion: 0.25
Nodes (11): 3. Users, roles and access, ShareModal(), TabType, canApproveRequests(), canEditClinicData(), canExportReports(), permissionsFor(), roleLabel() (+3 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.16
Nodes (11): express, BackendRole, authRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights() (+3 more)

### Community 91 - "ref_node_assert"
Cohesion: 0.12
Nodes (8): BACKUPS_KEPT, diff(), LATE, nurse, base, october, octoberVersion, september

### Community 92 - "harness/main.tsx"
Cohesion: 0.05
Nodes (22): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+14 more)

### Community 93 - "collectionSyncer.ts"
Cohesion: 0.21
Nodes (10): Desired, fingerprint(), Known, planSync(), SyncPlan, changedLists(), sameItems(), Phase 3: roster grid speed and structure (+2 more)

### Community 94 - "WarningsSheet.tsx"
Cohesion: 0.24
Nodes (10): ProblemsPanel(), ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheet(), WarningsSheetProps, FindingSeverity (+2 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "ui/index.ts"
Cohesion: 0.15
Nodes (19): Button(), ButtonProps, ButtonSize, ButtonVariant, IconButtonProps, SIZES, VARIANTS, Card() (+11 more)

### Community 98 - "scheduleTransactions.test.ts"
Cohesion: 0.20
Nodes (8): nurse(), Steps, apps, { initializeTestEnvironment }, planner(), requireRules, history(), nurses()

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "DoctorsView.tsx"
Cohesion: 0.08
Nodes (46): CreateScheduleModal(), CreateScheduleModalProps, WeekChangePreview, DoctorsView(), WEEKDAY_NAMES, InternalSlot, earlierPeriodTotals(), shiftIsoDate() (+38 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "SchedulesView.tsx"
Cohesion: 0.10
Nodes (30): MenuButton(), MenuButtonProps, MenuItem, useLatestCallback(), SwapManagerModal(), FillDialog(), FillDialogProps, FillRange (+22 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 109 - "versionRestore.ts"
Cohesion: 0.31
Nodes (4): VersionRestoreResult, saveHolidayLeave(), fingerprint(), syncScheduleAssignments()

### Community 111 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 112 - "IRepository"
Cohesion: 0.13
Nodes (14): FairnessModal(), daysBefore(), loadClinicSetup(), loadYearToDate(), saveRosterBackup(), restoreVersion(), countedEarlierRosters(), loadHoursHistory() (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.50
Nodes (4): devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools

### Community 114 - "fakeAuth.ts"
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 115 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 116 - "colorContrast.ts"
Cohesion: 0.50
Nodes (7): contrastRatio(), INK, INK_MUTED, luminance(), readableTextOn(), rgbOf(), tint()

### Community 117 - "holidayLeave.ts"
Cohesion: 0.19
Nodes (15): 0. Quick start for a new chat, 10. Hours, 14. Server, security and config, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, applyHolidayChangeToLeave(), DatedLeave (+7 more)

### Community 118 - "EmailTab.tsx"
Cohesion: 0.14
Nodes (18): 12. Publishing and nurse links, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse (+10 more)

### Community 119 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 120 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 121 - "weekend.ts"
Cohesion: 0.50
Nodes (4): currentWeekendDays, DEFAULT_WEEKEND_DAYS, loadStoredWeekendDays(), sanitize()

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 125 - "middleware/auth.ts"
Cohesion: 0.18
Nodes (10): AuthUser, Express, Request, requireOwner, requirePlanner, ROLE_HIERARCHY, emailRouter, isGoogleAccountEmail() (+2 more)

### Community 133 - "16. History of work (for context)"
Cohesion: 0.24
Nodes (14): 16. History of work (for context), cx(), Checkbox(), DateInput(), Field(), FieldInputProps, Input(), inputClass (+6 more)

## Knowledge Gaps
- **876 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+871 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1070 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `DashboardView.tsx`, `DataTable.tsx`, `PublishView.tsx`, `16. History of work (for context)`, `getRepository`, `authService`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `PublishedRosterView.tsx`, `GridTable.tsx`, `nurseRosterService.ts`, `NurseTimesheetModal.tsx`, `PlannerSample.tsx`, `lucide-react`, `WorkbookGrid.tsx`, `HistoryView.tsx`, `RulesTab.tsx`, `hoursBalance.ts`, `17. Known quirks and ideas for later`, `Design system: NSC Clinic Roster`, `handMoves.test.ts`, `analysisExportService.ts`, `ClinicContextState`, `fixtures.ts`, `uiComponents.test.ts`, `authService.ts`, `ShareModal.tsx`, `harness/main.tsx`, `WarningsSheet.tsx`, `ui/index.ts`, `DoctorsView.tsx`, `SchedulesView.tsx`, `EmailTab.tsx`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `Assignment`, `DashboardView.tsx`, `DataTable.tsx`, `PublishView.tsx`, `react`, `16. History of work (for context)`, `getRepository`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `PublishedRosterView.tsx`, `GridTable.tsx`, `nurseRosterService.ts`, `NurseTimesheetModal.tsx`, `PlannerSample.tsx`, `WorkbookGrid.tsx`, `HistoryView.tsx`, `RulesTab.tsx`, `hoursBalance.ts`, `analysisExportService.ts`, `ClinicContextState`, `uiComponents.test.ts`, `authService.ts`, `ShareModal.tsx`, `harness/main.tsx`, `WarningsSheet.tsx`, `ui/index.ts`, `DoctorsView.tsx`, `SchedulesView.tsx`, `EmailTab.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _876 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.1325848703555199 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.09371980676328502 - nodes in this community are weakly interconnected._