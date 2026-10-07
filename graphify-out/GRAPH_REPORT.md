# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 296 files · ~345,754 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 4, (none) 3, .example 1)

## Summary
- 2327 nodes · 7499 edges · 108 communities (99 shown, 9 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 276 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35bda414`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- emailService.ts
- analysisExportService.ts
- clinicModel.test.ts
- quotaTracker
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
- VersionCompareModal.tsx
- makeSchedule
- firebaseIdentityService.ts
- SchedulesView.tsx
- compilerOptions
- yearToDate.ts
- IRepository.ts
- holidayLeave.ts
- devDependencies
- DashboardView.tsx
- seedRunner.ts
- IRepository
- scripts
- WorkbookGrid.tsx
- PlannerSample.tsx
- doctorScheduleService.ts
- Hardening Controls
- data.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- DoctorsScheduleSheet.tsx
- hoursTopUp.test.ts
- Optimization Patterns
- middleware/auth.ts
- continuousHours.test.ts
- EmailTab.tsx
- Frontend UI Engineering
- FirestoreRepository
- ui.tsx
- published-rules.mjs
- SchedulingEngine.ts
- NSC Clinic Roster: complete project guide
- scheduleTransactions.test.ts
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
- Phases
- Source-Driven Development
- makeNurse
- guide-with-code.mjs
- createApiApp
- PublishModal.tsx
- Design system: NSC Clinic Roster
- README.md
- sharing.test.ts
- ui/index.ts
- dialogs.tsx
- Sidebar.tsx
- publicRosterService.ts
- handMoveChecks.ts
- types/index.ts
- weekHours.test.ts
- uiComponents.test.ts
- RosterGrid
- Button.tsx
- engineRules.test.ts
- access.ts
- apiApp.ts
- UI overhaul: checklist
- harness/main.tsx
- 16. History of work (for context)
- address.ts
- Finish a change
- DataTable.tsx
- ref_node_assert
- authorizedFetch
- context7
- colorContrast.ts
- firestore-rules-reviewer.md
- emailLogSize.ts
- firebase-mcp.sh
- react
- start.sh
- stop.sh
- NurseSample.tsx

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 95 edges
3. `react` - 92 edges
4. `Schedule` - 86 edges
5. `DutyWindow` - 81 edges
6. `Nurse` - 81 edges
7. `lucide-react` - 76 edges
8. `useDialogA11y()` - 74 edges
9. `Doctor` - 70 edges
10. `notify()` - 69 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `Phase 8: Settings, Reports, Audit` --references--> `IRepository`  [INFERRED]
  tasks/plan.md → src/services/repository/IRepository.ts

## Import Cycles
- None detected.

## Communities (108 total, 9 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.16
Nodes (58): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE, NurseFairnessMetrics, ProposedSwap (+50 more)

### Community 1 - "emailService.ts"
Cohesion: 0.16
Nodes (15): nodemailer, requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+7 more)

### Community 2 - "analysisExportService.ts"
Cohesion: 0.08
Nodes (55): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, FLOAT_ROLE_ID (+47 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "quotaTracker"
Cohesion: 0.14
Nodes (8): FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 5 - "authService.ts"
Cohesion: 0.12
Nodes (25): signOutSafely(), AppShellProps, AccountMenu(), TopBar(), TopBarProps, AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps (+17 more)

### Community 6 - "notify"
Cohesion: 0.11
Nodes (47): useAppContext(), confirmDialog(), notify(), TemplateModal(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTab() (+39 more)

### Community 7 - "authService"
Cohesion: 0.15
Nodes (3): authService, computePrivileges(), getAppAuth()

### Community 8 - "ui-audit.cjs"
Cohesion: 0.04
Nodes (29): { chromium }, { chromium }, { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path (+21 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.16
Nodes (22): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+14 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "getRepository"
Cohesion: 0.13
Nodes (37): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+29 more)

### Community 14 - "App.tsx"
Cohesion: 0.13
Nodes (14): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps (+6 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.13
Nodes (8): 11. Saving, live updates, versions, CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, EntityForCollection

### Community 16 - "VersionCompareModal.tsx"
Cohesion: 0.16
Nodes (18): fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, STATUS_LABELS, CHANGE_LABELS, ReportsView(), AssignmentDiffItem, ChangeType (+10 more)

### Community 17 - "makeSchedule"
Cohesion: 0.12
Nodes (13): SchedulingEngine, makeSchedule(), LATE, run(), account(), CARD, EARLY, FULL (+5 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.15
Nodes (18): jose, calendarRouter, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+10 more)

### Community 19 - "SchedulesView.tsx"
Cohesion: 0.05
Nodes (52): Report, What to check, What to look at, MenuButton(), MenuButtonProps, MenuItem, SwapManagerModal(), VersionCompareModal() (+44 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.11
Nodes (23): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), clearYearToDateCache() (+15 more)

### Community 22 - "IRepository.ts"
Cohesion: 0.24
Nodes (13): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+5 more)

### Community 23 - "holidayLeave.ts"
Cohesion: 0.30
Nodes (11): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+3 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "DashboardView.tsx"
Cohesion: 0.05
Nodes (79): RFC-5545, 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), Card(), DashboardView(), loadPlannerData(), loadViewerData() (+71 more)

### Community 26 - "seedRunner.ts"
Cohesion: 0.11
Nodes (24): ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink(), afterShiftsSaved(), toScheduleRange(), ALL_COLLECTIONS (+16 more)

### Community 27 - "IRepository"
Cohesion: 0.13
Nodes (14): DeleteVersionModalProps, ShareModalProps, BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, fingerprint(), syncScheduleAssignments() (+6 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "WorkbookGrid.tsx"
Cohesion: 0.10
Nodes (35): 7. Rules, findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption (+27 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "doctorScheduleService.ts"
Cohesion: 0.10
Nodes (33): CreateScheduleModal(), CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown (+25 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.09
Nodes (18): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, clone(), FirestoreRepository, Listener, MemoryRepo, repo (+10 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.17
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 38 - "DoctorsScheduleSheet.tsx"
Cohesion: 0.21
Nodes (12): EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), getWeekdayFromIsoDate(), saveDoctorShift(), WEEKDAY_FULL_NAMES (+4 more)

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

### Community 43 - "EmailTab.tsx"
Cohesion: 0.32
Nodes (7): EmailTab(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), escapeHtml(), configured, live

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 46 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 47 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.10
Nodes (49): checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse(), ClinicSetup (+41 more)

### Community 49 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.08
Nodes (21): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`) (+13 more)

