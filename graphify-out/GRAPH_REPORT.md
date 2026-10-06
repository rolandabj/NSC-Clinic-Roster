# Graph Report - NSC-Clinic-Roster  (2026-10-06)

## Corpus Check
- 202 files · ~247,365 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .css 2, .example 1)

## Summary
- 1480 nodes · 5484 edges · 71 communities (65 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 140 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ee4f9b36`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- HistoryView.tsx
- SchedulingEngine.ts
- clinicModel.test.ts
- RulesTab.tsx
- authService.ts
- notify
- authService
- rules.test.mjs
- package.json
- AppShell.tsx
- dependencies
- middleware/auth.ts
- AvailabilityView.tsx
- App.tsx
- CollectionSyncer
- DashboardView.tsx
- seedRunner.ts
- firebaseIdentityService.ts
- getRepository
- compilerOptions
- DoctorsScheduleSheet.tsx
- scheduleRanges.ts
- EntityForCollection
- devDependencies
- PublishModal.tsx
- publicRosterService.ts
- IRepository
- scripts
- types/index.ts
- FirestoreRepository.ts
- dateFormatter.ts
- lastResort.test.ts
- dialogs.tsx
- yearToDate.ts
- nurseRosterService.ts
- What You Must Do When Invoked
- LiveCollectionCache
- fixtures.ts
- hoursTopUp.test.ts
- assignmentChecks.ts
- makeNurse
- WhoCanCover.tsx
- nurseClinicFloat.test.ts
- createApiApp
- SchedulesView.tsx
- explainCell.test.ts
- server.ts
- hoursPolicy.ts
- WorkbookGrid.tsx
- preferenceFocus.test.ts
- DatabaseTab.tsx
- graphify reference: extra exports and benchmark
- ShortcutsModal.tsx
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
- SENIOR
- ref_node_assert
- NSC Clinic Roster: complete project guide
- ClinicRoster
- ExportModal.tsx
- hoursRules.test.ts
- README.md

## God Nodes (most connected - your core abstractions)
1. `getRepository()` - 93 edges
2. `Assignment` - 84 edges
3. `Schedule` - 81 edges
4. `Nurse` - 80 edges
5. `DutyWindow` - 78 edges
6. `react` - 72 edges
7. `useDialogA11y()` - 64 edges
8. `lucide-react` - 63 edges
9. `ClinicalRole` - 63 edges
10. `Doctor` - 62 edges

## Surprising Connections (you probably didn't know these)
- `Entry points` --references--> `GenerationResult`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/types.ts
- `4. Navigation and app shell` --references--> `EmailHtmlPreview()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/EmailHtmlPreview.tsx
- `4. Navigation and app shell` --references--> `MenuButton()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/MenuButton.tsx
- `4. Navigation and app shell` --references--> `useDialogA11y()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/common/useDialogA11y.ts
- `4. Navigation and app shell` --references--> `AppShell()`  [INFERRED]
  PROJECT_GUIDE.md → src/components/layout/AppShell.tsx

## Import Cycles
- None detected.

## Communities (71 total, 6 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.21
Nodes (49): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NurseFairnessMetrics, ProposedSwap, PublishModalProps (+41 more)

### Community 1 - "HistoryView.tsx"
Cohesion: 0.06
Nodes (57): jspdf, jspdf-autotable, xlsx, DeleteScheduleModal(), DeleteVersionModal(), DeleteVersionModalProps, ExportModal(), fmtHours() (+49 more)

### Community 2 - "SchedulingEngine.ts"
Cohesion: 0.12
Nodes (43): bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn(), fromMinutes() (+35 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (21): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+13 more)

### Community 4 - "RulesTab.tsx"
Cohesion: 0.12
Nodes (23): 7. Rules, ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef (+15 more)

### Community 5 - "authService.ts"
Cohesion: 0.12
Nodes (25): AppShellProps, NAV_ITEMS, SidebarProps, TopBarProps, AuthModalProps, AccessManagementPanelProps, AuditTrailViewProps, AvailabilityViewProps (+17 more)

### Community 6 - "notify"
Cohesion: 0.12
Nodes (42): confirmDialog(), dismissNotice(), notify(), setState(), AccessManagementPanel(), ClinicTab(), ClinicTabProps, DatabaseTabProps (+34 more)

### Community 7 - "authService"
Cohesion: 0.07
Nodes (11): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider, nextQuotaResetMs() (+3 more)

### Community 8 - "rules.test.mjs"
Cohesion: 0.07
Nodes (21): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+13 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.17
Nodes (22): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+14 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "middleware/auth.ts"
Cohesion: 0.17
Nodes (13): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, requireOwner (+5 more)

### Community 13 - "AvailabilityView.tsx"
Cohesion: 0.12
Nodes (38): 13. Screens in detail, 3. Users, roles and access, AllRequestsPanel(), AllRequestsPanelProps, Draft, KindFilter, STATUS_LABEL, STATUS_STYLE (+30 more)

### Community 14 - "App.tsx"
Cohesion: 0.13
Nodes (14): 4. Navigation and app shell, App(), AppShell, MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps (+6 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.12
Nodes (7): CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, now

### Community 16 - "DashboardView.tsx"
Cohesion: 0.13
Nodes (21): Card(), DashboardView(), loadPlannerData(), longDate(), PlannerData, readStoredId(), TodayList(), ViewerData (+13 more)

### Community 17 - "seedRunner.ts"
Cohesion: 0.16
Nodes (12): toScheduleRange(), ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats, downloadFullDatabaseBackup(), ensureWorkingHoursPeriodsDefaults(), exportFullDatabaseBackup() (+4 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.19
Nodes (14): jose, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache (+6 more)

### Community 19 - "getRepository"
Cohesion: 0.27
Nodes (14): lucide-react, react, openStack, useDialogA11y(), BulkImportModal(), DeleteScheduleModalProps, TemplateModal(), AuditTrailView() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 21 - "DoctorsScheduleSheet.tsx"
Cohesion: 0.42
Nodes (7): EditDoctorShiftModal(), TIME_PRESETS, DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), getWeekdayFromIsoDate(), saveDoctorShift()

### Community 22 - "scheduleRanges.ts"
Cohesion: 0.40
Nodes (9): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+1 more)

### Community 23 - "EntityForCollection"
Cohesion: 0.32
Nodes (3): FirestoreRepository, sanitizePayload(), EntityForCollection

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "PublishModal.tsx"
Cohesion: 0.07
Nodes (48): nodemailer, uuid, Request, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides() (+40 more)

### Community 26 - "publicRosterService.ts"
Cohesion: 0.22
Nodes (12): ShareModal(), ShareModalProps, TabType, ensurePublicRosters(), pick(), PUBLIC_LEAVE_TYPE, PUBLIC_ROSTER_FORMAT, removePublicRoster() (+4 more)

### Community 27 - "IRepository"
Cohesion: 0.16
Nodes (8): repositoryManager, IRepository, DeleteDoctorShiftParams, PopulateRecurringDoctorSessionsParams, PopulateRecurringDoctorSessionsResult, SaveDoctorShiftParams, WEEKDAY_FULL_NAMES, WeeklyPatternSlot

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "types/index.ts"
Cohesion: 0.05
Nodes (51): CreateScheduleModal(), CreateScheduleModalProps, CellChoice, applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, InternalSlot, calculateWorkingHoursForDateRange() (+43 more)

### Community 30 - "FirestoreRepository.ts"
Cohesion: 0.14
Nodes (11): FirebaseClientConfig, SubscribeCallback, Unsubscribe, CacheEntry, ListFilter, matchesFilter(), UNCACHED_COLLECTIONS, CollectionName (+3 more)

### Community 31 - "dateFormatter.ts"
Cohesion: 0.53
Nodes (4): formatDate(), formatDateRange(), formatDateTime(), formatDateWithWeekday()

### Community 32 - "lastResort.test.ts"
Cohesion: 0.11
Nodes (14): isLastResortShift(), LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES, DR_PCC (+6 more)

### Community 33 - "dialogs.tsx"
Cohesion: 0.19
Nodes (11): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, listeners, Notice, NoticeTone, PendingConfirm (+3 more)

### Community 34 - "yearToDate.ts"
Cohesion: 0.16
Nodes (16): YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), cacheKey(), clearYearToDateCache() (+8 more)

