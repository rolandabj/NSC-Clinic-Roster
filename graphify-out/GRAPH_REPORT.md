# Graph Report - NSC-Clinic-Roster  (2026-10-13)

## Corpus Check
- 311 files · ~364,304 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2483 nodes · 7846 edges · 127 communities (116 shown, 11 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 299 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bf22360d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SchedulesView.tsx
- DashboardView.tsx
- ExportModal.tsx
- clinicModel.test.ts
- PublishModal.tsx
- react
- notify
- authService.ts
- ui-audit.cjs
- package.json
- AppShell.tsx
- dependencies
- Test-Driven Development
- AvailabilityView.tsx
- App.tsx
- CollectionSyncer
- seedRunner.ts
- makeNurse
- firebaseIdentityService.ts
- Button
- compilerOptions
- savingSafety.test.ts
- assignmentChecks.ts
- GridRow.tsx
- devDependencies
- nurseRosterService.ts
- useDialogA11y
- IRepository
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- hoursPolicy.ts
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- icsExportService.ts
- WorkbookGrid.tsx
- published-rules.mjs
- Optimization Patterns
- cellView.test.ts
- continuousHours.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- ui.tsx
- firestore-rules/package.json
- FairnessModal.tsx
- NSC Clinic Roster: complete project guide
- WorkingHoursPeriodsPanel.tsx
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
- emailService.ts
- guide-with-code.mjs
- createApiApp
- Rules
- Design system: NSC Clinic Roster
- README.md
- UI overhaul: checklist
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
- middleware/auth.ts
- access.ts
- apiApp.ts
- scheduleTransactions.test.ts
- harness/main.tsx
- LiveCollectionCache
- address.ts
- Finish a change
- Rules
- 16. History of work (for context)
- formatDate
- context7
- doctorScheduleService.ts
- firestore-rules-reviewer.md
- ref_node_assert
- firebase-mcp.sh
- VersionCompareModal.tsx
- start.sh
- stop.sh
- Rules
- nurseClinicFloat.test.ts
- index.tsx
- Sidebar.tsx
- lastResort.test.ts
- colorContrast.ts
- devDependencies
- emailLogSize.ts
- getRepository
- createLiveReconciler
- QuickCellPopup.tsx
- EmailTab.tsx
- fakeAuth.ts
- explainCell.test.ts
- WhoCanCover.tsx
- repositoryManager
- newRosterDates.ts
- plain-english-reviewer.md
- navigation.ts
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
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts

## Import Cycles
- None detected.

## Communities (127 total, 11 thin omitted)

### Community 0 - "SchedulesView.tsx"
Cohesion: 0.12
Nodes (80): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NurseTimesheetModalProps, PublishModalProps, ShareModalProps (+72 more)

### Community 1 - "DashboardView.tsx"
Cohesion: 0.20
Nodes (20): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+12 more)

### Community 2 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (36): xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, ANALYSIS_FORMAT, analysisFileName(), downloadRosterAnalysis() (+28 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "PublishModal.tsx"
Cohesion: 0.16
Nodes (25): 12. Publishing and nurse links, Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), ensureNurseLink() (+17 more)

### Community 5 - "react"
Cohesion: 0.11
Nodes (28): lucide-react, react, uuid, ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, listeners (+20 more)

### Community 6 - "notify"
Cohesion: 0.11
Nodes (48): useAppContext(), confirmDialog(), dismissNotice(), notify(), setState(), AccessManagementPanel(), ClinicTab(), ClinicTabProps (+40 more)

### Community 7 - "authService.ts"
Cohesion: 0.11
Nodes (10): 3. Users, roles and access, authService, computePrivileges(), MASTER_ADMIN_EMAIL, UserPrivileges, FirebaseConfig, getAppAuth(), getAppFirestore() (+2 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.16
Nodes (22): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+14 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.13
Nodes (37): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+29 more)

