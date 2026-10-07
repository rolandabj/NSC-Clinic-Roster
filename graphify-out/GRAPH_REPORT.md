# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 265 files · ~322,744 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: .css 3, (none) 3, .example 1)

## Summary
- 2128 nodes · 6807 edges · 107 communities (96 shown, 11 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 219 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7c5adbb5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- rosterPdfService.ts
- hoursBalance.ts
- clinicModel.test.ts
- icsExportService.ts
- authService.ts
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
- DashboardView.tsx
- makeNurse
- firebaseIdentityService.ts
- useDialogA11y
- compilerOptions
- RulesTab.tsx
- NurseTimesheetModal.tsx
- FirestoreRepository
- devDependencies
- emailService.ts
- seedRunner.ts
- IRepository
- scripts
- WorkbookGrid.tsx
- ref_node_assert
- dateFormatter.ts
- Hardening Controls
- dialogs.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- SchedulesView.tsx
- hoursTopUp.test.ts
- Optimization Patterns
- middleware/auth.ts
- continuousHours.test.ts
- nurseClinicFloat.test.ts
- Frontend UI Engineering
- quotaTracker
- EmailTab.tsx
- published-rules.mjs
- SchedulingEngine.ts
- fixtures.ts
- yearToDate.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- handMoves.test.ts
- Incremental Implementation
- I18nManager
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
- PublishModal.tsx
- getRepository
- Source-Driven Development
- fakeAuth.ts
- formatDate
- Sidebar.tsx
- weekHours.test.ts
- PublishedRosterView.tsx
- README.md
- nurseRosterService.ts
- sharing.test.ts
- CreateScheduleModal.tsx
- FirestoreRepository.ts
- IRepository.ts
- doctorScheduleService.ts
- types/index.ts
- engineRules.test.ts
- Phases
- ClinicTab.tsx
- react
- createApiApp
- ClinicContextState
- geminiApi.test.ts
- UI overhaul: checklist
- harness/main.tsx
- emailSettingsStore.ts
- createLiveReconciler
- Finish a change
- authorizedFetch
- hoursRules.test.ts
- lastResort.test.ts
- context7
- newRosterDates.ts
- firestore-rules-reviewer.md
- plain-english-reviewer.md
- firebase-mcp.sh
- repositoryManager
- start.sh
- stop.sh

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 95 edges
3. `Schedule` - 86 edges
4. `Nurse` - 82 edges
5. `DutyWindow` - 81 edges
6. `react` - 75 edges
7. `useDialogA11y()` - 70 edges
8. `Doctor` - 70 edges
9. `lucide-react` - 63 edges
10. `ClinicalRole` - 63 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts
- `Phase 3: roster grid speed and structure` --references--> `CollectionSyncer`  [INFERRED]
  tasks/plan.md → src/services/repository/collectionSyncer.ts
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx

## Import Cycles
- None detected.

## Communities (107 total, 11 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.19
Nodes (54): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+46 more)

