# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 277 files · ~336,499 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 4, (none) 3, .example 1)

## Summary
- 2237 nodes · 7147 edges · 105 communities (95 shown, 10 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 245 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e63bb4f8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- nurseRosterService.ts
- ExportModal.tsx
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
- getRepository
- App.tsx
- CollectionSyncer
- DashboardView.tsx
- makeNurse
- firebaseIdentityService.ts
- SchedulesView.tsx
- compilerOptions
- CreateScheduleModal.tsx
- cx
- FirestoreRepository
- devDependencies
- emailService.ts
- FirestoreRepository.ts
- IRepository
- scripts
- WorkbookGrid.tsx
- PlannerSample.tsx
- react
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- lastResort.test.ts
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
- ClinicRoster
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
- fixtures.ts
- PublishModal.tsx
- createApiApp
- authorizedFetch
- Design system: NSC Clinic Roster
- README.md
- 16. History of work (for context)
- hoursPolicy.ts
- dialogs.tsx
- usePresence.ts
- hoursRules.test.ts
- NSC Clinic Roster: complete project guide
- types/index.ts
- engineRules.test.ts
- Phases
- fakeAuth.ts
- publicHolidays.test.ts
- colorContrast.ts
- repository/index.ts
- apiApp.ts
- UI overhaul: checklist
- harness/main.tsx
- WorkingHoursPeriodsPanel.tsx
- repositoryManager
- Finish a change
- emailLogSize.ts
- plain-english-reviewer.md
- context7
- firestore-rules-reviewer.md
- firebase-mcp.sh
- NurseTimesheetModal.tsx
- start.sh
- stop.sh
- ref_node_assert

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 95 edges
3. `Schedule` - 86 edges
4. `DutyWindow` - 81 edges
5. `Nurse` - 81 edges
6. `react` - 79 edges
7. `useDialogA11y()` - 71 edges
8. `Doctor` - 70 edges
9. `lucide-react` - 66 edges
10. `ClinicalRole` - 63 edges

## Surprising Connections (you probably didn't know these)
- `Dates and times` --references--> `DateInput()`  [INFERRED]
  design-system/nsc-clinic-roster/MASTER.md → .claude/skills/browser-check/harness/sample/ui.tsx
- `Phase 7: publishing, History and all dialogs` --references--> `Dialog()`  [INFERRED]
  tasks/plan.md → .claude/skills/browser-check/harness/sample/ui.tsx
- `Phase 7: publishing, History and dialogs` --references--> `Dialog()`  [INFERRED]
  tasks/todo.md → .claude/skills/browser-check/harness/sample/ui.tsx
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Parts (first drafts in `.claude/skills/browser-check/harness/sample/`)` --references--> `useDialogA11y()`  [INFERRED]
  design-system/nsc-clinic-roster/MASTER.md → src/components/common/useDialogA11y.ts

## Import Cycles
- None detected.

## Communities (105 total, 10 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.14
Nodes (67): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+59 more)

### Community 1 - "nurseRosterService.ts"
Cohesion: 0.13
Nodes (32): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+24 more)

### Community 2 - "ExportModal.tsx"
Cohesion: 0.08
Nodes (47): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, fmtHours() (+39 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.06
Nodes (27): nurse(), Steps, apps, { initializeTestEnvironment }, planner(), requireRules, D, DOCTORS (+19 more)

### Community 4 - "icsExportService.ts"
Cohesion: 0.10
Nodes (24): RFC-5545, calendarRouter, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact() (+16 more)

### Community 5 - "authService.ts"
Cohesion: 0.09
Nodes (31): LoginPageProps, signOutSafely(), AppShellProps, NAV_ITEMS, SidebarProps, TopBar(), TopBarProps, AuthModalProps (+23 more)

### Community 6 - "notify"
Cohesion: 0.13
Nodes (41): confirmDialog(), dismissNotice(), notify(), setState(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTabProps (+33 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "ui-audit.cjs"
Cohesion: 0.04
Nodes (29): { chromium }, { chromium }, { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path (+21 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.15
Nodes (23): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+15 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "getRepository"
Cohesion: 0.13
Nodes (38): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+30 more)

### Community 14 - "App.tsx"
Cohesion: 0.18
Nodes (11): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+3 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.11
Nodes (10): saveHolidayLeave(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, saveDoctorSessions() (+2 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.17
Nodes (23): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+15 more)

### Community 17 - "makeNurse"
Cohesion: 0.13
Nodes (18): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+10 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "SchedulesView.tsx"
Cohesion: 0.09
Nodes (37): 11. Saving, live updates, versions, MenuButton(), MenuButtonProps, MenuItem, CreateScheduleModal(), SwapManagerModal(), VersionCompareModal(), readStoredScheduleId() (+29 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "CreateScheduleModal.tsx"
Cohesion: 0.24
Nodes (12): CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown, WorkingHoursCalculationResult (+4 more)

### Community 22 - "cx"
Cohesion: 0.18
Nodes (18): dayProblems(), problemAt(), tint(), clamp(), DayView(), describe(), GridCell(), HoursCell() (+10 more)

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
Cohesion: 0.09
Nodes (30): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), removePublicRoster(), fingerprint() (+22 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "WorkbookGrid.tsx"
Cohesion: 0.10
Nodes (34): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, CellChoice (+26 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.19
Nodes (26): countOf(), ddmmyyyy(), Brand(), datesOf(), day(), Drawer(), LeaveForm(), NAV (+18 more)

### Community 31 - "react"
Cohesion: 0.10
Nodes (36): lucide-react, react, uuid, openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModal(), DeleteScheduleModalProps (+28 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "data.ts"
Cohesion: 0.11
Nodes (25): Cell, dayLabel(), DAYS, DOCTORS, LEAVE, Nurse, NURSES, parse() (+17 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.15
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 38 - "lastResort.test.ts"
Cohesion: 0.10
Nodes (15): AGREED_EXCEPTION_NOTE, isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES (+7 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "middleware/auth.ts"
Cohesion: 0.29
Nodes (6): authMiddleware(), AuthUser, Express, requireOwner, ROLE_HIERARCHY, verifyToken()

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
Cohesion: 0.14
Nodes (7): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter, UNCACHED_COLLECTIONS

### Community 46 - "ui.tsx"
Cohesion: 0.15
Nodes (13): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+5 more)

### Community 47 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.08
Nodes (62): 6. Clinic model (the business rules in plain English), 7. Rules, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+54 more)

### Community 49 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 50 - "yearToDate.ts"
Cohesion: 0.08
Nodes (28): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), clearYearToDateCache() (+20 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (21): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+13 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "RulesTab.tsx"
Cohesion: 0.07
Nodes (47): Other engine files, FairnessModal(), ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField (+39 more)

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
Nodes (29): NurseTimesheetModalProps, SortField, TabMode, ClinicSetup, askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals() (+21 more)

### Community 69 - "ScheduleVersion"
Cohesion: 0.24
Nodes (11): DeleteVersionModalProps, ShareModal(), ShareModalProps, TabType, canEditClinicData(), ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE (+3 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "fixtures.ts"
Cohesion: 0.07
Nodes (30): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+22 more)

### Community 72 - "PublishModal.tsx"
Cohesion: 0.10
Nodes (39): Browser check, Things that went wrong before, 12. Publishing and nurse links, Request, EmailHtmlPreview(), PublishModal(), Step, AcknowledgePageProps (+31 more)

### Community 73 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 74 - "authorizedFetch"
Cohesion: 0.31
Nodes (8): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.17
Nodes (11): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+3 more)

### Community 77 - "16. History of work (for context)"
Cohesion: 0.44
Nodes (8): 16. History of work (for context), addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 78 - "hoursPolicy.ts"
Cohesion: 0.31
Nodes (9): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditPerDay(), leaveDaysInRange() (+1 more)

### Community 79 - "dialogs.tsx"
Cohesion: 0.19
Nodes (11): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, listeners, Notice, NoticeTone, PendingConfirm (+3 more)

### Community 80 - "usePresence.ts"
Cohesion: 0.29
Nodes (6): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 81 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 82 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.15
Nodes (12): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), Entry points (+4 more)

### Community 83 - "types/index.ts"
Cohesion: 0.06
Nodes (32): PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditAction, AuditEvent, BlockWeeks, DoctorSessionSource, EmailLogKind, EmailLogStatus (+24 more)

### Community 84 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 85 - "Phases"
Cohesion: 0.12
Nodes (16): Backend summary, Baseline, 07-10-2026 (before any phase), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval), Phase 4: roster screen layout, words and accessibility (+8 more)

### Community 86 - "fakeAuth.ts"
Cohesion: 0.33
Nodes (3): AuthService, MASTER_ADMIN_EMAIL, PEOPLE

### Community 87 - "publicHolidays.test.ts"
Cohesion: 0.21
Nodes (13): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), leaveCountingOnHoliday() (+5 more)

### Community 88 - "colorContrast.ts"
Cohesion: 0.50
Nodes (7): contrastRatio(), INK, INK_MUTED, luminance(), readableTextOn(), rgbOf(), tint()

### Community 89 - "repository/index.ts"
Cohesion: 0.43
Nodes (6): DatabaseTab(), defaultFirebaseConfig, StorageMode, checkBackup(), getDatabaseStatistics(), importFullDatabaseBackup()

### Community 90 - "apiApp.ts"
Cohesion: 0.17
Nodes (12): express, @google/genai, BackendRole, authRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions (+4 more)

### Community 91 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.10
Nodes (8): context, publishNovember(), Single(), start(), user, FONTS, renderSample(), react-dom

### Community 93 - "WorkingHoursPeriodsPanel.tsx"
Cohesion: 0.38
Nodes (5): WorkingHoursPeriodsPanel(), WorkingHoursPeriodsPanelProps, SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, localTodayIso()

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "emailLogSize.ts"
Cohesion: 0.39
Nodes (5): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), EmailRecipientLog

### Community 97 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 104 - "NurseTimesheetModal.tsx"
Cohesion: 0.25
Nodes (12): 3. Users, roles and access, usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, ReportsView(), csvCell() (+4 more)

### Community 112 - "ref_node_assert"
Cohesion: 0.09
Nodes (14): ScheduleValidator, LATE, nurse, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session() (+6 more)

## Knowledge Gaps
- **782 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+777 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 951 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `nurseRosterService.ts`, `ExportModal.tsx`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `DashboardView.tsx`, `SchedulesView.tsx`, `CreateScheduleModal.tsx`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `data.ts`, `ui.tsx`, `RulesTab.tsx`, `hoursBalance.ts`, `ScheduleVersion`, `fixtures.ts`, `PublishModal.tsx`, `dialogs.tsx`, `usePresence.ts`, `NSC Clinic Roster: complete project guide`, `repository/index.ts`, `harness/main.tsx`, `WorkingHoursPeriodsPanel.tsx`, `NurseTimesheetModal.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `nurseRosterService.ts`, `ExportModal.tsx`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `DashboardView.tsx`, `SchedulesView.tsx`, `CreateScheduleModal.tsx`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `data.ts`, `ui.tsx`, `RulesTab.tsx`, `hoursBalance.ts`, `ScheduleVersion`, `PublishModal.tsx`, `dialogs.tsx`, `repository/index.ts`, `WorkingHoursPeriodsPanel.tsx`, `NurseTimesheetModal.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `nurseRosterService.ts`, `ExportModal.tsx`, `clinicModel.test.ts`, `icsExportService.ts`, `DashboardView.tsx`, `makeNurse`, `SchedulesView.tsx`, `IRepository`, `WorkbookGrid.tsx`, `react`, `lastResort.test.ts`, `continuousHours.test.ts`, `nurseClinicFloat.test.ts`, `SchedulingEngine.ts`, `yearToDate.ts`, `handMoves.test.ts`, `RulesTab.tsx`, `hoursBalance.ts`, `fixtures.ts`, `PublishModal.tsx`, `hoursRules.test.ts`, `types/index.ts`, `engineRules.test.ts`, `publicHolidays.test.ts`, `ref_node_assert`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _782 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.13534566699123662 - nodes in this community are weakly interconnected._
- **Should `nurseRosterService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1253968253968254 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08315863032844165 - nodes in this community are weakly interconnected._