### Community 14 - "App.tsx"
Cohesion: 0.10
Nodes (19): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps (+11 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.15
Nodes (4): 11. Saving, live updates, versions, saveHolidayLeave(), CollectionSyncer, EntityForCollection

### Community 16 - "seedRunner.ts"
Cohesion: 0.10
Nodes (26): FirebaseClientConfig, SubscribeCallback, Unsubscribe, ScheduleDeleteResult, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps() (+18 more)

### Community 17 - "makeNurse"
Cohesion: 0.13
Nodes (18): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+10 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "Button"
Cohesion: 0.27
Nodes (8): MenuButton(), MenuButtonProps, MenuItem, Button(), EmptyState(), ErrorState(), LoadingState(), Phase 2: design system and app shell

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "savingSafety.test.ts"
Cohesion: 0.14
Nodes (14): Desired, fingerprint(), Known, planSync(), SyncPlan, queuesByRepo, RETRY_EVERY_MS, STAMP_EVERY_MS (+6 more)

### Community 22 - "assignmentChecks.ts"
Cohesion: 0.16
Nodes (25): Other engine files, checkAssignment(), hardRule(), listProblem(), minutes(), restHoursBetween(), shiftDate(), checkSwap() (+17 more)

### Community 23 - "GridRow.tsx"
Cohesion: 0.09
Nodes (22): CellView, GridCell, GridCellActions, GridCellProps, fmtHours(), GridRow, GridRowActions, hoursDisplay() (+14 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "nurseRosterService.ts"
Cohesion: 0.12
Nodes (32): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+24 more)

### Community 26 - "useDialogA11y"
Cohesion: 0.13
Nodes (25): useDialogA11y(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), DeleteVersionModalProps, SwapManagerModal(), TemplateModal(), VersionCompareModal() (+17 more)

### Community 27 - "IRepository"
Cohesion: 0.13
Nodes (16): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments(), IRepository (+8 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.10
Nodes (48): 6. Clinic model (the business rules in plain English), 7. Rules, bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME (+40 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "hoursPolicy.ts"
Cohesion: 0.14
Nodes (20): LeaveAndLocksSheet(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), leaveCountingOnHoliday(), planHolidayLeaveTidy() (+12 more)

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
Cohesion: 0.14
Nodes (20): RFC-5545, calendarRouter, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact() (+12 more)

### Community 38 - "WorkbookGrid.tsx"
Cohesion: 0.11
Nodes (30): cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews(), sameView(), SOURCE_WORDS, specialtyMatches(), withDr() (+22 more)

### Community 39 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "cellView.test.ts"
Cohesion: 0.09
Nodes (20): 15. Tests, CellDay, input(), ctx(), EARLY, LATE, amy, CARDIOLOGY (+12 more)

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

### Community 48 - "FairnessModal.tsx"
Cohesion: 0.10
Nodes (31): FairnessModal(), NONE, NurseFairnessMetrics, ProposedSwap, YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup() (+23 more)

### Community 49 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.09
Nodes (20): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), Entry points (+12 more)

### Community 50 - "WorkingHoursPeriodsPanel.tsx"
Cohesion: 0.35
Nodes (8): WorkingHoursPeriodsPanel(), calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), PeriodProratingBreakdown, SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.14
Nodes (19): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+11 more)

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
Cohesion: 0.11
Nodes (38): 10. Hours, fmtHours(), HoursAccountingSheet(), BlockedShift, explainNurseDay(), ExplainNurseDayInput, plainReason(), PossibleShift (+30 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.10
Nodes (20): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval) (+12 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "emailService.ts"
Cohesion: 0.15
Nodes (16): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+8 more)

### Community 72 - "guide-with-code.mjs"
Cohesion: 0.10
Nodes (11): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+3 more)

### Community 73 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (12): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+4 more)

### Community 77 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 78 - "weekHours.test.ts"
Cohesion: 0.08
Nodes (11): ScheduleValidator, JUNIOR, LEVELS, NC, PHL, SENIOR, EARLY, LATE (+3 more)

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
Cohesion: 0.16
Nodes (15): AppContext, AppContextValue, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps (+7 more)

### Community 83 - "types/index.ts"
Cohesion: 0.06
Nodes (39): applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, othersOnRoster(), STALE_MS, TAB_ID, usePresence(), ApprovalStatus (+31 more)

### Community 84 - "fixtures.ts"
Cohesion: 0.11
Nodes (16): ANNUAL_LEAVE, DAY_DUTY, UNPAID_LEAVE, LONG, NOV, OCT, D, E (+8 more)

### Community 85 - "ui/index.ts"
Cohesion: 0.12
Nodes (31): ButtonProps, ButtonSize, ButtonVariant, IconButtonProps, SIZES, VARIANTS, Card(), Crumb (+23 more)

### Community 86 - "grid-timing.cjs"
Cohesion: 0.20
Nodes (6): { chromium }, args, { chromium }, { chromium }, median(), once()

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "middleware/auth.ts"
Cohesion: 0.18
Nodes (8): authMiddleware(), AuthUser, BackendRole, Express, requireOwner, ROLE_HIERARCHY, verifyToken(), authRouter

### Community 89 - "access.ts"
Cohesion: 0.29
Nodes (9): AccountMenu(), TopBar(), TopBarProps, canAccessRoute(), canEditClinicData(), canExportReports(), permissionsFor(), roleLabel() (+1 more)

### Community 90 - "apiApp.ts"
Cohesion: 0.20
Nodes (12): express, express-rate-limit, @google/genai, helmet, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions (+4 more)

