# Graph Report - NSC-Clinic-Roster  (2026-10-07)

## Corpus Check
- 233 files · ~296,850 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .css 2, .example 1)

## Summary
- 1828 nodes · 6393 edges · 88 communities (81 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 198 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d130e278`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types/index.ts
- rosterPdfService.ts
- hoursBalance.ts
- clinicModel.test.ts
- nurseRosterService.ts
- authService.ts
- getRepository
- authService
- firestore-rules/package.json
- package.json
- AppShell.tsx
- dependencies
- middleware/auth.ts
- staffRequestService.ts
- App.tsx
- EntityForCollection
- DashboardView.tsx
- fixtures.ts
- firebaseIdentityService.ts
- react
- compilerOptions
- RulesTab.tsx
- seedRunner.ts
- FirestoreRepository
- devDependencies
- emailService.ts
- yearToDate.ts
- IRepository
- scripts
- usePresence.ts
- assignmentChecks.ts
- dateFormatter.ts
- Hardening Controls
- dialogs.tsx
- analysisExportService.ts
- Code Review and Quality
- What You Must Do When Invoked
- LiveCollectionCache
- SchedulesView.tsx
- hoursTopUp.test.ts
- Optimization Patterns
- makeNurse
- NSC Clinic Roster: complete project guide
- nurseClinicFloat.test.ts
- Frontend UI Engineering
- quotaTracker
- PublishModal
- server.ts
- SchedulingEngine.ts
- WorkbookGrid.tsx
- savingSafety.test.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- ScheduleValidator.ts
- PublishedRosterView.tsx
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
- EmailTab.tsx
- Find Skills
- repository/index.ts
- hoursRules.test.ts
- rules.test.mjs
- createLiveReconciler
- DoctorsView.tsx
- navigation.ts
- ref_node_assert
- AvailabilityView.tsx
- README.md
- NurseSelfServicePanel.tsx
- sharing.test.ts
- dateUtils.ts
- IRepository.ts
- ClinicRoster
- WhoCanCover.tsx
- preferenceOrder.ts
- engineRules.test.ts
- nurseRoster.test.ts
- newRosterDates.ts
- hoursDecisions.test.ts

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 98 edges
2. `getRepository()` - 96 edges
3. `Schedule` - 85 edges
4. `Nurse` - 82 edges
5. `DutyWindow` - 81 edges
6. `react` - 74 edges
7. `Doctor` - 70 edges
8. `useDialogA11y()` - 66 edges
9. `lucide-react` - 63 edges
10. `ClinicalRole` - 63 edges

## Surprising Connections (you probably didn't know these)
- `9. Checking a roster (`src/services/validation/ScheduleValidator.ts`)` --references--> `recordHolidayDayOff()`  [INFERRED]
  PROJECT_GUIDE.md → src/services/requests/staffRequestService.ts
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx
- `11. Saving, live updates, versions` --references--> `signOutSafely()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/signOut.ts
- `4. Navigation and app shell` --references--> `useDialogA11y()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/useDialogA11y.ts

## Import Cycles
- None detected.

## Communities (88 total, 7 thin omitted)

### Community 0 - "types/index.ts"
Cohesion: 0.05
Nodes (137): 5. Data model (Firestore collections), Request, BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, ExportTab, WEEKDAY_NAMES, FairnessModalProps (+129 more)

### Community 1 - "rosterPdfService.ts"
Cohesion: 0.07
Nodes (41): jspdf, jspdf-autotable, xlsx, ExportModal(), fmtHours(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS (+33 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.07
Nodes (51): ReportsView(), SortField, TabMode, fmtHours(), HoursAccountingSheet(), askedCarry(), closePeriod(), countedEarlierRosters() (+43 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "nurseRosterService.ts"
Cohesion: 0.15
Nodes (26): dateLabel(), PublishedRosterSheet(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+18 more)

### Community 5 - "authService.ts"
Cohesion: 0.13
Nodes (23): signOutSafely(), AppShellProps, TopBar(), TopBarProps, AuthModal(), AuthModalProps, AccessManagementPanelProps, ApprovalsQueuePanelProps (+15 more)

### Community 6 - "getRepository"
Cohesion: 0.14
Nodes (41): confirmDialog(), notify(), TemplateModal(), AccessManagementPanel(), NursesView(), ClinicTab(), ClinicTabProps, DatabaseTabProps (+33 more)

### Community 7 - "authService"
Cohesion: 0.12
Nodes (7): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 8 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (24): firebase, name, private, type, version, autoprefixer, cors, date-fns (+16 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.19
Nodes (20): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+12 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.13
Nodes (17): express, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), authMiddleware(), BackendRole (+9 more)

### Community 13 - "staffRequestService.ts"
Cohesion: 0.18
Nodes (20): 3. Users, roles and access, AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+12 more)

### Community 14 - "App.tsx"
Cohesion: 0.13
Nodes (14): 4. Navigation and app shell, App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps (+6 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.13
Nodes (9): 11. Saving, live updates, versions, CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, rebaseEdit() (+1 more)

### Community 16 - "DashboardView.tsx"
Cohesion: 0.13
Nodes (27): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+19 more)

### Community 17 - "fixtures.ts"
Cohesion: 0.08
Nodes (27): 15. Tests, inclusiveDays(), leaveCreditPerDay(), CARD, input(), KHAN, LATE, SCHEDULE (+19 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.14
Nodes (19): jose, AuthUser, calendarRouter, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig (+11 more)

### Community 19 - "react"
Cohesion: 0.20
Nodes (15): lucide-react, react, uuid, openStack, useDialogA11y(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal() (+7 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "RulesTab.tsx"
Cohesion: 0.10
Nodes (29): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+21 more)

### Community 22 - "seedRunner.ts"
Cohesion: 0.14
Nodes (21): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+13 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "emailService.ts"
Cohesion: 0.19
Nodes (13): emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult (+5 more)

### Community 26 - "yearToDate.ts"
Cohesion: 0.18
Nodes (16): isLateDuty(), computeYearToDate(), earlierRostersThisYear(), emptyCounts(), latestPublishedVersion(), loadEarlierRosters(), LoadedRoster, loadPublishedRoster() (+8 more)

### Community 27 - "IRepository"
Cohesion: 0.10
Nodes (14): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, saveHolidayLeave(), fingerprint(), syncScheduleAssignments(), repositoryManager (+6 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "usePresence.ts"
Cohesion: 0.29
Nodes (6): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

### Community 30 - "assignmentChecks.ts"
Cohesion: 0.21
Nodes (19): Other engine files, checkAssignment(), hardRule(), listProblem(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole() (+11 more)

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "dialogs.tsx"
Cohesion: 0.18
Nodes (13): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, NoticeTone (+5 more)

### Community 34 - "analysisExportService.ts"
Cohesion: 0.15
Nodes (17): 6. Clinic model (the business rules in plain English), resolveClinicSetup(), isExclusiveNurseClinic(), ANALYSIS_FORMAT, ANALYSIS_FORMAT_VERSION, analysisFileName(), buildRosterAnalysis(), countBy() (+9 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "LiveCollectionCache"
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 38 - "SchedulesView.tsx"
Cohesion: 0.12
Nodes (29): MenuButton(), MenuButtonProps, MenuItem, FairnessModal(), SwapManagerModal(), VersionCompareModal(), readStoredScheduleId(), SchedulesView() (+21 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "makeNurse"
Cohesion: 0.08
Nodes (34): SchedulingEngine, DAY_DUTY, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup() (+26 more)

### Community 42 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.18
Nodes (10): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide (+2 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "quotaTracker"
Cohesion: 0.14
Nodes (7): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter, UNCACHED_COLLECTIONS

### Community 46 - "PublishModal"
Cohesion: 0.19
Nodes (16): 12. Publishing and nurse links, EmailHtmlPreview(), PublishModal(), PublishView(), ensureNurseLink(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink() (+8 more)

### Community 47 - "server.ts"
Cohesion: 0.18
Nodes (3): builtServer, __dirname, __filename

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.11
Nodes (27): ClinicSetup, DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes(), hoursToCover(), openingHourSlots(), ResolvedClinicSetup, toMinutes() (+19 more)

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.13
Nodes (24): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, CellChoice (+16 more)

### Community 50 - "savingSafety.test.ts"
Cohesion: 0.12
Nodes (10): clearYearToDateCache(), forgetCachedRoster(), afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS, apps (+2 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "ScheduleValidator.ts"
Cohesion: 0.17
Nodes (18): 7. Rules, isFreeDuring(), overlaps(), explainNurseDay(), plainReason(), round1(), shiftDate(), unique() (+10 more)

### Community 54 - "PublishedRosterView.tsx"
Cohesion: 0.12
Nodes (25): RFC-5545, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, buildNurseIcs(), buildNurseRosterIcs(), downloadIcsFile(), escapeIcsText() (+17 more)

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

### Community 66 - "EmailTab.tsx"
Cohesion: 0.29
Nodes (9): nodemailer, EmailTab(), authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), escapeHtml(), configured (+1 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "repository/index.ts"
Cohesion: 0.23
Nodes (13): ShareModal(), TabType, DatabaseTab(), defaultFirebaseConfig, ensurePublicRosters(), pick(), removePublicRoster(), syncPublicRoster() (+5 more)

### Community 69 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 70 - "rules.test.mjs"
Cohesion: 0.15
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 71 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 72 - "DoctorsView.tsx"
Cohesion: 0.14
Nodes (28): 13. Screens in detail, BulkImportModal(), CreateScheduleModal(), CreateScheduleModalProps, DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, EditDoctorShiftModal() (+20 more)

### Community 73 - "navigation.ts"
Cohesion: 0.23
Nodes (10): NAV_ITEMS, SidebarProps, VIEWER_ROUTES, DICTIONARY, i18n, Language, t(), Translations (+2 more)

### Community 74 - "ref_node_assert"
Cohesion: 0.07
Nodes (21): ScheduleValidator, diff(), LATE, nurse, LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS (+13 more)

### Community 75 - "AvailabilityView.tsx"
Cohesion: 0.19
Nodes (17): 10. Hours, ApprovalsQueuePanel(), AvailabilityView(), WEEKDAY_ABBR, leaveApprovalFields(), applyHolidayChangeToLeave(), DatedLeave, datesOf() (+9 more)

### Community 77 - "NurseSelfServicePanel.tsx"
Cohesion: 0.39
Nodes (8): NurseSelfServicePanel(), cancelAvailabilityRequest(), cancelLeaveRequest(), daysInclusive(), listMyRequests(), requireNurseId(), submitAvailabilityRequest(), submitLeaveRequest()

### Community 78 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 79 - "dateUtils.ts"
Cohesion: 0.21
Nodes (13): WorkingHoursPeriodsPanel(), WorkingHoursPeriodsPanelProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate(), PeriodProratingBreakdown (+5 more)

### Community 80 - "IRepository.ts"
Cohesion: 0.27
Nodes (5): FirebaseClientConfig, SubscribeCallback, Unsubscribe, ScheduleDeleteResult, CollectionName

### Community 81 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 82 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 83 - "preferenceOrder.ts"
Cohesion: 0.22
Nodes (9): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, GenerationResult, NursePreference (+1 more)

### Community 84 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 85 - "nurseRoster.test.ts"
Cohesion: 0.25
Nodes (5): NURSE_TOKEN_PATTERN, base, dutyWindows, refs, schedule

### Community 86 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 87 - "hoursDecisions.test.ts"
Cohesion: 0.33
Nodes (3): LONG, NOV, OCT

## Knowledge Gaps
- **608 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+603 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 736 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `types/index.ts`, `rosterPdfService.ts`, `hoursBalance.ts`, `nurseRosterService.ts`, `authService.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `staffRequestService.ts`, `App.tsx`, `DashboardView.tsx`, `RulesTab.tsx`, `usePresence.ts`, `dialogs.tsx`, `SchedulesView.tsx`, `makeNurse`, `NSC Clinic Roster: complete project guide`, `WorkbookGrid.tsx`, `PublishedRosterView.tsx`, `EmailTab.tsx`, `repository/index.ts`, `DoctorsView.tsx`, `navigation.ts`, `AvailabilityView.tsx`, `NurseSelfServicePanel.tsx`, `dateUtils.ts`, `WhoCanCover.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `Assignment` connect `types/index.ts` to `rosterPdfService.ts`, `hoursBalance.ts`, `clinicModel.test.ts`, `nurseRosterService.ts`, `DashboardView.tsx`, `fixtures.ts`, `react`, `yearToDate.ts`, `IRepository`, `assignmentChecks.ts`, `analysisExportService.ts`, `SchedulesView.tsx`, `makeNurse`, `nurseClinicFloat.test.ts`, `SchedulingEngine.ts`, `WorkbookGrid.tsx`, `savingSafety.test.ts`, `ScheduleValidator.ts`, `PublishedRosterView.tsx`, `hoursRules.test.ts`, `DoctorsView.tsx`, `ref_node_assert`, `sharing.test.ts`, `preferenceOrder.ts`, `engineRules.test.ts`, `nurseRoster.test.ts`, `hoursDecisions.test.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `types/index.ts`, `rosterPdfService.ts`, `hoursBalance.ts`, `nurseRosterService.ts`, `authService.ts`, `getRepository`, `package.json`, `AppShell.tsx`, `staffRequestService.ts`, `App.tsx`, `DashboardView.tsx`, `RulesTab.tsx`, `dialogs.tsx`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `PublishedRosterView.tsx`, `EmailTab.tsx`, `repository/index.ts`, `DoctorsView.tsx`, `navigation.ts`, `AvailabilityView.tsx`, `NurseSelfServicePanel.tsx`, `dateUtils.ts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _608 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.052218782249742 - nodes in this community are weakly interconnected._
- **Should `rosterPdfService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0726950354609929 - nodes in this community are weakly interconnected._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07393483709273183 - nodes in this community are weakly interconnected._