# Graph Report - NSC-Clinic-Roster  (2026-10-03)

## Corpus Check
- 183 files · ~227,916 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .example 1, .lock 1)

## Summary
- 1368 nodes · 5014 edges · 74 communities (67 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 125 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8e954cbc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- DutiesTab.tsx
- analysisExportService.ts
- clinicModel.test.ts
- PublishView.tsx
- WorkbookGrid.tsx
- react
- quotaTracker
- rules.test.mjs
- package.json
- AppShell.tsx
- dependencies
- app.ts
- authService
- App.tsx
- EntityForCollection
- DashboardView.tsx
- seedRunner.ts
- firebaseIdentityService.ts
- Sidebar.tsx
- compilerOptions
- FairnessModal.tsx
- authService.ts
- FirestoreRepository
- devDependencies
- AllRequestsPanel.tsx
- SchedulesView.tsx
- I18nManager
- scripts
- types/index.ts
- server.ts
- dateFormatter.ts
- icsExportService.ts
- RulesTab.tsx
- CreateScheduleModal.tsx
- analysisExport.test.ts
- What You Must Do When Invoked
- emailService.ts
- rosterSaving.test.ts
- SettingsView.tsx
- fixtures.ts
- makeNurse
- LiveCollectionCache
- nurseClinicFloat.test.ts
- staffRequestService.ts
- doctorScheduleService.ts
- IRepository
- QuickCellPopup.tsx
- SchedulingEngine.ts
- nurseRosterService.ts
- NSC Clinic Roster: complete project guide
- middleware/auth.ts
- graphify reference: extra exports and benchmark
- lastResort.test.ts
- SeniorityLevel
- usePresence.ts
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
- AvailabilityView.tsx
- explainCell.test.ts
- getRepository
- preferenceFocus.test.ts
- yearFairness.test.ts
- IRepository.ts
- newRosterDates.ts
- liveCollectionCache.ts

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 91 edges
2. `Nurse` - 79 edges
3. `Assignment` - 79 edges
4. `DutyWindow` - 77 edges
5. `Schedule` - 74 edges
6. `react` - 70 edges
7. `useDialogA11y()` - 64 edges
8. `ClinicalRole` - 63 edges
9. `lucide-react` - 62 edges
10. `Doctor` - 62 edges

## Surprising Connections (you probably didn't know these)
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx
- `4. Navigation and app shell` --references--> `useDialogA11y()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/useDialogA11y.ts

## Import Cycles
- None detected.

## Communities (74 total, 7 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.14
Nodes (62): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, PublishModalProps, ShareModalProps, SwapManagerModalProps (+54 more)

### Community 1 - "DutiesTab.tsx"
Cohesion: 0.13
Nodes (23): DatabaseTabProps, DutiesTab(), DutiesTabProps, shiftHours(), HolidaysTabProps, BUILT_IN_LEAVE_CODES, isBuiltInCode(), LeaveTab() (+15 more)

### Community 2 - "analysisExportService.ts"
Cohesion: 0.07
Nodes (59): 10. Hours, jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES (+51 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "PublishView.tsx"
Cohesion: 0.22
Nodes (17): 12. Publishing and nurse links, EmailHtmlPreview(), PublishModal(), Step, PublishTab, PublishView(), computeScheduleDiff(), ensureNurseLink() (+9 more)

### Community 5 - "WorkbookGrid.tsx"
Cohesion: 0.12
Nodes (27): cellKeyOf(), fmtHours(), isDayProblem(), localTodayIso(), SOURCE_WORDS, WEEKDAY_ABBR, withDr(), WorkbookGrid() (+19 more)

### Community 6 - "react"
Cohesion: 0.16
Nodes (29): lucide-react, react, uuid, ConfirmBox(), confirmDialog(), ConfirmOptions, DialogHost(), DialogState (+21 more)

### Community 7 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (23): firebase, name, private, type, version, autoprefixer, cors, date-fns (+15 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.13
Nodes (27): 4. Navigation and app shell, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView (+19 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+15 more)

### Community 12 - "app.ts"
Cohesion: 0.15
Nodes (11): express, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react, startServer(), BackendRole (+3 more)

### Community 13 - "authService"
Cohesion: 0.12
Nodes (7): authService, defaultFirebaseConfig, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 14 - "App.tsx"
Cohesion: 0.14
Nodes (12): App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary, Props (+4 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.17
Nodes (7): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, EntityForCollection

### Community 16 - "DashboardView.tsx"
Cohesion: 0.14
Nodes (26): Card(), DashboardView(), loadPlannerData(), loadViewerData(), longDate(), PlannerData, readStoredId(), TodayList() (+18 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.13
Nodes (24): DatabaseTab(), latestPublishedVersion(), loadEarlierRosters(), removeNurseRoster(), revokeNurseLink(), deleteEntireSchedule(), ALL_COLLECTIONS, BackupCheck (+16 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.16
Nodes (17): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+9 more)

### Community 19 - "Sidebar.tsx"
Cohesion: 0.17
Nodes (13): NAV_ITEMS, SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DashboardViewProps, DICTIONARY, i18n (+5 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "FairnessModal.tsx"
Cohesion: 0.20
Nodes (17): FairnessModal(), NurseFairnessMetrics, ProposedSwap, YearToDate, isLateDuty(), lateDutyThreshold(), cacheKey(), computeYearToDate() (+9 more)

### Community 22 - "authService.ts"
Cohesion: 0.11
Nodes (23): LoginPageProps, AppShellProps, TopBarProps, AuthModalProps, AccessManagementPanelProps, AllRequestsPanelProps, ApprovalsQueuePanelProps, AuditTrailViewProps (+15 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "AllRequestsPanel.tsx"
Cohesion: 0.18
Nodes (15): 16. History of work (for context), AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE, StatusFilter, weekdayOf() (+7 more)

### Community 26 - "SchedulesView.tsx"
Cohesion: 0.07
Nodes (47): MenuButton(), MenuButtonProps, MenuItem, DeleteScheduleModal(), DeleteScheduleModalProps, fmtHours(), NurseTimesheetModal(), SOURCE_LABELS (+39 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.09
Nodes (23): CellChoice, PREFERENCE_FOCUS_LABELS, ApprovalStatus, AssignmentKind, DoctorSessionSource, EmailLogKind, EmailLogStatus, InvitationStatus (+15 more)

### Community 30 - "server.ts"
Cohesion: 0.29
Nodes (3): __dirname, distServer, __filename

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "icsExportService.ts"
Cohesion: 0.16
Nodes (18): RFC-5545, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), NurseRosterIcsInput (+10 more)

### Community 33 - "RulesTab.tsx"
Cohesion: 0.12
Nodes (22): 7. Rules, ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef (+14 more)

### Community 34 - "CreateScheduleModal.tsx"
Cohesion: 0.25
Nodes (13): CreateScheduleModal(), CreateScheduleModalProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDatesInRange(), getDaysInPeriod(), getInclusiveDays(), getPeriodDailyRate() (+5 more)

### Community 35 - "analysisExport.test.ts"
Cohesion: 0.15
Nodes (14): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+6 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "emailService.ts"
Cohesion: 0.17
Nodes (12): nodemailer, requirePlanner, emailRouter, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload (+4 more)

### Community 38 - "rosterSaving.test.ts"
Cohesion: 0.11
Nodes (11): diff(), LATE, nurse, DAY_DUTY, SENIOR, LATE, schedule, wishFindings() (+3 more)

### Community 39 - "SettingsView.tsx"
Cohesion: 0.15
Nodes (22): ClinicTab(), ClinicTabProps, EmailTab(), EmailTabProps, HolidaysTab(), SaveStatus, SettingsDialogProps, SettingsTab (+14 more)

### Community 40 - "fixtures.ts"
Cohesion: 0.21
Nodes (9): ANNUAL_LEAVE, UNPAID_LEAVE, D, E, L, NC, PHL, SENIOR (+1 more)

### Community 41 - "makeNurse"
Cohesion: 0.19
Nodes (15): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account(), doctorOfAmy() (+7 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "staffRequestService.ts"
Cohesion: 0.21
Nodes (15): NurseSelfServicePanel(), inclusiveDays(), leaveCreditInRange(), leaveCreditPerDay(), leaveDaysInRange(), cancelAvailabilityRequest(), cancelLeaveRequest(), daysInclusive() (+7 more)

### Community 45 - "doctorScheduleService.ts"
Cohesion: 0.33
Nodes (10): 13. Screens in detail, EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), getWeekdayFromIsoDate(), PopulateRecurringDoctorSessionsResult (+2 more)

### Community 46 - "IRepository"
Cohesion: 0.12
Nodes (9): 17. Known quirks and ideas for later, WalkthroughModal(), WalkthroughModalProps, fingerprint(), syncScheduleAssignments(), repositoryManager, IRepository, DeleteDoctorShiftParams (+1 more)

### Community 47 - "QuickCellPopup.tsx"
Cohesion: 0.29
Nodes (7): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption

### Community 48 - "SchedulingEngine.ts"
Cohesion: 0.13
Nodes (30): CoverageSheetProps, bloodCollectionRole(), canBeFreeNurse(), coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes(), hoursToCover() (+22 more)

### Community 49 - "nurseRosterService.ts"
Cohesion: 0.14
Nodes (24): DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps, shortDate(), downloadIcsFile() (+16 more)

### Community 50 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.15
Nodes (13): 0. Quick start for a new chat, 14. Server, security and config, 1. Features at a glance, 2. Repository layout, 6. Clinic model (the business rules in plain English), 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), Entry points (+5 more)

### Community 51 - "middleware/auth.ts"
Cohesion: 0.19
Nodes (11): authMiddleware(), AuthUser, Express, Request, requireOwner, ROLE_HIERARCHY, verifyToken(), DispatchResult (+3 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "lastResort.test.ts"
Cohesion: 0.22
Nodes (7): isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES

### Community 54 - "SeniorityLevel"
Cohesion: 0.32
Nodes (10): NurseTimesheetModalProps, SortField, TabMode, calculateClinicHoursMetrics(), ClinicHoursMetrics, HoursAccountingStatus, NurseHoursAccounting, WEEKDAY_NAMES (+2 more)

### Community 55 - "usePresence.ts"
Cohesion: 0.29
Nodes (6): othersOnRoster(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, now

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
Cohesion: 0.13
Nodes (11): ScheduleValidator, DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run() (+3 more)

### Community 66 - "AvailabilityView.tsx"
Cohesion: 0.26
Nodes (13): 3. Users, roles and access, ApprovalsQueuePanel(), AvailabilityView(), WEEKDAY_ABBR, canApproveRequests(), canEditClinicData(), VIEWER_ROUTES, InternalSlot (+5 more)

### Community 67 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 68 - "getRepository"
Cohesion: 0.20
Nodes (16): 11. Saving, live updates, versions, ShareModal(), TabType, PublishedRosterView(), loadPublishedRoster(), ensurePublicRosters(), loadPublicRoster(), pick() (+8 more)

### Community 69 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 70 - "yearFairness.test.ts"
Cohesion: 0.24
Nodes (7): clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), clearYearToDateCache(), LATE

### Community 71 - "IRepository.ts"
Cohesion: 0.48
Nodes (4): FirebaseClientConfig, SubscribeCallback, Unsubscribe, CollectionName

### Community 72 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 73 - "liveCollectionCache.ts"
Cohesion: 0.33
Nodes (4): CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS

## Knowledge Gaps
- **383 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+378 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 469 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `DutiesTab.tsx`, `analysisExportService.ts`, `PublishView.tsx`, `WorkbookGrid.tsx`, `package.json`, `AppShell.tsx`, `App.tsx`, `DashboardView.tsx`, `seedRunner.ts`, `Sidebar.tsx`, `FairnessModal.tsx`, `authService.ts`, `AllRequestsPanel.tsx`, `SchedulesView.tsx`, `RulesTab.tsx`, `CreateScheduleModal.tsx`, `SettingsView.tsx`, `staffRequestService.ts`, `doctorScheduleService.ts`, `IRepository`, `QuickCellPopup.tsx`, `SchedulingEngine.ts`, `nurseRosterService.ts`, `SeniorityLevel`, `usePresence.ts`, `AvailabilityView.tsx`, `getRepository`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `DutiesTab.tsx`, `analysisExportService.ts`, `PublishView.tsx`, `WorkbookGrid.tsx`, `package.json`, `AppShell.tsx`, `App.tsx`, `DashboardView.tsx`, `seedRunner.ts`, `Sidebar.tsx`, `FairnessModal.tsx`, `authService.ts`, `AllRequestsPanel.tsx`, `SchedulesView.tsx`, `RulesTab.tsx`, `CreateScheduleModal.tsx`, `SettingsView.tsx`, `staffRequestService.ts`, `doctorScheduleService.ts`, `QuickCellPopup.tsx`, `SchedulingEngine.ts`, `nurseRosterService.ts`, `SeniorityLevel`, `AvailabilityView.tsx`, `getRepository`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `analysisExportService.ts`, `clinicModel.test.ts`, `PublishView.tsx`, `WorkbookGrid.tsx`, `react`, `DashboardView.tsx`, `FairnessModal.tsx`, `SchedulesView.tsx`, `types/index.ts`, `icsExportService.ts`, `analysisExport.test.ts`, `rosterSaving.test.ts`, `fixtures.ts`, `nurseClinicFloat.test.ts`, `doctorScheduleService.ts`, `IRepository`, `SchedulingEngine.ts`, `nurseRosterService.ts`, `lastResort.test.ts`, `SeniorityLevel`, `approvedDayOff.test.ts`, `explainCell.test.ts`, `yearFairness.test.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _383 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.1445966514459665 - nodes in this community are weakly interconnected._
- **Should `DutiesTab.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13227513227513227 - nodes in this community are weakly interconnected._
- **Should `analysisExportService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06784260515603799 - nodes in this community are weakly interconnected._