### Community 91 - "scheduleTransactions.test.ts"
Cohesion: 0.22
Nodes (4): rosterSaveQueues, apps, { initializeTestEnvironment }, requireRules

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "LiveCollectionCache"
Cohesion: 0.17
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
Cohesion: 0.44
Nodes (8): 16. History of work (for context), addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 98 - "formatDate"
Cohesion: 0.14
Nodes (19): DateInput(), HolidayDayOffPicker(), HolidayDayOffPickerProps, ProblemsPanel(), ProblemsPanelProps, SEVERITY, CATEGORY_LABELS, SEVERITY_LABELS (+11 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "doctorScheduleService.ts"
Cohesion: 0.12
Nodes (28): CreateScheduleModal(), CreateScheduleModalProps, EditDoctorShiftModal(), TIME_PRESETS, DoctorsView(), DoctorsScheduleSheet(), WEEKDAY_ABBR, WorkingHoursCalculationResult (+20 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "ref_node_assert"
Cohesion: 0.07
Nodes (17): LATE, nurse, DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN (+9 more)

### Community 104 - "VersionCompareModal.tsx"
Cohesion: 0.17
Nodes (17): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, CHANGE_LABELS, AuditTrailView(), ReportsView() (+9 more)

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
Cohesion: 0.39
Nodes (6): APP_NAME, SCREEN_NAMES, NAV_ITEMS, SidebarProps, DashboardViewProps, AppRoute

### Community 111 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (16): AGREED_EXCEPTION_NOTE, isAgreedException(), isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS (+8 more)

### Community 112 - "colorContrast.ts"
Cohesion: 0.50
Nodes (7): contrastRatio(), INK, INK_MUTED, luminance(), readableTextOn(), rgbOf(), tint()

### Community 113 - "devDependencies"
Cohesion: 0.50
Nodes (4): devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools

### Community 114 - "emailLogSize.ts"
Cohesion: 0.39
Nodes (5): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), EmailRecipientLog

### Community 115 - "getRepository"
Cohesion: 0.57
Nodes (7): ShareModal(), TabType, ensurePublicRosters(), pick(), removePublicRoster(), syncPublicRoster(), getRepository()

### Community 116 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 117 - "QuickCellPopup.tsx"
Cohesion: 0.29
Nodes (7): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption

### Community 118 - "EmailTab.tsx"
Cohesion: 0.18
Nodes (14): EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse (+6 more)

### Community 119 - "fakeAuth.ts"
Cohesion: 0.29
Nodes (4): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Things that went wrong before

### Community 120 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 121 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 123 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 124 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 126 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

## Knowledge Gaps
- **867 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+862 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1056 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SchedulesView.tsx`, `DashboardView.tsx`, `ExportModal.tsx`, `PublishModal.tsx`, `notify`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `Button`, `GridRow.tsx`, `nurseRosterService.ts`, `useDialogA11y`, `PlannerSample.tsx`, `hoursPolicy.ts`, `data.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `FairnessModal.tsx`, `NSC Clinic Roster: complete project guide`, `WorkingHoursPeriodsPanel.tsx`, `RulesTab.tsx`, `Design system: NSC Clinic Roster`, `uiComponents.test.ts`, `ClinicContextState`, `types/index.ts`, `fixtures.ts`, `ui/index.ts`, `access.ts`, `harness/main.tsx`, `formatDate`, `doctorScheduleService.ts`, `VersionCompareModal.tsx`, `Sidebar.tsx`, `getRepository`, `QuickCellPopup.tsx`, `EmailTab.tsx`, `WhoCanCover.tsx`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `SchedulesView.tsx`, `DashboardView.tsx`, `ExportModal.tsx`, `PublishModal.tsx`, `notify`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `Button`, `GridRow.tsx`, `nurseRosterService.ts`, `useDialogA11y`, `PlannerSample.tsx`, `hoursPolicy.ts`, `data.ts`, `WorkbookGrid.tsx`, `ui.tsx`, `FairnessModal.tsx`, `WorkingHoursPeriodsPanel.tsx`, `RulesTab.tsx`, `uiComponents.test.ts`, `ui/index.ts`, `access.ts`, `harness/main.tsx`, `formatDate`, `doctorScheduleService.ts`, `VersionCompareModal.tsx`, `Sidebar.tsx`, `getRepository`, `QuickCellPopup.tsx`, `EmailTab.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `authService` connect `authService.ts` to `SchedulesView.tsx`, `DashboardView.tsx`, `doctorScheduleService.ts`, `react`, `PublishModal.tsx`, `notify`, `VersionCompareModal.tsx`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `Sidebar.tsx`, `FairnessModal.tsx`, `getRepository`, `types/index.ts`, `EmailTab.tsx`, `fakeAuth.ts`, `access.ts`, `nurseRosterService.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _867 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SchedulesView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11570827489481066 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06852497096399536 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._