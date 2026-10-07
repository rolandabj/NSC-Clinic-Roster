# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 290 files · ~342,939 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 4, (none) 3, .example 1)

## Summary
- 2306 nodes · 7359 edges · 108 communities (97 shown, 11 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 267 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a4ed8c23`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- nurseRosterService.ts
- analysisExportService.ts
- clinicModel.test.ts
- PublishedRosterView.tsx
- authService.ts
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
- DashboardView.tsx
- makeSchedule
- firebaseIdentityService.ts
- SchedulesView.tsx
- compilerOptions
- yearSeed.ts
- createLiveReconciler
- FirestoreRepository
- devDependencies
- emailService.ts
- FirestoreRepository.ts
- IRepository
- scripts
- WorkbookGrid.tsx
- PlannerSample.tsx
- DoctorsView.tsx
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- ref_node_assert
- hoursTopUp.test.ts
- Optimization Patterns
- middleware/auth.ts
- continuousHours.test.ts
- nurseClinicFloat.test.ts
- Frontend UI Engineering
- quotaTracker
- ui.tsx
- published-rules.mjs
- SchedulingEngine.ts
- NSC Clinic Roster: complete project guide
- yearToDate.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- handMoves.test.ts
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
- ScheduleVersion
- Source-Driven Development
- makeNurse
- PublishModal.tsx
- createApiApp
- authorizedFetch
- Design system: NSC Clinic Roster
- README.md
- lastResort.test.ts
- doctorWeekChange.test.ts
- react
- usePresence.ts
- fixtures.ts
- FairnessModal.tsx
- types/index.ts
- engineRules.test.ts
- ui/index.ts
- fakeAuth.ts
- holidayLeave.ts
- WhoCanCover.tsx
- repository/index.ts
- geminiApi.test.ts
- UI overhaul: checklist
- harness/main.tsx
- WorkingHoursPeriodsPanel.tsx
- repositoryManager
- Finish a change
- emailLogSize.ts
- plain-english-reviewer.md
- ddmmyyyy
- context7
- scheduleTransactions.test.ts
- firestore-rules-reviewer.md
- DoctorsScheduleSheet
- firebase-mcp.sh
- useDialogA11y
- start.sh
- stop.sh
- weekHours.test.ts

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 95 edges
3. `react` - 90 edges
4. `Schedule` - 86 edges
5. `DutyWindow` - 81 edges
6. `Nurse` - 81 edges
7. `lucide-react` - 76 edges
8. `useDialogA11y()` - 74 edges
9. `Doctor` - 70 edges
10. `ClinicalRole` - 63 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`)` --references--> `useDialogA11y()`  [INFERRED]
  design-system/nsc-clinic-roster/MASTER.md → src/components/common/useDialogA11y.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts

## Import Cycles
- None detected.

## Communities (108 total, 11 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.14
Nodes (63): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, TIME_PRESETS, ExportModalProps, FairnessModalProps, PublishModalProps, NONE (+55 more)

### Community 1 - "nurseRosterService.ts"
Cohesion: 0.09
Nodes (40): dateLabel(), PublishedRosterSheet(), loadViewerData(), LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+32 more)

### Community 2 - "analysisExportService.ts"
Cohesion: 0.07
Nodes (61): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps (+53 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "PublishedRosterView.tsx"
Cohesion: 0.18
Nodes (19): RFC-5545, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, buildNurseIcs(), buildNurseRosterIcs(), downloadIcsFile(), escapeIcsText() (+11 more)

### Community 5 - "authService.ts"
Cohesion: 0.09
Nodes (29): LoginPageProps, signOutSafely(), AppShellProps, TopBar(), TopBarProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps (+21 more)

### Community 6 - "notify"
Cohesion: 0.15
Nodes (35): confirmDialog(), dismissNotice(), notify(), setState(), TemplateModal(), AccessManagementPanel(), DutiesTab(), DutiesTabProps (+27 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.04
Nodes (29): { chromium }, { chromium }, { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path (+21 more)

### Community 9 - "package.json"
Cohesion: 0.10
Nodes (20): firebase, name, private, type, version, autoprefixer, cors, date-fns (+12 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.12
Nodes (29): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+21 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "getRepository"
Cohesion: 0.13
Nodes (39): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+31 more)

### Community 14 - "App.tsx"
Cohesion: 0.14
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.10
Nodes (11): 11. Saving, live updates, versions, saveHolidayLeave(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+3 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.16
Nodes (19): Card(), DashboardView(), loadPlannerData(), longDate(), PlannerData, readStoredId(), TodayList(), ViewerData (+11 more)

### Community 17 - "makeSchedule"
Cohesion: 0.14
Nodes (13): SchedulingEngine, hoursOnlyRules(), makeSchedule(), LATE, run(), setup(), account(), generateAll() (+5 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "SchedulesView.tsx"
Cohesion: 0.11
Nodes (29): MenuButton(), MenuButtonProps, MenuItem, SwapManagerModal(), readStoredScheduleId(), SchedulesView(), storeScheduleId(), CoverageSheet() (+21 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearSeed.ts"
Cohesion: 0.29
Nodes (7): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds()

### Community 22 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "emailService.ts"
Cohesion: 0.16
Nodes (14): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+6 more)

### Community 26 - "FirestoreRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 27 - "IRepository"
Cohesion: 0.12
Nodes (24): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), fingerprint(), syncScheduleAssignments(), IRepository (+16 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "WorkbookGrid.tsx"
Cohesion: 0.10
Nodes (36): 6. Clinic model (the business rules in plain English), findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption (+28 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "DoctorsView.tsx"
Cohesion: 0.08
Nodes (41): CreateScheduleModal(), CreateScheduleModalProps, DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, DoctorsView(), WEEKDAY_NAMES, InternalSlot (+33 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "data.ts"
Cohesion: 0.10
Nodes (25): Cell, dayLabel(), DAYS, DOCTORS, LEAVE, Nurse, NURSES, parse() (+17 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.11
Nodes (14): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, nurse() (+6 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "ref_node_assert"
Cohesion: 0.09
Nodes (14): BACKUPS_KEPT, diff(), LATE, nurse, DR_PCC, DR_PEDS, FULL, NINE_SEVEN (+6 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "middleware/auth.ts"
Cohesion: 0.16
Nodes (12): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, requireOwner (+4 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "quotaTracker"
Cohesion: 0.13
Nodes (8): FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 46 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 47 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (55): 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+47 more)

### Community 49 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.10
Nodes (17): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide, ClinicRoster (+9 more)

### Community 50 - "yearToDate.ts"
Cohesion: 0.13
Nodes (17): clearYearToDateCache(), computeYearToDate(), earlierRostersThisYear(), emptyCounts(), forgetCachedRoster(), latestPublishedVersion(), loadEarlierRosters(), LoadedRoster (+9 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+14 more)

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
Cohesion: 0.12
Nodes (28): 10. Hours, askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), HoursSchedule, Leftover, MAX_CARRY_PERIODS (+20 more)

### Community 69 - "ScheduleVersion"
Cohesion: 0.20
Nodes (15): 3. Users, roles and access, Request, DeleteVersionModalProps, ShareModal(), ShareModalProps, TabType, canEditClinicData(), ensurePublicRosters() (+7 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "makeNurse"
Cohesion: 0.09
Nodes (21): 15. Tests, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift() (+13 more)

### Community 72 - "PublishModal.tsx"
Cohesion: 0.13
Nodes (30): Things that went wrong before, 12. Publishing and nurse links, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), EmailTab() (+22 more)

### Community 73 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 74 - "authorizedFetch"
Cohesion: 0.31
Nodes (8): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 78 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 79 - "react"
Cohesion: 0.17
Nodes (16): lucide-react, react, uuid, ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, listeners (+8 more)

### Community 80 - "usePresence.ts"
Cohesion: 0.29
Nodes (6): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 81 - "fixtures.ts"
Cohesion: 0.09
Nodes (21): ANNUAL_LEAVE, DAY_DUTY, makeLeave(), SENIOR, UNPAID_LEAVE, LONG, NOV, OCT (+13 more)

### Community 82 - "FairnessModal.tsx"
Cohesion: 0.14
Nodes (24): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, FairnessModal(), NONE, NurseFairnessMetrics, ProposedSwap (+16 more)

### Community 83 - "types/index.ts"
Cohesion: 0.06
Nodes (32): isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind, EmailLogStatus (+24 more)

### Community 84 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 85 - "ui/index.ts"
Cohesion: 0.05
Nodes (74): 16. History of work (for context), Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, Button() (+66 more)

### Community 86 - "fakeAuth.ts"
Cohesion: 0.33
Nodes (3): AuthService, MASTER_ADMIN_EMAIL, PEOPLE

### Community 87 - "holidayLeave.ts"
Cohesion: 0.38
Nodes (6): applyHolidayChangeToLeave(), DatedLeave, HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), withoutHolidayZero()

### Community 88 - "WhoCanCover.tsx"
Cohesion: 0.53
Nodes (5): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, NurseDayExplanation

### Community 89 - "repository/index.ts"
Cohesion: 0.31
Nodes (7): DatabaseTab(), DatabaseTabProps, defaultFirebaseConfig, StorageMode, checkBackup(), getDatabaseStatistics(), importFullDatabaseBackup()

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 91 - "UI overhaul: checklist"
Cohesion: 0.17
Nodes (11): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs (+3 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.08
Nodes (11): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+3 more)

### Community 93 - "WorkingHoursPeriodsPanel.tsx"
Cohesion: 0.21
Nodes (10): ClinicTab(), ClinicTabProps, SaveStatus, WEEKDAY_NAMES, SettingsViewProps, WorkingHoursPeriodsPanelProps, SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS (+2 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "emailLogSize.ts"
Cohesion: 0.33
Nodes (6): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), DispatchResult, EmailRecipientLog

### Community 97 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 98 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "scheduleTransactions.test.ts"
Cohesion: 0.40
Nodes (3): apps, { initializeTestEnvironment }, requireRules

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "DoctorsScheduleSheet"
Cohesion: 0.60
Nodes (5): EditDoctorShiftModal(), DoctorsScheduleSheet(), deleteDoctorShift(), getWeekdayFromIsoDate(), saveDoctorShift()

### Community 104 - "useDialogA11y"
Cohesion: 0.14
Nodes (28): openStack, useDialogA11y(), usePermissions(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), fmtHours(), NurseTimesheetModal() (+20 more)

### Community 112 - "weekHours.test.ts"
Cohesion: 0.14
Nodes (7): ScheduleValidator, EARLY, LATE, restFindings(), shifts, LONG, OCT

## Knowledge Gaps
- **796 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+791 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 968 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `nurseRosterService.ts`, `analysisExportService.ts`, `PublishedRosterView.tsx`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `DashboardView.tsx`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `DoctorsView.tsx`, `data.ts`, `ui.tsx`, `NSC Clinic Roster: complete project guide`, `RulesTab.tsx`, `ScheduleVersion`, `PublishModal.tsx`, `usePresence.ts`, `fixtures.ts`, `FairnessModal.tsx`, `ui/index.ts`, `WhoCanCover.tsx`, `repository/index.ts`, `harness/main.tsx`, `WorkingHoursPeriodsPanel.tsx`, `useDialogA11y`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `nurseRosterService.ts`, `analysisExportService.ts`, `PublishedRosterView.tsx`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `DashboardView.tsx`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `DoctorsView.tsx`, `data.ts`, `ui.tsx`, `RulesTab.tsx`, `ScheduleVersion`, `PublishModal.tsx`, `FairnessModal.tsx`, `ui/index.ts`, `repository/index.ts`, `harness/main.tsx`, `WorkingHoursPeriodsPanel.tsx`, `useDialogA11y`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `useDialogA11y()` connect `useDialogA11y` to `Assignment`, `analysisExportService.ts`, `authService.ts`, `DoctorsScheduleSheet`, `ScheduleVersion`, `PublishModal.tsx`, `notify`, `AppShell.tsx`, `Design system: NSC Clinic Roster`, `getRepository`, `react`, `FairnessModal.tsx`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `ui/index.ts`, `WorkingHoursPeriodsPanel.tsx`, `DoctorsView.tsx`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _796 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.13859649122807016 - nodes in this community are weakly interconnected._
- **Should `nurseRosterService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08776595744680851 - nodes in this community are weakly interconnected._
- **Should `analysisExportService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06841046277665996 - nodes in this community are weakly interconnected._