### Community 1 - "rosterPdfService.ts"
Cohesion: 0.11
Nodes (23): jspdf, jspdf-autotable, chunk(), exportRosterToPdf(), firstName(), GRID, HEAD_FILL, hexToRgb() (+15 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.08
Nodes (50): ExportTab, WEEKDAY_NAMES, NurseTimesheetModalProps, SortField, TabMode, exportRosterToExcel(), getScheduleDates(), WEEKDAY_NAMES (+42 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 5 - "authService.ts"
Cohesion: 0.22
Nodes (12): LoginPageProps, signOutSafely(), AppShellProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps, MASTER_ADMIN_EMAIL (+4 more)

### Community 6 - "notify"
Cohesion: 0.16
Nodes (34): confirmDialog(), notify(), TemplateModal(), AccessManagementPanel(), DatabaseTabProps, DutiesTab(), DutiesTabProps, shiftHours() (+26 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.04
Nodes (29): { chromium }, { chromium }, { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path (+21 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): firebase, name, private, type, version, autoprefixer, cors, date-fns (+13 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.16
Nodes (21): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+13 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.05
Nodes (72): 0. Quick start for a new chat, 10. Hours, 13. Screens in detail, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout (+64 more)

### Community 14 - "App.tsx"
Cohesion: 0.16
Nodes (11): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+3 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.13
Nodes (7): 11. Saving, live updates, versions, saveHolidayLeave(), fingerprint(), syncScheduleAssignments(), CollectionSyncer, saveDoctorSessions(), EntityForCollection

### Community 16 - "DashboardView.tsx"
Cohesion: 0.14
Nodes (26): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+18 more)

### Community 17 - "makeNurse"
Cohesion: 0.09
Nodes (28): SchedulingEngine, DAY_DUTY, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup() (+20 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.15
Nodes (18): jose, AuthUser, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+10 more)

### Community 19 - "useDialogA11y"
Cohesion: 0.12
Nodes (29): openStack, useDialogA11y(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), DeleteVersionModalProps, CHANGE_LABELS, VersionCompareModal() (+21 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

### Community 22 - "NurseTimesheetModal.tsx"
Cohesion: 0.26
Nodes (13): fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, AuditTrailView(), ReportsView(), exportRosterToCsvLong(), exportRosterToCsvMatrix() (+5 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "emailService.ts"
Cohesion: 0.17
Nodes (14): emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult, ServerEmailConfig (+6 more)

### Community 26 - "seedRunner.ts"
Cohesion: 0.16
Nodes (19): DatabaseTab(), defaultFirebaseConfig, SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, ALL_COLLECTIONS, BackupCheck, checkBackup(), clearDatabase() (+11 more)

### Community 27 - "IRepository"
Cohesion: 0.13
Nodes (13): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, IRepository, DeleteDoctorShiftParams, PopulateRecurringDoctorSessionsParams, SaveDoctorShiftParams (+5 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "WorkbookGrid.tsx"
Cohesion: 0.10
Nodes (34): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, ProblemsPanelProps (+26 more)

### Community 30 - "ref_node_assert"
Cohesion: 0.14
Nodes (7): ctx(), EARLY, LATE, diff(), LATE, nurse, now

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "dialogs.tsx"
Cohesion: 0.18
Nodes (13): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, NoticeTone (+5 more)

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

### Community 38 - "SchedulesView.tsx"
Cohesion: 0.16
Nodes (20): MenuButton(), MenuButtonProps, MenuItem, ExportModal(), fmtHours(), FairnessModal(), SwapManagerModal(), readStoredScheduleId() (+12 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "middleware/auth.ts"
Cohesion: 0.12
Nodes (17): express-rate-limit, helmet, authMiddleware(), BackendRole, Express, Request, requireOwner, requirePlanner (+9 more)

### Community 42 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 46 - "EmailTab.tsx"
Cohesion: 0.25
Nodes (9): 12. Publishing and nurse links, nodemailer, EmailTab(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), escapeHtml(), configured (+1 more)

### Community 47 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.07
Nodes (72): 6. Clinic model (the business rules in plain English), 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+64 more)

### Community 49 - "fixtures.ts"
Cohesion: 0.08
Nodes (27): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+19 more)

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
Cohesion: 0.06
Nodes (43): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, uuid, fmt(), hoursText(), WhoCanCover() (+35 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

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

### Community 68 - "PublishModal.tsx"
Cohesion: 0.29
Nodes (12): Things that went wrong before, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), ensureNurseLink(), nurseLinkUrl() (+4 more)

### Community 69 - "getRepository"
Cohesion: 0.28
Nodes (11): ShareModal(), ShareModalProps, TabType, ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster() (+3 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "fakeAuth.ts"
Cohesion: 0.33
Nodes (3): AuthService, MASTER_ADMIN_EMAIL, PEOPLE

### Community 72 - "formatDate"
Cohesion: 0.16
Nodes (16): DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, DoctorsView(), WEEKDAY_NAMES, HolidayDayOffPicker(), HolidayDayOffPickerProps, SEVERITY (+8 more)

### Community 73 - "Sidebar.tsx"
Cohesion: 0.18
Nodes (12): NAV_ITEMS, Sidebar(), SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DICTIONARY, i18n (+4 more)

### Community 74 - "weekHours.test.ts"
Cohesion: 0.11
Nodes (12): ScheduleValidator, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS, EARLY (+4 more)

### Community 75 - "PublishedRosterView.tsx"
Cohesion: 0.19
Nodes (11): PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile(), buildTeamRosterSheet(), loadPublicRoster(), nurses, published (+3 more)

### Community 77 - "nurseRosterService.ts"
Cohesion: 0.14
Nodes (27): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+19 more)

### Community 78 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 79 - "CreateScheduleModal.tsx"
Cohesion: 0.29
Nodes (11): CreateScheduleModal(), CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown (+3 more)

### Community 80 - "FirestoreRepository.ts"
Cohesion: 0.19
Nodes (14): FirebaseClientConfig, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap() (+6 more)

### Community 81 - "IRepository.ts"
Cohesion: 0.20
Nodes (9): Desired, fingerprint(), Known, planSync(), SyncPlan, SubscribeCallback, Unsubscribe, rebaseEdit() (+1 more)

### Community 82 - "doctorScheduleService.ts"
Cohesion: 0.22
Nodes (15): EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), doctorFromDate(), getWeekdayFromIsoDate(), nextDay() (+7 more)

### Community 83 - "types/index.ts"
Cohesion: 0.05
Nodes (41): CellChoice, PREFERENCE_FOCUS_LABELS, InternalSlot, othersOnRoster(), STALE_MS, TAB_ID, usePresence(), DispatchResult (+33 more)

### Community 84 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 85 - "Phases"
Cohesion: 0.10
Nodes (19): Backend summary, Baseline, 07-10-2026 (before any phase), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval), Phase 1: quick fixes and safety (+11 more)

### Community 86 - "ClinicTab.tsx"
Cohesion: 0.36
Nodes (7): ClinicTab(), ClinicTabProps, SaveStatus, WEEKDAY_NAMES, SettingsViewProps, ClinicProfile, getWeekendDays()

### Community 87 - "react"
Cohesion: 0.28
Nodes (7): lucide-react, react, BulkImportModal(), AcknowledgePageProps, NursesView(), WorkingHoursPeriodsPanelProps, StorageMode

### Community 88 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 89 - "ClinicContextState"
Cohesion: 0.18
Nodes (11): TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DashboardViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps (+3 more)

### Community 90 - "geminiApi.test.ts"
Cohesion: 0.24
Nodes (10): express, @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient() (+2 more)

### Community 91 - "UI overhaul: checklist"
Cohesion: 0.17
Nodes (11): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs (+3 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.10
Nodes (6): context, publishNovember(), Single(), start(), user, react-dom

### Community 93 - "emailSettingsStore.ts"
Cohesion: 0.38
Nodes (7): removeNurseRoster(), revokeNurseLink(), writeInitializationState(), cache(), cachedEmailSettings(), loadEmailSettings(), saveEmailSettings()

### Community 94 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "authorizedFetch"
Cohesion: 0.31
Nodes (8): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload

### Community 97 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 98 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **763 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+758 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 932 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `hoursBalance.ts`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `makeNurse`, `useDialogA11y`, `RulesTab.tsx`, `NurseTimesheetModal.tsx`, `seedRunner.ts`, `WorkbookGrid.tsx`, `dialogs.tsx`, `SchedulesView.tsx`, `EmailTab.tsx`, `handMoves.test.ts`, `PublishModal.tsx`, `getRepository`, `formatDate`, `Sidebar.tsx`, `PublishedRosterView.tsx`, `nurseRosterService.ts`, `CreateScheduleModal.tsx`, `doctorScheduleService.ts`, `types/index.ts`, `ClinicTab.tsx`, `harness/main.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `hoursBalance.ts`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `useDialogA11y`, `RulesTab.tsx`, `NurseTimesheetModal.tsx`, `seedRunner.ts`, `WorkbookGrid.tsx`, `dialogs.tsx`, `SchedulesView.tsx`, `EmailTab.tsx`, `PublishModal.tsx`, `getRepository`, `formatDate`, `Sidebar.tsx`, `PublishedRosterView.tsx`, `nurseRosterService.ts`, `CreateScheduleModal.tsx`, `doctorScheduleService.ts`, `ClinicTab.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `authService` connect `authService` to `Assignment`, `PublishModal.tsx`, `authService.ts`, `getRepository`, `SchedulesView.tsx`, `notify`, `Sidebar.tsx`, `AppShell.tsx`, `PublishedRosterView.tsx`, `AvailabilityView.tsx`, `App.tsx`, `CreateScheduleModal.tsx`, `DashboardView.tsx`, `EmailTab.tsx`, `types/index.ts`, `react`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _763 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `rosterPdfService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11231884057971014 - nodes in this community are weakly interconnected._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07966101694915254 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._