### Community 35 - "nurseRosterService.ts"
Cohesion: 0.06
Nodes (68): RFC-5545, 12. Publishing and nurse links, calendarRouter, fromFirestoreFields(), fromFirestoreValue(), getPublicDocument(), dateLabel(), PublishedRosterSheet() (+60 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 38 - "fixtures.ts"
Cohesion: 0.11
Nodes (20): ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS, shift() (+12 more)

### Community 39 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 40 - "assignmentChecks.ts"
Cohesion: 0.60
Nodes (5): checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate()

### Community 41 - "makeNurse"
Cohesion: 0.17
Nodes (15): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), account(), doctorOfAmy() (+7 more)

### Community 42 - "WhoCanCover.tsx"
Cohesion: 0.25
Nodes (10): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps (+2 more)

### Community 43 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 44 - "createApiApp"
Cohesion: 0.25
Nodes (7): @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth(), clinicApi()

### Community 45 - "SchedulesView.tsx"
Cohesion: 0.13
Nodes (26): MenuButton(), MenuButtonProps, MenuItem, FairnessModal(), SwapManagerModal(), readStoredScheduleId(), SchedulesView(), storeScheduleId() (+18 more)

### Community 46 - "explainCell.test.ts"
Cohesion: 0.22
Nodes (6): describeRequest(), EARLY, input(), LATE, softHoursLimit, week