### Community 50 - "scheduleTransactions.test.ts"
Cohesion: 0.22
Nodes (4): rosterSaveQueues, apps, { initializeTestEnvironment }, requireRules

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (24): moveShift(), swapShifts(), hoursOnlyRules(), AMY, BEA, CARA, DAN, DOCTORS (+16 more)

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
Cohesion: 0.09
Nodes (41): NurseTimesheetModalProps, SortField, TabMode, fmtHours(), HoursAccountingSheet(), askedCarry(), closePeriod(), earlierPeriodTotals() (+33 more)

### Community 69 - "Phases"
Cohesion: 0.11
Nodes (17): Backend summary, Baseline, 07-10-2026 (before any phase), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases, Phase 0: setup (right after approval), Phase 1: quick fixes and safety (+9 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "makeNurse"
Cohesion: 0.07
Nodes (27): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+19 more)

### Community 72 - "guide-with-code.mjs"
Cohesion: 0.10
Nodes (11): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+3 more)

### Community 73 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 74 - "PublishModal.tsx"
Cohesion: 0.21
Nodes (17): Request, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), nurseLinkUrl(), DispatchResult (+9 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.11
Nodes (15): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+7 more)

### Community 77 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 78 - "ui/index.ts"
Cohesion: 0.17
Nodes (21): Card(), Crumb, PageHeader(), cx(), Dialog(), WIDTHS, Checkbox(), DateInput() (+13 more)

### Community 79 - "dialogs.tsx"
Cohesion: 0.24
Nodes (10): ConfirmOptions, DialogState, dismissNotice(), listeners, Notice, PendingConfirm, setState(), settleConfirm() (+2 more)

### Community 80 - "Sidebar.tsx"
Cohesion: 0.36
Nodes (7): APP_NAME, SCREEN_NAMES, screenTitle(), NAV_ITEMS, SidebarProps, DashboardViewProps, AppRoute

### Community 81 - "publicRosterService.ts"
Cohesion: 0.31
Nodes (6): pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster(), deleteEntireSchedule(), ScheduleDeleteResult

### Community 82 - "handMoveChecks.ts"
Cohesion: 0.24
Nodes (15): Other engine files, FairnessModal(), listProblem(), checkSwap(), isPinnedShift(), MoveContext, newFindings(), rebalancedFields() (+7 more)

