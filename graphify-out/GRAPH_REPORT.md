# Graph Report - NSC-Clinic-Roster  (2026-11-15)

## Corpus Check
- 433 files · ~446,388 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 3044 nodes · 10504 edges · 173 communities (142 shown, 31 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 442 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e281fbb0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- MyRosterView.tsx
- clinicModel.test.ts
- authService
- GridTable.tsx
- getRepository
- Handover for a new chat
- ui-audit.cjs
- package.json
- 16. History of work (for context)
- dependencies
- Test-Driven Development
- apiApp.ts
- DashboardView.tsx
- published-rules.mjs
- handMoves.test.ts
- IRepository
- firebaseIdentityService.ts
- index.tsx
- compilerOptions
- ReportsView.tsx
- App.tsx
- emailService.ts
- devDependencies
- authService.ts
- quick reference
- requests.ts
- formatDayDate
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- RulesTab.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- auditWords.ts
- SchedulesView.tsx
- fixtures.ts
- Optimization Patterns
- Assignment
- CollectionSyncer
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- staffRequestService.ts
- firestore-rules/package.json
- Button
- continuousHours.test.ts
- leave-dialogs.cjs
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- dialogs.tsx
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- NSC Clinic Roster
- session-start.sh
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- WhoCanCover.tsx
- Planning and Task Breakdown
- Find Skills
- ClinicContextState
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- guide-with-code.mjs
- fakeAuth.ts
- Rules
- RosterToolbar.tsx
- README.md
- emailPublishing.test.ts
- holidayLeave.ts
- createApiApp
- PublishedRosterView.tsx
- links.cjs
- nurseRoster.test.ts
- cellView.ts
- makeNurse
- GridSelection
- coverageRepair.test.ts
- UI overhaul: summary and next steps
- EntityForCollection
- types/index.ts
- Design system: NSC Clinic Roster
- firestoreRest.ts
- harness/main.tsx
- gridKeys.test.ts
- dateDefaults.ts
- Finish a change
- Rules
- sharing.test.ts
- authorizedFetch
- context7
- ref_playwright
- firestore-rules-reviewer.md
- hoursTopUp.test.ts
- firebase-mcp.sh
- geminiApi.test.ts
- start.sh
- stop.sh
- Rules
- engineRules.test.ts
- explainCell.test.ts
- savingSafety.test.ts
- usePresence.ts
- yearToDate.ts
- quotaTracker
- HistoryView.tsx
- doctorForm.ts
- dateUtils.ts
- nextPeriod.ts
- decisionEmail.test.ts
- ClinicRoster
- PublishView.tsx
- RosterGrid
- approvedDayOff.test.ts
- leaveGuard.ts
- seedRunner.ts
- nurseClinicFloat.test.ts
- ref_node_assert
- grid-timing.cjs
- colorContrast.ts
- 13. Screens in detail
- cx
- my-requests.cjs
- request-clinic-dialogs.cjs
- react
- doctorScheduleService.ts
- requests.cjs
- dayView.ts
- allowance.cjs
- grid-keys.cjs
- data-backup.cjs
- roster-dialogs.cjs
- nurse-editor.cjs
- nurse-page.cjs
- nurses-list.cjs
- form-dialogs.cjs
- history.cjs
- toolbar.cjs
- sent-rosters.cjs
- settings-save.cjs
- leave-grid.cjs
- UI overhaul: checklist
- your-access.cjs
- roster-editing-dialogs.cjs
- access.cjs
- grid-flow.cjs
- weekHours.test.ts
- preferenceOrder.ts
- newRosterDates.ts
- emailLogSize.ts
- resume.cjs
- time-periods.cjs
- decisionEmail.ts
- hoursRules.test.ts
- scripts
- sentRosters.test.ts
- lastResort.test.ts
- preferenceFocus.test.ts
- versionKinds.test.ts
- ruleDraft.ts
- teamRoster.test.ts
- GridToolbar.tsx
- plain-english-reviewer.md
- RuleTemplateKey

## God Nodes (most connected - your core abstractions)
1. `16. History of work (for context)` - 127 edges
2. `react` - 119 edges
3. `Assignment` - 116 edges
4. `Nurse` - 109 edges
5. `getRepository()` - 99 edges
6. `DutyWindow` - 97 edges
7. `Button()` - 93 edges
8. `formatDate()` - 92 edges
9. `Schedule` - 91 edges
10. `lucide-react` - 89 edges

## Surprising Connections (you probably didn't know these)
- `What to look at` --references--> `confirmDialog()`  [INFERRED]
  .claude/agents/plain-english-reviewer.md → src/components/common/dialogs.tsx
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/plan.md → src/components/common/usePermissions.ts
- `Phase 1: quick fixes and safety` --references--> `usePermissions()`  [INFERRED]
  tasks/todo.md → src/components/common/usePermissions.ts
- `Phase 6: Nurses, Doctors, Availability and Requests (planner screens)` --references--> `DataTable()`  [INFERRED]
  tasks/plan.md → src/components/ui/DataTable.tsx
- `16. History of work (for context)` --references--> `ProblemMark`  [INFERRED]
  PROJECT_GUIDE.md → src/components/workbook/grid/GridTable.tsx

## Import Cycles
- None detected.

## Communities (173 total, 31 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.06
Nodes (69): jspdf, jspdf-autotable, ExportTab, WEEKDAY_NAMES, NurseTimesheetModalProps, fmtHours(), HoursAccountingSheet(), isFloatShift() (+61 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.07
Nodes (69): 6. Clinic model (the business rules in plain English), checkAssignment(), hardRule(), minutes(), restHoursBetween(), shiftDate(), bloodCollectionRole(), canBeFreeNurse() (+61 more)

### Community 2 - "MyRosterView.tsx"
Cohesion: 0.12
Nodes (23): 0. Quick start for a new chat, 12. Publishing and nurse links, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, NSC Clinic Roster: complete project guide, dateLabel() (+15 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.06
Nodes (27): Steps, apps, { initializeTestEnvironment }, planner(), requireRules, history(), D, DOCTORS (+19 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (6): authService, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "GridTable.tsx"
Cohesion: 0.11
Nodes (36): PROBLEM_MARKS, CellView, DayTotal, FOCUS_CELL, GridCell, GridCellActions, GridCellProps, SELECTED_CELL (+28 more)

### Community 6 - "getRepository"
Cohesion: 0.13
Nodes (52): useAppContext(), confirmDialog(), notify(), Field(), Input(), AccessManagementPanel(), ClinicTab(), ClinicTabProps (+44 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.11
Nodes (18): firebase, name, private, type, version, esbuild, @google/genai, jose (+10 more)

### Community 10 - "16. History of work (for context)"
Cohesion: 0.11
Nodes (32): 16. History of work (for context), dayViewOf(), ProblemCounts(), CellContextMenu(), CellChoice, cellSummary(), isDayProblem(), GridLegend() (+24 more)

### Community 11 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, express, express-rate-limit, firebase, @google/genai, helmet, jose, jspdf (+11 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "apiApp.ts"
Cohesion: 0.13
Nodes (16): express, express-rate-limit, helmet, authMiddleware(), AuthUser, BackendRole, Express, Request (+8 more)

### Community 14 - "DashboardView.tsx"
Cohesion: 0.15
Nodes (28): loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), ViewerData, addDays(), countChangedCells(), NEXT_ROSTER_WARNING_DAYS (+20 more)

### Community 15 - "published-rules.mjs"
Cohesion: 0.11
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 16 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (31): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, ProblemsPanelProps, listProblem(), checkSwap(), isPinnedShift() (+23 more)

### Community 17 - "IRepository"
Cohesion: 0.10
Nodes (20): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, saveHolidayLeave(), ensureNurseLink(), newToken(), regenerateNurseLink() (+12 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.21
Nodes (13): AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig(), identityCache, jwks (+5 more)

### Community 19 - "index.tsx"
Cohesion: 0.25
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "ReportsView.tsx"
Cohesion: 0.13
Nodes (32): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, CHANGE_LABELS, CHANGE_TONES, VersionCompareModal(), BarList() (+24 more)

### Community 22 - "App.tsx"
Cohesion: 0.13
Nodes (16): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoginPageProps (+8 more)

### Community 23 - "emailService.ts"
Cohesion: 0.17
Nodes (13): emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, ServerEmailConfig, SMTP_CONNECTION_KEYS, withoutConnectionSettings() (+5 more)

### Community 24 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, esbuild, tailwindcss, @types/express, @types/node, @types/nodemailer, @types/react, @types/react-dom (+2 more)

### Community 25 - "authService.ts"
Cohesion: 0.13
Nodes (26): 3. Users, roles and access, signOutSafely(), AccountMenu(), TopBar(), TopBarProps, AuthModal(), Card(), DashboardView() (+18 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "requests.ts"
Cohesion: 0.22
Nodes (9): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, isGoogleAccountEmail(), SendEmailPayload, SendEmailResult (+1 more)

### Community 28 - "formatDayDate"
Cohesion: 0.25
Nodes (10): firstDayShown(), RosterDayView(), dayTotalsOf(), dayTotalWords(), problemWords(), decisionTitle(), waitingDayText(), waitingLeaveText() (+2 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.08
Nodes (43): 7. Rules, BlockedShift, explainNurseDay(), ExplainNurseDayInput, plainReason(), PossibleShift, round1(), shiftDate() (+35 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.21
Nodes (19): countOf(), Brand(), Drawer(), HoursTable(), NAV, PageHeader(), PlannerSample(), Position (+11 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "RulesTab.tsx"
Cohesion: 0.20
Nodes (14): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleGroup, RulesTab() (+6 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.05
Nodes (42): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+34 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "auditWords.ts"
Cohesion: 0.21
Nodes (13): ACTION_WORDS, actionWord(), AUDIT_ACTIONS, AuditFilters, changedFields(), ENTITY_WORDS, entityWord(), FieldChange (+5 more)

### Community 38 - "SchedulesView.tsx"
Cohesion: 0.05
Nodes (46): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), PageLoading(), useLatestCallback(), ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), RosterStep, RosterStepAction (+38 more)

### Community 39 - "fixtures.ts"
Cohesion: 0.08
Nodes (27): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+19 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.12
Nodes (77): RFC-5545, 5. Data model (Firestore collections), VersionRosterProps, BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, NONE (+69 more)

### Community 42 - "CollectionSyncer"
Cohesion: 0.09
Nodes (13): 11. Saving, live updates, versions, forgetCachedRoster(), CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan (+5 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.22
Nodes (18): ResumePublish(), nurseLinkUrl(), findStoppedPublish(), isDone(), isResumable(), lastNews(), overallSendStatus(), planResume() (+10 more)

### Community 46 - "staffRequestService.ts"
Cohesion: 0.31
Nodes (8): dayOffLockId(), daysInclusive(), isPendingLeave(), listPendingApprovals(), PendingAvailabilityItem, PendingLeaveItem, requireNurseId(), submitLeaveRequest()

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "Button"
Cohesion: 0.14
Nodes (47): LocalModeBanner(), CreateScheduleModal(), CreateScheduleModalProps, DeleteScheduleModal(), DeleteScheduleModalProps, DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview (+39 more)

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.13
Nodes (27): AppContext, AppContextValue, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+19 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "dialogs.tsx"
Cohesion: 0.16
Nodes (19): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+11 more)

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

### Community 65 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "ClinicContextState"
Cohesion: 0.11
Nodes (27): 4. Navigation and app shell, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, Sidebar(), SidebarProps (+19 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.09
Nodes (21): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+13 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.12
Nodes (20): Cell, DAYS, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem (+12 more)

### Community 72 - "guide-with-code.mjs"
Cohesion: 0.10
Nodes (11): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+3 more)

### Community 73 - "fakeAuth.ts"
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "RosterToolbar.tsx"
Cohesion: 0.20
Nodes (12): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), FillDialogProps, moreMenuItems(), RosterMenuItem (+4 more)

### Community 77 - "emailPublishing.test.ts"
Cohesion: 0.21
Nodes (7): nodemailer, checkEmailReadiness(), EmailReadiness, readEmailResponse(), RosterPublishService, configured, live

### Community 78 - "holidayLeave.ts"
Cohesion: 0.36
Nodes (9): 10. Hours, DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy(), withHolidaysAtZero() (+1 more)

### Community 79 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 80 - "PublishedRosterView.tsx"
Cohesion: 0.29
Nodes (10): PublicMessage(), PublicPageFrame(), AcknowledgePage(), AcknowledgePageProps, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile() (+2 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "nurseRoster.test.ts"
Cohesion: 0.14
Nodes (15): buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), nurseShiftUid(), shortHash() (+7 more)

### Community 83 - "cellView.ts"
Cohesion: 0.09
Nodes (29): CellDay, cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews(), sameView(), shortDoctorNames(), SOURCE_SPOKEN (+21 more)

### Community 84 - "makeNurse"
Cohesion: 0.10
Nodes (26): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+18 more)

### Community 86 - "coverageRepair.test.ts"
Cohesion: 0.15
Nodes (9): namesSpecialty(), OutsideList, outsideNurseList(), dates, DAY, doctors, FULL, specialties (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "EntityForCollection"
Cohesion: 0.29
Nodes (3): FirestoreRepository, sanitizePayload(), EntityForCollection

### Community 89 - "types/index.ts"
Cohesion: 0.10
Nodes (19): InternalSlot, ApprovalStatus, AssignmentKind, BlockWeeks, DoctorSessionSource, Invitation, InvitationStatus, IsoDateString (+11 more)

### Community 90 - "Design system: NSC Clinic Roster"
Cohesion: 0.17
Nodes (11): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+3 more)

### Community 91 - "firestoreRest.ts"
Cohesion: 0.36
Nodes (8): calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument(), setTextFieldsAs()

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "gridKeys.test.ts"
Cohesion: 0.21
Nodes (8): HOURS_COLUMN, isRosterCell(), moveSelection(), TOTALS_ROW, CellAction, useGridKeyboard(), DATES, NURSES

### Community 94 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 98 - "authorizedFetch"
Cohesion: 0.27
Nodes (9): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload (+1 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ref_playwright"
Cohesion: 0.10
Nodes (13): args, { chromium }, args, { chromium }, { chromium }, args, { chromium }, args (+5 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "geminiApi.test.ts"
Cohesion: 0.28
Nodes (8): geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured(), RosterInsightsInput

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 109 - "explainCell.test.ts"
Cohesion: 0.25
Nodes (5): EARLY, input(), LATE, softHoursLimit, week

### Community 110 - "savingSafety.test.ts"
Cohesion: 0.13
Nodes (8): clearYearToDateCache(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues, STAMP_EVERY_MS

### Community 111 - "usePresence.ts"
Cohesion: 0.21
Nodes (9): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, frame, november (+1 more)

### Community 112 - "yearToDate.ts"
Cohesion: 0.22
Nodes (14): daysBefore(), loadClinicSetup(), computeYearToDate(), earlierRostersThisYear(), emptyCounts(), latestPublishedVersion(), loadEarlierRosters(), LoadedRoster (+6 more)

### Community 113 - "quotaTracker"
Cohesion: 0.10
Nodes (10): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter, LiveCollectionCache, entry (+2 more)

### Community 114 - "HistoryView.tsx"
Cohesion: 0.21
Nodes (24): shiftTargetName(), VersionRoster(), WEEKDAY_NAMES, DeleteVersionModal(), DeleteVersionModalProps, plural(), VersionViewModal(), Switch() (+16 more)

### Community 115 - "doctorForm.ts"
Cohesion: 0.22
Nodes (10): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+2 more)

### Community 116 - "dateUtils.ts"
Cohesion: 0.14
Nodes (26): uuid, NoticeTone, BulkImportModal(), ShareModal(), ShareModalProps, Textarea(), NursesView(), cellsOf() (+18 more)

### Community 117 - "nextPeriod.ts"
Cohesion: 0.24
Nodes (11): addDays(), MONTHS, nextPeriodDefaults(), parse(), PeriodDefaults, sameDayNextMonth(), toIso(), p() (+3 more)

### Community 118 - "decisionEmail.test.ts"
Cohesion: 0.24
Nodes (9): cache(), cachedEmailSettings(), loadEmailSettings(), saveEmailSettings(), decidedAt, editor, manager, NOW (+1 more)

### Community 119 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 120 - "PublishView.tsx"
Cohesion: 0.14
Nodes (32): EmailHtmlPreview(), Card(), PageHeader(), Column, DataTable(), EmptyState(), ErrorState(), LoadingState() (+24 more)

### Community 121 - "RosterGrid"
Cohesion: 0.20
Nodes (14): dayLabel(), dayProblems(), problemAt(), tint(), weekdayOf(), clamp(), DayView(), describe() (+6 more)

### Community 122 - "approvedDayOff.test.ts"
Cohesion: 0.25
Nodes (6): DR, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 123 - "leaveGuard.ts"
Cohesion: 0.43
Nodes (6): addLeaveGuard(), Guard, guards, isChanged(), leaveReason(), rebaseDraft()

### Community 124 - "seedRunner.ts"
Cohesion: 0.08
Nodes (33): FirebaseClientConfig, SubscribeCallback, Unsubscribe, countOf(), listPage(), Page, pageFromList(), PageRequest (+25 more)

### Community 125 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 126 - "ref_node_assert"
Cohesion: 0.08
Nodes (14): CapacityJob, Edge, futureCapacity(), computeScheduleDiff(), MONTHS, suggestRosterName(), diff(), LATE (+6 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "colorContrast.ts"
Cohesion: 0.50
Nodes (6): contrastRatio(), INK, INK_MUTED, luminance(), rgbOf(), tint()

### Community 129 - "13. Screens in detail"
Cohesion: 0.18
Nodes (14): 13. Screens in detail, isPhoneSize(), nextRowLimit(), ROW_STEP, useRowsInSteps(), checkDayRequest(), checkLeaveRequest(), dayStatus() (+6 more)

### Community 130 - "cx"
Cohesion: 0.31
Nodes (11): ddmmyyyy(), datesOf(), day(), LeaveForm(), RequestsCard(), StatusBadge(), STEPS, Badge() (+3 more)

### Community 131 - "my-requests.cjs"
Cohesion: 0.20
Nodes (7): args, { chromium }, args, { chromium }, args, { chromium }, t()

### Community 133 - "react"
Cohesion: 0.12
Nodes (27): lucide-react, react, LocalModeBannerProps, ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, ButtonProps (+19 more)

### Community 134 - "doctorScheduleService.ts"
Cohesion: 0.16
Nodes (22): DoctorsScheduleSheet(), WEEKDAY_ABBR, deleteDoctorShift(), doctorFromDate(), generateDoctorSessionsForDateRange(), getWeekdayFromIsoDate(), missingPatternSessions(), nextDay() (+14 more)

### Community 136 - "dayView.ts"
Cohesion: 0.24
Nodes (8): DayProblem, DayRow, KIND, ORDER, PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

### Community 150 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 155 - "weekHours.test.ts"
Cohesion: 0.07
Nodes (16): ScheduleValidator, check(), nurse, nurse2, schedule, SENIOR, dates, doctors (+8 more)

### Community 156 - "preferenceOrder.ts"
Cohesion: 0.25
Nodes (7): applyPreferenceFocus(), isPairing(), PREFERENCE_FOCUS_LABELS, NurseFormErrors, NurseFormValues, NursePreference, PreferenceFocus

### Community 157 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 158 - "emailLogSize.ts"
Cohesion: 0.33
Nodes (6): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), DispatchResult, EmailRecipientLog

### Community 161 - "decisionEmail.ts"
Cohesion: 0.39
Nodes (7): DecidedRequest, decisionEmail(), DecisionEmailInput, oneLine(), what(), when(), escapeHtml()

### Community 162 - "hoursRules.test.ts"
Cohesion: 0.22
Nodes (7): D, E, L, NC, PHL, SENIOR, week

### Community 163 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 164 - "sentRosters.test.ts"
Cohesion: 0.36
Nodes (6): emailKindLabel(), KIND_LABELS, sendResult, EmailLogKind, log(), rec()

### Community 165 - "lastResort.test.ts"
Cohesion: 0.25
Nodes (5): DR_PEDS, ENT, FULL, PEDS, RULES

### Community 166 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 167 - "versionKinds.test.ts"
Cohesion: 0.25
Nodes (7): all, backup, lastYear, none, published, saved, v()

### Community 168 - "ruleDraft.ts"
Cohesion: 0.48
Nodes (4): FIELDS, rebaseRules(), ruleChanges(), same()

### Community 169 - "teamRoster.test.ts"
Cohesion: 0.29
Nodes (5): nurses, published, refs, schedule, today

### Community 170 - "GridToolbar.tsx"
Cohesion: 0.50
Nodes (3): GRID_KEY_ID, GridToolbarProps, GridZoom

### Community 171 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

### Community 172 - "RuleTemplateKey"
Cohesion: 0.67
Nodes (3): RuleDef, CanonicalRuleDef, RuleTemplateKey

## Knowledge Gaps
- **1025 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1020 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1257 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `13. Screens in detail`, `MyRosterView.tsx`, `GridTable.tsx`, `getRepository`, `doctorScheduleService.ts`, `dayView.ts`, `package.json`, `16. History of work (for context)`, `DashboardView.tsx`, `index.tsx`, `ReportsView.tsx`, `App.tsx`, `authService.ts`, `formatDayDate`, `PlannerSample.tsx`, `ui.tsx`, `RulesTab.tsx`, `SchedulesView.tsx`, `fixtures.ts`, `Assignment`, `GridToolbar.tsx`, `resumePublish.ts`, `Button`, `AppShell.tsx`, `dialogs.tsx`, `WhoCanCover.tsx`, `ClinicContextState`, `data.ts`, `RosterToolbar.tsx`, `PublishedRosterView.tsx`, `harness/main.tsx`, `gridKeys.test.ts`, `usePresence.ts`, `HistoryView.tsx`, `dateUtils.ts`, `PublishView.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `MyRosterView.tsx`, `GridTable.tsx`, `getRepository`, `doctorScheduleService.ts`, `package.json`, `16. History of work (for context)`, `DashboardView.tsx`, `ReportsView.tsx`, `App.tsx`, `authService.ts`, `formatDayDate`, `PlannerSample.tsx`, `ui.tsx`, `RulesTab.tsx`, `SchedulesView.tsx`, `Assignment`, `GridToolbar.tsx`, `resumePublish.ts`, `Button`, `AppShell.tsx`, `dialogs.tsx`, `ClinicContextState`, `data.ts`, `RosterToolbar.tsx`, `PublishedRosterView.tsx`, `harness/main.tsx`, `HistoryView.tsx`, `dateUtils.ts`, `PublishView.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `colorContrast.ts`, `13. Screens in detail`, `MyRosterView.tsx`, `SchedulingEngine.ts`, `react`, `getRepository`, `GridTable.tsx`, `dayView.ts`, `ReportsView.tsx`, `authService.ts`, `formatDayDate`, `emailLogSize.ts`, `Code Review and Quality`, `SchedulesView.tsx`, `ruleDraft.ts`, `Assignment`, `CollectionSyncer`, `resumePublish.ts`, `Button`, `AppShell.tsx`, `dialogs.tsx`, `ClinicContextState`, `RosterToolbar.tsx`, `createApiApp`, `PublishedRosterView.tsx`, `cellView.ts`, `GridSelection`, `EntityForCollection`, `firestoreRest.ts`, `gridKeys.test.ts`, `dateDefaults.ts`, `usePresence.ts`, `HistoryView.tsx`, `doctorForm.ts`, `dateUtils.ts`, `PublishView.tsx`, `leaveGuard.ts`, `seedRunner.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Are the 126 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 126 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1025 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05771604938271605 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07111372318542462 - nodes in this community are weakly interconnected._