### Community 47 - "server.ts"
Cohesion: 0.18
Nodes (3): builtServer, __dirname, __filename

### Community 48 - "hoursPolicy.ts"
Cohesion: 0.28
Nodes (8): CreditEntry, CreditType, DEFAULT_LEAVE_DAY_HOURS, FullTimeTarget, inclusiveDays(), leaveCreditPerDay(), leaveDaysInRange(), nurseLeaveHoursInRange()

### Community 49 - "WorkbookGrid.tsx"
Cohesion: 0.11
Nodes (30): findCell(), QuickCellPopup(), QuickCellPopupProps, QuickDayNote, QuickLeaveOption, QuickWish, QuickWorkOption, cellKeyOf() (+22 more)

### Community 50 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 51 - "DatabaseTab.tsx"
Cohesion: 0.57
Nodes (6): DatabaseTab(), defaultFirebaseConfig, checkBackup(), clearDatabase(), getDatabaseStatistics(), importFullDatabaseBackup()

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 55 - "ShortcutsModal.tsx"
Cohesion: 0.13
Nodes (9): ShortcutItem, SHORTCUTS, ShortcutsModalProps, DICTIONARY, i18n, I18nManager, Language, t() (+1 more)

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

### Community 66 - "SENIOR"
Cohesion: 0.33
Nodes (4): SENIOR, EARLY, LATE, shifts

### Community 67 - "ref_node_assert"
Cohesion: 0.15
Nodes (6): diff(), LATE, nurse, DOCTOR, handEdit, leave()

### Community 68 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.12
Nodes (15): 0. Quick start for a new chat, 11. Saving, live updates, versions, 14. Server, security and config, 15. Tests, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout (+7 more)

### Community 69 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 71 - "ExportModal.tsx"
Cohesion: 0.08
Nodes (49): 10. Hours, ExportTab, WEEKDAY_NAMES, fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS (+41 more)

### Community 74 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

## Knowledge Gaps
- **426 isolated node(s):** `session-start.sh script`, `PATH`, `name`, `private`, `version` (+421 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 523 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `getRepository` to `Assignment`, `HistoryView.tsx`, `RulesTab.tsx`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `DoctorsScheduleSheet.tsx`, `PublishModal.tsx`, `publicRosterService.ts`, `types/index.ts`, `dialogs.tsx`, `nurseRosterService.ts`, `fixtures.ts`, `WhoCanCover.tsx`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `DatabaseTab.tsx`, `ShortcutsModal.tsx`, `NSC Clinic Roster: complete project guide`, `ExportModal.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `getRepository` to `Assignment`, `HistoryView.tsx`, `RulesTab.tsx`, `authService.ts`, `notify`, `package.json`, `AppShell.tsx`, `AvailabilityView.tsx`, `App.tsx`, `DashboardView.tsx`, `DoctorsScheduleSheet.tsx`, `PublishModal.tsx`, `publicRosterService.ts`, `types/index.ts`, `dialogs.tsx`, `nurseRosterService.ts`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `DatabaseTab.tsx`, `ShortcutsModal.tsx`, `ExportModal.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `HistoryView.tsx`, `SchedulingEngine.ts`, `clinicModel.test.ts`, `DashboardView.tsx`, `getRepository`, `DoctorsScheduleSheet.tsx`, `PublishModal.tsx`, `types/index.ts`, `lastResort.test.ts`, `yearToDate.ts`, `nurseRosterService.ts`, `fixtures.ts`, `assignmentChecks.ts`, `makeNurse`, `nurseClinicFloat.test.ts`, `SchedulesView.tsx`, `explainCell.test.ts`, `WorkbookGrid.tsx`, `SENIOR`, `ref_node_assert`, `NSC Clinic Roster: complete project guide`, `ExportModal.tsx`, `hoursRules.test.ts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `PATH`, `name` to the rest of the system?**
  _426 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HistoryView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.059676044330775786 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12156862745098039 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._