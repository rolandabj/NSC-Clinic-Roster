# Graph Report - NSC-Clinic-Roster  (2026-11-16)

## Corpus Check
- 475 files · ~486,252 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 3359 nodes · 12068 edges · 157 communities (132 shown, 25 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 522 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `05b5ba1a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- dialogs.tsx
- clinicModel.test.ts
- authService
- weekHours.test.ts
- Field
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- authService.ts
- DashboardView.tsx
- analysisExportService.ts
- assignmentPresence.test.ts
- FirestoreRepository
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- ReportsView.tsx
- App.tsx
- emailService.ts
- devDependencies
- leaveAllowance.test.ts
- quick reference
- decisionEmail.test.ts
- emailPublishing.test.ts
- hoursAccounting.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- GridTable.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- auditWords.ts
- formatDate
- makeSchedule
- Optimization Patterns
- Assignment
- EntityForCollection
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- IRepository.ts
- firestore-rules/package.json
- LiveCollectionCache
- continuousHours.test.ts
- handMoves.test.ts
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- NSC Clinic Roster
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- savingSafety.test.ts
- Planning and Task Breakdown
- Find Skills
- cellView.test.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- doctor-cover.cjs
- PublishModal.tsx
- Rules
- NurseSelfServicePanel.tsx
- README.md
- types/index.ts
- holidayLeave.ts
- apiApp.ts
- leaveGuard.ts
- links.cjs
- nurseRosterService.ts
- fixtures.ts
- timedPublicationReaders.test.ts
- SchedulingEngine
- coverageRepair.test.ts
- quotaTracker
- IRepository
- createApiApp
- ClinicContextState
- handMoveChecks.ts
- harness/main.tsx
- geminiApi.test.ts
- 16. History of work (for context)
- Finish a change
- Rules
- timedExports.test.ts
- eligibility-publish.cjs
- context7
- ref_playwright
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- usePresence.ts
- start.sh
- stop.sh
- Rules
- engineRules.test.ts
- published-rules.mjs
- useDialogA11y
- scheduleRanges.ts
- yearToDate.ts
- .list
- HistoryView.tsx
- RosterGrid
- ShortcutsModal.tsx
- peopleImport.ts
- timed-cover.cjs
- approvedDayOff.test.ts
- doctorWeekChange.test.ts
- futureCapacity.test.ts
- colorContrast.ts
- Scheduling engine improvement plan
- seedRunner.ts
- sheet-tabs.cjs
- data-backup.cjs
- grid-timing.cjs
- grid-flow.cjs
- getRepository
- 4. What each phase did
- publication-availability.cjs
- lowAcuityLastResort.test.ts
- react
- public-pages.cjs
- SchedulesView.tsx
- roster-dialogs.cjs
- allowance.cjs
- settings-dialogs.cjs
- Scheduling engine improvement checklist
- doctors.cjs
- nurse-editor.cjs
- leave-grid.cjs
- UI overhaul: checklist
- your-access.cjs
- nurses-list.cjs
- publish.cjs
- timedCoverageValidation.test.ts
- requests.cjs
- analysis-report.cjs
- time-periods.cjs
- scripts
- ref_node_assert
- ruleSyncService.ts
- plain-english-reviewer.md
- sent-rosters.cjs
- settings-save.cjs

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 151 edges
2. `16. History of work (for context)` - 128 edges
3. `Nurse` - 126 edges
4. `react` - 120 edges
5. `DutyWindow` - 111 edges
6. `Doctor` - 107 edges
7. `formatDate()` - 102 edges
8. `getRepository()` - 99 edges
9. `Schedule` - 97 edges
10. `Button()` - 95 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Final audit, 14-11-2026 (Phase 9)` --references--> `AppShell()`  [INFERRED]
  tasks/plan.md → src/components/layout/AppShell.tsx
- `6. Next steps and items outside the plan` --references--> `ResumePublish()`  [INFERRED]
  tasks/summary.md → src/components/publish/ResumePublish.tsx

## Import Cycles
- None detected.

## Communities (157 total, 25 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.10
Nodes (37): ExportTab, fmtHours(), WEEKDAY_NAMES, assignmentDoctorIds(), doctorCoverageText(), isFloatShift(), exportRosterToCsvLong(), exportRosterToCsvMatrix() (+29 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.07
Nodes (89): 6. Clinic model (the business rules in plain English), doctorSessionCoverView, checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), assignmentCanCoverDoctor() (+81 more)

### Community 2 - "dialogs.tsx"
Cohesion: 0.20
Nodes (15): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+7 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.08
Nodes (14): authorizedFetch(), authService, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider, fetchRosterInsights() (+6 more)

### Community 5 - "weekHours.test.ts"
Cohesion: 0.06
Nodes (16): ScheduleValidator, check(), nurse, nurse2, schedule, dates, doctors, fill() (+8 more)

### Community 6 - "Field"
Cohesion: 0.11
Nodes (56): confirmDialog(), notify(), Field(), Input(), ClinicTab(), DatabaseTab(), DatabaseTabProps, DutiesTab() (+48 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.33
Nodes (5): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 5. What comes next, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (23): description, firebase, name, private, type, version, esbuild, eslint (+15 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.07
Nodes (52): DayProblem, DayRow, dayViewOf(), firstDayShown(), KIND, ORDER, CellContextMenu(), cellSummary() (+44 more)

### Community 11 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, express, express-rate-limit, firebase, @google/genai, helmet, jose, jspdf (+11 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "authService.ts"
Cohesion: 0.10
Nodes (37): 3. Users, roles and access, 4. Navigation and app shell, LoginPageProps, signOutSafely(), AppShellProps, APP_NAME, SCREEN_NAMES, screenName() (+29 more)

### Community 14 - "DashboardView.tsx"
Cohesion: 0.13
Nodes (22): AppContext, AppContextValue, useAppContext(), Card(), DashboardView(), loadPlannerData(), PlannerData, readStoredId() (+14 more)

### Community 15 - "analysisExportService.ts"
Cohesion: 0.09
Nodes (35): ResolvedDoctorCoverage, hasReviewedDoctorEligibility(), ANALYSIS_FORMAT_VERSION, analysisFileName(), buildRosterAnalysis(), countBy(), coverageSnapshot(), downloadAnalysisContent() (+27 more)

### Community 16 - "assignmentPresence.test.ts"
Cohesion: 0.10
Nodes (17): AGREED_EXCEPTION_NOTE, LAST_RESORT_NOTE, check(), doctor, missing(), noDoctorCover(), nurse, off (+9 more)

### Community 17 - "FirestoreRepository"
Cohesion: 0.19
Nodes (3): FirestoreRepository, sanitizePayload(), repositoryManager

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.13
Nodes (22): jose, calendarRouter, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+14 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "ReportsView.tsx"
Cohesion: 0.11
Nodes (42): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, CHANGE_LABELS, CHANGE_TONES, VersionCompareModal(), Tone (+34 more)

### Community 22 - "App.tsx"
Cohesion: 0.15
Nodes (11): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoadErrorBoundary (+3 more)

### Community 23 - "emailService.ts"
Cohesion: 0.17
Nodes (13): emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, ServerEmailConfig, SMTP_CONNECTION_KEYS, withoutConnectionSettings() (+5 more)

### Community 24 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, esbuild, eslint, @eslint/js, eslint-plugin-jsx-a11y, eslint-plugin-react-hooks, tailwindcss, @types/express (+7 more)

### Community 25 - "leaveAllowance.test.ts"
Cohesion: 0.16
Nodes (12): daysInclusive(), LeaveImportRow, planLeaveImport(), allowanceFor(), Kind, takesAllowance(), AL, DAY_OFF (+4 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (20): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailPayload, SendEmailResult, DecidedRequest (+12 more)

### Community 28 - "emailPublishing.test.ts"
Cohesion: 0.12
Nodes (13): nodemailer, EmailReadiness, readEmailResponse(), RosterPublishService, configured, live, all, backup (+5 more)

### Community 29 - "hoursAccounting.ts"
Cohesion: 0.06
Nodes (66): 7. Rules, NurseTimesheetModalProps, GridTableProps, fmtHours(), HoursAccountingSheet(), LeaveAndLocksSheet(), BlockedShift, explainDay() (+58 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "GridTable.tsx"
Cohesion: 0.06
Nodes (42): DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL (+34 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "auditWords.ts"
Cohesion: 0.21
Nodes (13): ACTION_WORDS, actionWord(), AUDIT_ACTIONS, AuditFilters, changedFields(), ENTITY_WORDS, entityWord(), FieldChange (+5 more)

### Community 38 - "formatDate"
Cohesion: 0.15
Nodes (54): uuid, NoticeTone, useLatestCallback(), BulkImportModal(), CreateScheduleModal(), DeleteScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps (+46 more)

### Community 39 - "makeSchedule"
Cohesion: 0.07
Nodes (26): hoursOnlyRules(), makeSchedule(), LATE, run(), CARD, doctorOfAmy(), KHAN, LATE (+18 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.09
Nodes (98): RFC-5545, 5. Data model (Firestore collections), VersionRosterProps, WEEKDAY_NAMES, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps (+90 more)

### Community 42 - "EntityForCollection"
Cohesion: 0.10
Nodes (15): 11. Saving, live updates, versions, useRosterEdits(), forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync() (+7 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.09
Nodes (15): args, { chromium }, args, { chromium }, args, { chromium }, anon, editor (+7 more)

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.14
Nodes (21): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), findStoppedPublish(), isDone(), isResumable(), lastNews() (+13 more)

### Community 46 - "IRepository.ts"
Cohesion: 0.25
Nodes (9): FirebaseClientConfig, SubscribeCallback, Unsubscribe, listPage(), Page, pageFromList(), PageRequest, CollectionName (+1 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "LiveCollectionCache"
Cohesion: 0.18
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 50 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (22): moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS, DUTIES (+14 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.11
Nodes (30): AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView, MyRosterView, NursesView (+22 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "NSC Clinic Roster"
Cohesion: 0.20
Nodes (8): Development, Getting Started, Key Features, NSC Clinic Roster, Overview, Production Build, Running Checks, Tech Stack

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

### Community 65 - "savingSafety.test.ts"
Cohesion: 0.10
Nodes (11): clearYearToDateCache(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS (+3 more)

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "cellView.test.ts"
Cohesion: 0.07
Nodes (26): isPhoneSize(), CellDay, cellLookupsOf(), amy, CARDIOLOGY, ENT, LEE, lookups (+18 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.09
Nodes (21): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, Final audit, 14-11-2026 (Phase 9), How every phase is done, Not in this plan (+13 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "doctor-cover.cjs"
Cohesion: 0.08
Nodes (16): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+8 more)

### Community 73 - "PublishModal.tsx"
Cohesion: 0.16
Nodes (22): EmailHtmlPreview(), PublishModal(), Step, AllocationReviews(), ResumePublish(), PublishView(), SENDS_PER_PAGE, SentTab (+14 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "NurseSelfServicePanel.tsx"
Cohesion: 0.13
Nodes (30): 13. Screens in detail, EditDoctorShiftModal(), TIME_PRESETS, NurseSelfServicePanel(), STATUS, useFocusFirstError(), DoctorsScheduleSheet(), checkDayRequest() (+22 more)

### Community 77 - "types/index.ts"
Cohesion: 0.09
Nodes (25): eligibilityNeedsReview(), ids(), reviewedDoctorEligibility(), KIND_LABELS, ApprovalStatus, BlockWeeks, DoctorSessionSource, EmailLogKind (+17 more)

### Community 78 - "holidayLeave.ts"
Cohesion: 0.30
Nodes (11): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+3 more)

### Community 79 - "apiApp.ts"
Cohesion: 0.13
Nodes (17): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, Request (+9 more)

### Community 80 - "leaveGuard.ts"
Cohesion: 0.43
Nodes (6): addLeaveGuard(), Guard, guards, isChanged(), leaveReason(), rebaseDraft()

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "nurseRosterService.ts"
Cohesion: 0.05
Nodes (52): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before, 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet() (+44 more)

### Community 83 - "fixtures.ts"
Cohesion: 0.06
Nodes (45): ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, reviewInput(), SCHEDULE, SESSIONS (+37 more)

### Community 84 - "timedPublicationReaders.test.ts"
Cohesion: 0.09
Nodes (23): Steps, 15. Tests, computeScheduleDiff(), PUBLIC_ROSTER_FORMAT, Phase 0: setup, planner(), diff(), LATE (+15 more)

### Community 85 - "SchedulingEngine"
Cohesion: 0.07
Nodes (22): SchedulingEngine, doctors, prefs, refs, sessions, specialties, CARD, EARLY (+14 more)

### Community 86 - "coverageRepair.test.ts"
Cohesion: 0.18
Nodes (6): dates, DAY, doctors, FULL, specialties, staff

### Community 87 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 88 - "IRepository"
Cohesion: 0.10
Nodes (24): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster() (+16 more)

### Community 89 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 90 - "ClinicContextState"
Cohesion: 0.21
Nodes (13): TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps, ReportsViewProps (+5 more)

### Community 91 - "handMoveChecks.ts"
Cohesion: 0.21
Nodes (15): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, listProblem(), checkSwap(), isPinnedShift(), MoveContext (+7 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "geminiApi.test.ts"
Cohesion: 0.23
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 94 - "16. History of work (for context)"
Cohesion: 0.07
Nodes (35): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), NSC Clinic Roster: complete project guide (+27 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "timedExports.test.ts"
Cohesion: 0.19
Nodes (12): xlsx, cover(), data(), doctors, exportData(), handover(), nurses, pair (+4 more)

### Community 98 - "eligibility-publish.cjs"
Cohesion: 0.33
Nodes (5): args, assert, { chromium }, fixture(), pageFor()

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ref_playwright"
Cohesion: 0.05
Nodes (23): args, { chromium }, args, { chromium }, { chromium }, args, { chromium }, args (+15 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "usePresence.ts"
Cohesion: 0.21
Nodes (9): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, frame, november (+1 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 109 - "published-rules.mjs"
Cohesion: 0.12
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 110 - "useDialogA11y"
Cohesion: 0.12
Nodes (15): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+7 more)

### Community 111 - "scheduleRanges.ts"
Cohesion: 0.40
Nodes (9): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+1 more)

### Community 112 - "yearToDate.ts"
Cohesion: 0.14
Nodes (15): YearToDate, YearToDateCounts, isLateDuty(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds() (+7 more)

### Community 113 - ".list"
Cohesion: 0.22
Nodes (12): daysBefore(), loadClinicSetup(), earlierRostersThisYear(), latestPublishedVersion(), loadEarlierRosters(), loadPublishedRoster(), loadYearToDate(), rosterKey() (+4 more)

### Community 114 - "HistoryView.tsx"
Cohesion: 0.18
Nodes (23): shiftTargetName(), VersionRoster(), DeleteVersionModal(), plural(), VersionViewModal(), CHANGE_WORDS, HistoryView(), KIND_TONES (+15 more)

### Community 115 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 116 - "ShortcutsModal.tsx"
Cohesion: 0.25
Nodes (8): GROUPS, Key(), ShortcutsModal(), ShortcutsModalProps, nextRowLimit(), ROW_STEP, useRowsInSteps(), Phase 4: roster screen layout, words and accessibility (13-10-2026, guide items 59 to 67)

### Community 117 - "peopleImport.ts"
Cohesion: 0.06
Nodes (37): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+29 more)

### Community 118 - "timed-cover.cjs"
Cohesion: 0.29
Nodes (5): args, assert, {chromium}, fs, path

### Community 119 - "approvedDayOff.test.ts"
Cohesion: 0.25
Nodes (6): DR, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 120 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 121 - "futureCapacity.test.ts"
Cohesion: 0.47
Nodes (3): CapacityJob, Edge, futureCapacity()

### Community 122 - "colorContrast.ts"
Cohesion: 0.50
Nodes (6): contrastRatio(), INK, INK_MUTED, luminance(), rgbOf(), tint()

### Community 123 - "Scheduling engine improvement plan"
Cohesion: 0.25
Nodes (7): Agreed policy, Scheduling engine improvement plan, Stage 1: coverage correctness, Stage 2: timed cover foundation, Stage 3: sequential cover and manual editing, Stage 4: stronger search, Stage 5: clinic verification and rollout

### Community 124 - "seedRunner.ts"
Cohesion: 0.12
Nodes (16): countOf(), toScheduleRange(), SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, ALL_COLLECTIONS, BackupCheck, checkBackup(), ClearResult (+8 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 129 - "getRepository"
Cohesion: 0.14
Nodes (31): ErrorState(), LoadingState(), AllRequestsPanel(), Draft, KindFilter, STATUS, StatusFilter, ApprovalsQueuePanel() (+23 more)

### Community 130 - "4. What each phase did"
Cohesion: 0.17
Nodes (11): Waiting, 1. Where things stand, 2. Why this work, 4. What each phase did, 5. Numbers: baseline vs final, 6. Next steps and items outside the plan, 7. Where to find things, Phase 0: setup (07-10-2026, guide item 42) (+3 more)

### Community 131 - "publication-availability.cjs"
Cohesion: 0.33
Nodes (3): args, assert, { chromium }

### Community 132 - "lowAcuityLastResort.test.ts"
Cohesion: 0.07
Nodes (35): allocationSignature(), approveAllocation(), hasAllocationReview(), AllocationDraft, applyAllocationDrafts(), pendingAllocationReviews(), publicationReport(), AllocationReview (+27 more)

### Community 133 - "react"
Cohesion: 0.06
Nodes (53): preview(), lucide-react, react, LoginPage(), PublicMessage(), PublicPageFrame(), LocalModeBannerProps, PROBLEM_MARKS (+45 more)

### Community 135 - "SchedulesView.tsx"
Cohesion: 0.06
Nodes (38): PHONE_QUERY, FillDialogProps, ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), RosterStep, RosterStepAction, rosterSteps() (+30 more)

### Community 142 - "Scheduling engine improvement checklist"
Cohesion: 0.40
Nodes (4): Remaining stages, Scheduling engine improvement checklist, Stage 1, Stage 2

### Community 150 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 3: roster grid speed and structure, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 155 - "timedCoverageValidation.test.ts"
Cohesion: 0.15
Nodes (8): check(), clinic, doctors, nurse, schedule, secondNurse, sessions, sharedPair

### Community 157 - "analysis-report.cjs"
Cohesion: 0.18
Nodes (7): args, assert, {chromium}, downloads, fs, os, path

### Community 163 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 165 - "ref_node_assert"
Cohesion: 0.07
Nodes (23): MONTHS, suggestRosterName(), following, previous, repository(), schedule, shift(), D (+15 more)

### Community 170 - "ruleSyncService.ts"
Cohesion: 0.09
Nodes (20): RuleDef, WEEK_HOURS_DEFAULT, filterNurses(), nurseCounts(), NurseFilters, FIELDS, rebaseRules(), ruleChanges() (+12 more)

### Community 171 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **1148 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1143 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1407 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `getRepository`, `dialogs.tsx`, `Field`, `SchedulesView.tsx`, `package.json`, `WorkbookGrid.tsx`, `authService.ts`, `DashboardView.tsx`, `NurseSample.tsx`, `ReportsView.tsx`, `App.tsx`, `hoursAccounting.ts`, `PlannerSample.tsx`, `ui.tsx`, `GridTable.tsx`, `formatDate`, `Assignment`, `AppShell.tsx`, `PublishModal.tsx`, `NurseSelfServicePanel.tsx`, `nurseRosterService.ts`, `fixtures.ts`, `harness/main.tsx`, `16. History of work (for context)`, `usePresence.ts`, `useDialogA11y`, `HistoryView.tsx`, `ShortcutsModal.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `getRepository`, `dialogs.tsx`, `Field`, `SchedulesView.tsx`, `package.json`, `WorkbookGrid.tsx`, `authService.ts`, `DashboardView.tsx`, `NurseSample.tsx`, `ReportsView.tsx`, `App.tsx`, `hoursAccounting.ts`, `PlannerSample.tsx`, `ui.tsx`, `GridTable.tsx`, `formatDate`, `Assignment`, `AppShell.tsx`, `PublishModal.tsx`, `NurseSelfServicePanel.tsx`, `nurseRosterService.ts`, `harness/main.tsx`, `16. History of work (for context)`, `HistoryView.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `Assignment` connect `Assignment` to `ExportModal.tsx`, `SchedulingEngine.ts`, `clinicModel.test.ts`, `lowAcuityLastResort.test.ts`, `weekHours.test.ts`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `DashboardView.tsx`, `analysisExportService.ts`, `assignmentPresence.test.ts`, `ReportsView.tsx`, `timedCoverageValidation.test.ts`, `hoursAccounting.ts`, `ref_node_assert`, `formatDate`, `makeSchedule`, `EntityForCollection`, `continuousHours.test.ts`, `handMoves.test.ts`, `savingSafety.test.ts`, `cellView.test.ts`, `PublishModal.tsx`, `types/index.ts`, `nurseRosterService.ts`, `fixtures.ts`, `timedPublicationReaders.test.ts`, `SchedulingEngine`, `coverageRepair.test.ts`, `IRepository`, `handMoveChecks.ts`, `timedExports.test.ts`, `engineRules.test.ts`, `yearToDate.ts`, `HistoryView.tsx`, `doctorWeekChange.test.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 127 inferred relationships involving `16. History of work (for context)` (e.g. with `preview()` and `getDocumentAs()`) actually correct?**
  _`16. History of work (for context)` has 127 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1148 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09855072463768116 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07494269088344208 - nodes in this community are weakly interconnected._