### Community 83 - "types/index.ts"
Cohesion: 0.06
Nodes (33): applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind (+25 more)

### Community 84 - "weekHours.test.ts"
Cohesion: 0.09
Nodes (13): ScheduleValidator, SENIOR, DR_PEDS, ENT, FULL, PEDS, RULES, EARLY (+5 more)

### Community 85 - "uiComponents.test.ts"
Cohesion: 0.20
Nodes (12): Badge(), PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, nextTabIndex(), TabItem (+4 more)

### Community 86 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 87 - "Button.tsx"
Cohesion: 0.21
Nodes (11): Button(), ButtonProps, ButtonSize, ButtonVariant, IconButtonProps, SIZES, VARIANTS, EmptyState() (+3 more)

### Community 88 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 89 - "access.ts"
Cohesion: 0.21
Nodes (13): 3. Users, roles and access, 4. Navigation and app shell, AppContext, AppContextValue, usePermissions(), canAccessRoute(), canEditClinicData(), canExportReports() (+5 more)

### Community 90 - "apiApp.ts"
Cohesion: 0.17
Nodes (12): express, @google/genai, BackendRole, authRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions (+4 more)

### Community 91 - "UI overhaul: checklist"
Cohesion: 0.17
Nodes (11): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs (+3 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "16. History of work (for context)"
Cohesion: 0.44
Nodes (8): 16. History of work (for context), addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 94 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "DataTable.tsx"
Cohesion: 0.33
Nodes (6): Column, DataTable(), SortDirection, sortRows(), SortState, Phase 6: Nurses, Doctors, Availability and Requests (planner screens)

### Community 97 - "ref_node_assert"
Cohesion: 0.09
Nodes (20): LATE, nurse, ANNUAL_LEAVE, DAY_DUTY, UNPAID_LEAVE, LONG, NOV, OCT (+12 more)

### Community 98 - "authorizedFetch"
Cohesion: 0.31
Nodes (8): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "colorContrast.ts"
Cohesion: 0.50
Nodes (7): contrastRatio(), INK, INK_MUTED, luminance(), readableTextOn(), rgbOf(), tint()

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "emailLogSize.ts"
Cohesion: 0.39
Nodes (5): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), EmailRecipientLog

### Community 104 - "react"
Cohesion: 0.13
Nodes (30): lucide-react, react, uuid, NoticeTone, openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModal() (+22 more)

### Community 109 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

## Knowledge Gaps
- **798 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+793 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 969 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `analysisExportService.ts`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `VersionCompareModal.tsx`, `SchedulesView.tsx`, `DashboardView.tsx`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `doctorScheduleService.ts`, `DoctorsScheduleSheet.tsx`, `EmailTab.tsx`, `ui.tsx`, `NSC Clinic Roster: complete project guide`, `RulesTab.tsx`, `hoursBalance.ts`, `PublishModal.tsx`, `Design system: NSC Clinic Roster`, `ui/index.ts`, `dialogs.tsx`, `Sidebar.tsx`, `uiComponents.test.ts`, `Button.tsx`, `access.ts`, `harness/main.tsx`, `DataTable.tsx`, `ref_node_assert`, `NurseSample.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `analysisExportService.ts`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `getRepository`, `App.tsx`, `VersionCompareModal.tsx`, `SchedulesView.tsx`, `DashboardView.tsx`, `WorkbookGrid.tsx`, `PlannerSample.tsx`, `doctorScheduleService.ts`, `DoctorsScheduleSheet.tsx`, `EmailTab.tsx`, `ui.tsx`, `RulesTab.tsx`, `hoursBalance.ts`, `PublishModal.tsx`, `ui/index.ts`, `dialogs.tsx`, `Sidebar.tsx`, `uiComponents.test.ts`, `Button.tsx`, `harness/main.tsx`, `DataTable.tsx`, `NurseSample.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `NSC Clinic Roster: complete project guide` connect `NSC Clinic Roster: complete project guide` to `access.ts`, `Assignment`, `makeNurse`, `getRepository`, `CollectionSyncer`, `WorkbookGrid.tsx`, `holidayLeave.ts`, `DashboardView.tsx`, `16. History of work (for context)`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _798 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `analysisExportService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07782898105478751 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `quotaTracker` be split into smaller, more focused modules?**
  _Cohesion score 0.1368421052631579 - nodes in this community are weakly interconnected._