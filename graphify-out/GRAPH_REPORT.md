# Graph Report - NSC-Clinic-Roster  (2026-10-03)

## Corpus Check
- 179 files · ~220,298 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .example 1, .lock 1)

## Summary
- 1329 nodes · 4865 edges · 65 communities (58 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 120 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `58464f86`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- SettingsView.tsx
- ExportModal.tsx
- clinicModel.test.ts
- PublishView.tsx
- CreateScheduleModal.tsx
- getRepository
- authService.ts
- firestore-rules/package.json
- package.json
- AppShell.tsx
- dependencies
- middleware/auth.ts
- authService
- App.tsx
- EntityForCollection
- DashboardView
- seedRunner.ts
- firebaseIdentityService.ts
- Sidebar.tsx
- compilerOptions
- SchedulingEngine.ts
- react
- FirestoreRepository
- devDependencies
- analysisExportService.ts
- SchedulesView.tsx
- I18nManager
- scripts
- types/index.ts
- server.ts
- dateFormatter.ts
- nurseRosterService.ts
- DoctorSession
- yearToDate.ts
- fixtures.ts
- What You Must Do When Invoked
- rules.test.mjs
- makeNurse
- ref_node_assert
- hoursRules.test.ts
- preferenceFocus.test.ts
- LiveCollectionCache
- nurseClinicFloat.test.ts
- IRepository.ts
- newRosterDates.ts
- IRepository
- WorkbookGrid.tsx
- ScheduleValidator.ts
- syncScheduleAssignments
- explainCell.ts
- dialogs.tsx
- graphify reference: extra exports and benchmark
- rosterSaving.test.ts
- hoursPolicy.ts
- weekend.ts
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 86 edges
2. `Assignment` - 78 edges
3. `Nurse` - 77 edges
4. `DutyWindow` - 75 edges
5. `Schedule` - 74 edges
6. `react` - 69 edges
7. `ClinicalRole` - 63 edges
8. `useDialogA11y()` - 62 edges
9. `Doctor` - 62 edges
10. `lucide-react` - 61 edges

## Surprising Connections (you probably didn't know these)
- `4. Navigation and app shell` --references--> `LoginPage()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/auth/LoginPage.tsx
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx
- `4. Navigation and app shell` --references--> `AppShell()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/layout/AppShell.tsx
- `13. Screens in detail` --references--> `ApprovalsQueuePanel()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/views/ApprovalsQueuePanel.tsx

## Import Cycles
- None detected.

## Communities (65 total, 7 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.08
Nodes (95): 5. Data model (Firestore collections), uuid, BulkImportModalProps, DeleteScheduleModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps (+87 more)

### Community 1 - "SettingsView.tsx"
Cohesion: 0.12
Nodes (44): confirmDialog(), notify(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTab(), DatabaseTabProps, DutiesTab() (+36 more)

### Community 2 - "ExportModal.tsx"
Cohesion: 0.10
Nodes (37): jspdf, jspdf-autotable, xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, isFloatShift() (+29 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "PublishView.tsx"
Cohesion: 0.07
Nodes (46): 12. Publishing and nurse links, nodemailer, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, SendEmailResult (+38 more)

### Community 5 - "CreateScheduleModal.tsx"
Cohesion: 0.18
Nodes (17): CreateScheduleModal(), CreateScheduleModalProps, WorkingHoursPeriodsPanel(), WorkingHoursPeriodsPanelProps, calculateWorkingHoursForDateRange(), findExactMatchingPeriod(), getDatesInRange(), getDaysInPeriod() (+9 more)

### Community 6 - "getRepository"
Cohesion: 0.28
Nodes (15): NurseSelfServicePanel(), getRepository(), cancelAvailabilityRequest(), cancelLeaveRequest(), daysInclusive(), decideRequest(), isManagerOrOwner(), isPendingLeave() (+7 more)

### Community 7 - "authService.ts"
Cohesion: 0.10
Nodes (14): MASTER_ADMIN_EMAIL, UserPrivileges, FirebaseConfig, getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs(), QuotaExceededError (+6 more)

### Community 8 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (25): firebase, name, private, type, version, autoprefixer, cors, date-fns (+17 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.17
Nodes (21): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+13 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+15 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.13
Nodes (18): express, express-rate-limit, helmet, startServer(), authMiddleware(), AuthUser, BackendRole, Express (+10 more)

### Community 13 - "authService"
Cohesion: 0.14
Nodes (4): authorizedFetch(), authService, computePrivileges(), getAppAuth()

### Community 14 - "App.tsx"
Cohesion: 0.16
Nodes (11): react-dom, App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+3 more)

### Community 15 - "EntityForCollection"
Cohesion: 0.16
Nodes (7): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, EntityForCollection

### Community 16 - "DashboardView"
Cohesion: 0.29
Nodes (10): 3. Users, roles and access, TopBar(), Card(), DashboardView(), longDate(), TodayList(), canAccessRoute(), canApproveRequests() (+2 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.16
Nodes (14): ALL_COLLECTIONS, BackupCheck, clearDatabase(), ClearResult, DatabaseStats, downloadFullDatabaseBackup(), ensureWorkingHoursPeriodsDefaults(), exportFullDatabaseBackup() (+6 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.15
Nodes (18): jose, verifyToken(), AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+10 more)

### Community 19 - "Sidebar.tsx"
Cohesion: 0.16
Nodes (14): NAV_ITEMS, Sidebar(), SidebarProps, ShortcutItem, SHORTCUTS, ShortcutsModalProps, DashboardViewProps, DICTIONARY (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "SchedulingEngine.ts"
Cohesion: 0.13
Nodes (19): YearToDate, YearToDateCounts, daysBefore(), findPreviousSchedule(), loadClinicSetup(), consecutiveLateRuleOf(), InternalSlot, lateDutyThreshold() (+11 more)

### Community 22 - "react"
Cohesion: 0.10
Nodes (38): 4. Navigation and app shell, lucide-react, react, LoginPageProps, Props, State, openStack, useDialogA11y() (+30 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "analysisExportService.ts"
Cohesion: 0.19
Nodes (15): 6. Clinic model (the business rules in plain English), canBeFreeNurse(), resolveClinicSetup(), isExclusiveNurseClinic(), ANALYSIS_FORMAT_VERSION, buildRosterAnalysis(), countBy(), FIELD_GUIDE (+7 more)

### Community 26 - "SchedulesView.tsx"
Cohesion: 0.11
Nodes (34): MenuButton(), MenuButtonProps, MenuItem, FairnessModal(), ShareModal(), SwapManagerModal(), TemplateModal(), VersionCompareModal() (+26 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.08
Nodes (25): othersOnRoster(), STALE_MS, TAB_ID, ApprovalStatus, AuditAction, AuditEvent, DoctorSessionSource, EmailLogKind (+17 more)

### Community 30 - "server.ts"
Cohesion: 0.29
Nodes (3): __dirname, distServer, __filename

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "nurseRosterService.ts"
Cohesion: 0.08
Nodes (45): RFC-5545, loadViewerData(), DayEntry, LoadState, mondayOf(), MONTHS, MyRosterView(), MyRosterViewProps (+37 more)

### Community 33 - "DoctorSession"
Cohesion: 0.06
Nodes (47): 0. Quick start for a new chat, 13. Screens in detail, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 7. Rules (+39 more)

### Community 34 - "yearToDate.ts"
Cohesion: 0.24
Nodes (13): nurseClinicRoleOf(), isLateDuty(), cacheKey(), clearYearToDateCache(), computeYearToDate(), earlierRostersThisYear(), emptyCounts(), latestPublishedVersion() (+5 more)

### Community 35 - "fixtures.ts"
Cohesion: 0.10
Nodes (24): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+16 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "rules.test.mjs"
Cohesion: 0.15
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 38 - "makeNurse"
Cohesion: 0.16
Nodes (15): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account(), doctorOfAmy() (+7 more)

### Community 39 - "ref_node_assert"
Cohesion: 0.12
Nodes (9): ctx(), EARLY, LATE, diff(), LATE, nurse, EARLY, LATE (+1 more)

### Community 40 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 41 - "preferenceFocus.test.ts"
Cohesion: 0.17
Nodes (10): isPairing(), PREFERENCE_FOCUS_LABELS, NursePreference, PreferenceFocus, CARD, KHAN, LATE, LEE (+2 more)

### Community 42 - "LiveCollectionCache"
Cohesion: 0.31
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "IRepository.ts"
Cohesion: 0.48
Nodes (4): FirebaseClientConfig, SubscribeCallback, Unsubscribe, CollectionName

### Community 45 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 46 - "IRepository"
Cohesion: 0.23
Nodes (6): removeNurseRoster(), revokeNurseLink(), repositoryManager, IRepository, deleteEntireSchedule(), saveEmailSettings()

### Community 47 - "WorkbookGrid.tsx"
Cohesion: 0.12
Nodes (25): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, ProblemsPanelProps (+17 more)

### Community 48 - "ScheduleValidator.ts"
Cohesion: 0.22
Nodes (18): bloodCollectionRole(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, fromMinutes(), hoursToCover(), isFreeDuring() (+10 more)

### Community 49 - "syncScheduleAssignments"
Cohesion: 0.67
Nodes (3): 11. Saving, live updates, versions, fingerprint(), syncScheduleAssignments()

### Community 50 - "explainCell.ts"
Cohesion: 0.12
Nodes (25): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps (+17 more)

### Community 51 - "dialogs.tsx"
Cohesion: 0.21
Nodes (13): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, NoticeTone (+5 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "rosterSaving.test.ts"
Cohesion: 0.33
Nodes (3): DOCTOR, handEdit, leave()

### Community 54 - "hoursPolicy.ts"
Cohesion: 0.22
Nodes (14): 10. Hours, CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditInRange(), leaveCreditOnDate() (+6 more)

### Community 55 - "weekend.ts"
Cohesion: 0.50
Nodes (4): currentWeekendDays, DEFAULT_WEEKEND_DAYS, loadStoredWeekendDays(), sanitize()

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

## Knowledge Gaps
- **367 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+362 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 448 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `DoctorSession`, `ExportModal.tsx`, `nurseRosterService.ts`, `PublishView.tsx`, `CreateScheduleModal.tsx`, `getRepository`, `SettingsView.tsx`, `package.json`, `AppShell.tsx`, `App.tsx`, `WorkbookGrid.tsx`, `DashboardView`, `explainCell.ts`, `dialogs.tsx`, `Sidebar.tsx`, `SchedulesView.tsx`, `types/index.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Assignment`, `DoctorSession`, `ExportModal.tsx`, `nurseRosterService.ts`, `PublishView.tsx`, `CreateScheduleModal.tsx`, `getRepository`, `SettingsView.tsx`, `package.json`, `AppShell.tsx`, `App.tsx`, `WorkbookGrid.tsx`, `DashboardView`, `Sidebar.tsx`, `dialogs.tsx`, `SchedulesView.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `LiveCollectionCache` connect `LiveCollectionCache` to `IRepository.ts`, `authService.ts`, `FirestoreRepository`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _367 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assignment` be split into smaller, more focused modules?**
  _Cohesion score 0.07917620137299772 - nodes in this community are weakly interconnected._
- **Should `SettingsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1187980433263452 - nodes in this community are weakly interconnected._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09619450317124736 - nodes in this community are weakly interconnected._