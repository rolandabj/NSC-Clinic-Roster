# Graph Report - NSC-Clinic-Roster  (2026-11-15)

## Corpus Check
- 428 files · ~439,098 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 3009 nodes · 10368 edges · 157 communities (127 shown, 30 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 442 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3ac0dff6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- nurseRosterService.ts
- clinicModel.test.ts
- authService
- GridTable.tsx
- getRepository
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- usePhoneLayout.ts
- DashboardView.tsx
- seedRunner.ts
- handMoves.test.ts
- IRepository
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- ReportsView.tsx
- App.tsx
- emailService.ts
- devDependencies
- weekHours.test.ts
- quick reference
- decisionEmail.test.ts
- checkScheduler.test.ts
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- access.ts
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- auditWords.ts
- SchedulesView.tsx
- fixtures.ts
- Optimization Patterns
- Assignment
- EntityForCollection
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- 16. History of work (for context)
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
- useDialogA11y
- Source-Driven Development
- data.ts
- published-rules.mjs
- fakeAuth.ts
- Rules
- RosterToolbar.tsx
- README.md
- emailPublishing.test.ts
- holidayLeave.ts
- apiApp.ts
- PublishedRosterView.tsx
- links.cjs
- icsExportService.ts
- cellView.test.ts
- makeNurse
- shiftIds.test.ts
- leaveImport.ts
- UI overhaul: summary and next steps
- PublishView.tsx
- types/index.ts
- leaveAllowance.test.ts
- doctorScheduleService.ts
- harness/main.tsx
- UI overhaul: checklist
- dateDefaults.ts
- Finish a change
- Rules
- sharing.test.ts
- RosterSteps.tsx
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
- Steps
- yearToDate.ts
- FirestoreRepository
- HistoryView.tsx
- usePresence.ts
- nurseList.test.ts
- peopleImport.ts
- authService.ts
- ClinicRoster
- AvailabilityView.tsx
- RosterGrid
- approvedDayOff.test.ts
- leaveGuard.ts
- FirestoreRepository.ts
- leaveImport.test.ts
- ref_node_assert
- grid-timing.cjs
- scripts
- rowsInSteps.ts
- Review Process
- my-requests.cjs
- request-clinic-dialogs.cjs
- ui/index.ts
- The Five-Axis Review
- requests.cjs
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
- your-access.cjs
- roster-editing-dialogs.cjs
- access.cjs
- grid-flow.cjs
- doctorWeekChange.test.ts
- newRosterDates.ts
- resume.cjs
- time-periods.cjs

## God Nodes (most connected - your core abstractions)
1. `16. History of work (for context)` - 127 edges
2. `react` - 119 edges
3. `Assignment` - 113 edges
4. `Nurse` - 105 edges
5. `getRepository()` - 99 edges
6. `DutyWindow` - 94 edges
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
- `17. Known quirks and ideas for later` --references--> `doctorSessionsOn()`  [INFERRED]
  PROJECT_GUIDE.md → src/services/engine/clinicModel.ts

## Import Cycles
- None detected.

## Communities (157 total, 30 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.08
Nodes (36): jspdf, jspdf-autotable, ExportTab, fmtHours(), WEEKDAY_NAMES, FLOAT_ROLE_ID, isFloatShift(), exportRosterToCsvLong() (+28 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.07
Nodes (76): 6. Clinic model (the business rules in plain English), 7. Rules, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, checkAssignment(), hardRule(), listProblem() (+68 more)

### Community 2 - "nurseRosterService.ts"
Cohesion: 0.09
Nodes (39): Things that went wrong before, 12. Publishing and nurse links, 1. Features at a glance, dateLabel(), PublishedRosterSheet(), LoadState, MyRosterViewProps, MyDay (+31 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (6): authService, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "GridTable.tsx"
Cohesion: 0.06
Nodes (47): PROBLEM_MARKS, CellView, DayTotal, dayTotalsOf(), dayTotalWords(), problemWords(), FOCUS_CELL, GridCell (+39 more)

### Community 6 - "getRepository"
Cohesion: 0.13
Nodes (52): useAppContext(), confirmDialog(), notify(), NONE, SwapManagerModal(), TemplateModal(), Field(), Input() (+44 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.11
Nodes (18): firebase, name, private, type, version, esbuild, express-rate-limit, @google/genai (+10 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.07
Nodes (54): DayProblem, DayRow, dayViewOf(), KIND, ORDER, CellContextMenu(), cellLookupsOf(), cellSummary() (+46 more)

### Community 11 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, express, express-rate-limit, firebase, @google/genai, helmet, jose, jspdf (+11 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

### Community 14 - "DashboardView.tsx"
Cohesion: 0.18
Nodes (18): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+10 more)

### Community 15 - "seedRunner.ts"
Cohesion: 0.12
Nodes (16): countOf(), listPage(), Page, pageFromList(), PageRequest, ALL_COLLECTIONS, BackupCheck, ClearResult (+8 more)

### Community 16 - "handMoves.test.ts"
Cohesion: 0.11
Nodes (20): Other engine files, checkSwap(), isPinnedShift(), newFindings(), rebalancedFields(), suggestMoves(), swapNotes(), leaveApprovalFields() (+12 more)

### Community 17 - "IRepository"
Cohesion: 0.11
Nodes (21): saveRosterBackup(), restoreVersion(), VersionRestoreResult, removeNurseRoster(), revokeNurseLink(), removePublicRoster(), fingerprint(), syncScheduleAssignments() (+13 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.11
Nodes (23): jose, AuthUser, Express, Request, requireOwner, ROLE_HIERARCHY, verifyToken(), AccessRecordFields (+15 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "ReportsView.tsx"
Cohesion: 0.10
Nodes (38): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, BarList(), hours(), Meter(), METER_FILL (+30 more)

### Community 22 - "App.tsx"
Cohesion: 0.16
Nodes (11): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage(), LoadErrorBoundary (+3 more)

### Community 23 - "emailService.ts"
Cohesion: 0.20
Nodes (11): requirePlanner, emailRouter, emailFailureMessage(), EmailReadiness, EmailService, isGoogleAccountEmail(), pickRequestOverrides(), REQUEST_OVERRIDE_KEYS (+3 more)

### Community 24 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, esbuild, tailwindcss, @types/express, @types/node, @types/nodemailer, @types/react, @types/react-dom (+2 more)

### Community 25 - "weekHours.test.ts"
Cohesion: 0.13
Nodes (15): RuleDef, addDays(), fitsWeekHours(), heaviestWeekAround(), over(), WEEK_HOURS_DEFAULT, WeekHours, weeksOverLimit() (+7 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (19): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, SendEmailResult, DecidedRequest, decisionEmail() (+11 more)

### Community 28 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 29 - "hoursBalance.ts"
Cohesion: 0.08
Nodes (55): NurseTimesheetModalProps, BlockedShift, explainNurseDay(), ExplainNurseDayInput, plainReason(), PossibleShift, RequestWords, round1() (+47 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "access.ts"
Cohesion: 0.16
Nodes (21): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 2. Repository layout, 3. Users, roles and access, 4. Navigation and app shell, NSC Clinic Roster: complete project guide, APP_NAME (+13 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.11
Nodes (17): Change Descriptions, Change Sizing, Code Review and Quality, Common Rationalizations, Dead Code Hygiene, Dependency Discipline, Handling Disagreements, Honesty in Review (+9 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "auditWords.ts"
Cohesion: 0.21
Nodes (13): ACTION_WORDS, actionWord(), AUDIT_ACTIONS, AuditFilters, changedFields(), ENTITY_WORDS, entityWord(), FieldChange (+5 more)

### Community 38 - "SchedulesView.tsx"
Cohesion: 0.07
Nodes (60): Report, What to check, What to look at, lucide-react, react, useLatestCallback(), LocalModeBannerProps, CreateScheduleModal() (+52 more)

### Community 39 - "fixtures.ts"
Cohesion: 0.05
Nodes (42): 15. Tests, firstDayShown(), isPhoneSize(), ANALYSIS_FORMAT, CARD, input(), KHAN, LATE (+34 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.13
Nodes (75): 5. Data model (Firestore collections), VersionRosterProps, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps, ExportModalProps (+67 more)

### Community 42 - "EntityForCollection"
Cohesion: 0.13
Nodes (8): 11. Saving, live updates, versions, CollectionSyncer, Desired, fingerprint(), Known, SyncPlan, rebaseEdit(), EntityForCollection

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.10
Nodes (29): ServerEmailConfig, EmailTabProps, daysBefore(), loadClinicSetup(), EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog() (+21 more)

### Community 46 - "16. History of work (for context)"
Cohesion: 0.17
Nodes (14): 16. History of work (for context), useRosterEdits(), CellChoice, ProblemMark, GridCell, moveInGrid(), pickStep(), planSync() (+6 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "Button"
Cohesion: 0.18
Nodes (29): NoticeTone, BulkImportModal(), FairnessModal(), Button(), Column, DataTable(), Select(), Textarea() (+21 more)

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
Cohesion: 0.09
Nodes (38): react-dom, AppContext, AppContextValue, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView (+30 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "dialogs.tsx"
Cohesion: 0.22
Nodes (13): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+5 more)

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
Cohesion: 0.21
Nodes (13): TopBarProps, AuditTrailViewProps, AvailabilityViewProps, DoctorsViewProps, HistoryViewProps, NursesViewProps, PublishViewProps, ReportsViewProps (+5 more)

### Community 69 - "useDialogA11y"
Cohesion: 0.05
Nodes (37): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+29 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "fakeAuth.ts"
Cohesion: 0.33
Nodes (3): AuthService, MASTER_ADMIN_EMAIL, PEOPLE

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "RosterToolbar.tsx"
Cohesion: 0.20
Nodes (13): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), FillDialogProps, moreMenuItems(), RosterMenuItem (+5 more)

### Community 77 - "emailPublishing.test.ts"
Cohesion: 0.14
Nodes (12): nodemailer, EmailReadiness, readEmailResponse(), configured, live, all, backup, lastYear (+4 more)

### Community 78 - "holidayLeave.ts"
Cohesion: 0.23
Nodes (12): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+4 more)

### Community 79 - "apiApp.ts"
Cohesion: 0.18
Nodes (11): repoRoot, swaps, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer() (+3 more)

### Community 80 - "PublishedRosterView.tsx"
Cohesion: 0.20
Nodes (11): PublicMessage(), PublicPageFrame(), AcknowledgePage(), AcknowledgePageProps, PublishedRosterView(), loadPublishedRoster(), PublishedRosterViewProps, downloadIcsFile() (+3 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.11
Nodes (26): RFC-5545, calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument() (+18 more)

### Community 83 - "cellView.test.ts"
Cohesion: 0.18
Nodes (9): CellDay, amy, CARDIOLOGY, ENT, LEE, lookups, NURSE_CLINIC, RAY (+1 more)

### Community 84 - "makeNurse"
Cohesion: 0.10
Nodes (24): SchedulingEngine, hoursOnlyRules(), makeNurse(), makeSchedule(), LATE, run(), setup(), account() (+16 more)

### Community 85 - "shiftIds.test.ts"
Cohesion: 0.21
Nodes (9): moveShift(), swapShifts(), dates, doctors, fill(), LATE, nurses, schedule (+1 more)

### Community 86 - "leaveImport.ts"
Cohesion: 0.33
Nodes (6): leaveClash(), daysInclusive(), LeaveImportRow, planLeaveImport(), leaves, pins

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "PublishView.tsx"
Cohesion: 0.17
Nodes (23): uuid, EmailHtmlPreview(), PublishModal(), Step, ShareModal(), ResumePublish(), Card(), Notice() (+15 more)

### Community 89 - "types/index.ts"
Cohesion: 0.07
Nodes (27): isPairing(), PREFERENCE_FOCUS_LABELS, KIND_LABELS, FIELDS, rebaseRules(), ruleChanges(), same(), ApprovalStatus (+19 more)

### Community 90 - "leaveAllowance.test.ts"
Cohesion: 0.31
Nodes (6): allowanceFor(), Kind, takesAllowance(), AL, DAY_OFF, SICK

### Community 91 - "doctorScheduleService.ts"
Cohesion: 0.33
Nodes (8): doctorFromDate(), nextDay(), PatternSessionPlan, planPatternSessions(), PopulateRecurringDoctorSessionsParams, PopulateRecurringDoctorSessionsResult, WEEKDAY_FULL_NAMES, weekOn()

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

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

### Community 98 - "RosterSteps.tsx"
Cohesion: 0.36
Nodes (4): RosterStep, RosterStepAction, rosterSteps(), base

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
Cohesion: 0.16
Nodes (11): express, BackendRole, authRouter, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights() (+3 more)

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
Cohesion: 0.11
Nodes (12): forgetCachedRoster(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS, rosterSaveQueues (+4 more)

### Community 111 - "Steps"
Cohesion: 0.33
Nodes (5): Browser check, Steps, planner(), history(), nurses()

### Community 112 - "yearToDate.ts"
Cohesion: 0.14
Nodes (21): YearToDate, YearToDateCounts, clamp(), KEYS, YEAR_SEED_CAP, YearSeed, yearToDateSeeds(), clearYearToDateCache() (+13 more)

### Community 113 - "FirestoreRepository"
Cohesion: 0.17
Nodes (5): FirestoreRepository, sanitizePayload(), LiveCollectionCache, entry, matchesFilter()

### Community 114 - "HistoryView.tsx"
Cohesion: 0.18
Nodes (28): shiftTargetName(), VersionRoster(), WEEKDAY_NAMES, DeleteVersionModal(), plural(), ExportModal(), CHANGE_LABELS, CHANGE_TONES (+20 more)

### Community 115 - "usePresence.ts"
Cohesion: 0.21
Nodes (9): othersOnRoster(), samePeople(), STALE_MS, TAB_ID, usePresence(), PresenceRecord, frame, november (+1 more)

### Community 116 - "nurseList.test.ts"
Cohesion: 0.32
Nodes (4): filterNurses(), nurseCounts(), NurseFilters, nurses

### Community 117 - "peopleImport.ts"
Cohesion: 0.07
Nodes (34): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+26 more)

### Community 118 - "authService.ts"
Cohesion: 0.10
Nodes (27): LoginPageProps, signOutSafely(), AppShellProps, AccountMenu(), TopBar(), AuthModal(), AuthModalProps, AccessManagementPanelProps (+19 more)

### Community 119 - "ClinicRoster"
Cohesion: 0.20
Nodes (8): ClinicRoster, Development, Getting Started, Key Features, Overview, Production Build, Running Tests, Tech Stack

### Community 120 - "AvailabilityView.tsx"
Cohesion: 0.10
Nodes (44): 13. Screens in detail, PageHeader(), Switch(), Tabs(), AllRequestsPanel(), Draft, KindFilter, STATUS (+36 more)

### Community 121 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 122 - "approvedDayOff.test.ts"
Cohesion: 0.25
Nodes (6): DR, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 123 - "leaveGuard.ts"
Cohesion: 0.43
Nodes (6): addLeaveGuard(), Guard, guards, isChanged(), leaveReason(), rebaseDraft()

### Community 124 - "FirestoreRepository.ts"
Cohesion: 0.09
Nodes (21): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, FirebaseClientConfig, SubscribeCallback, Unsubscribe, CacheEntry (+13 more)

### Community 125 - "leaveImport.test.ts"
Cohesion: 0.33
Nodes (5): 2. Readability & Simplicity, AL, data(), nurses, SL

### Community 126 - "ref_node_assert"
Cohesion: 0.08
Nodes (16): BACKUPS_KEPT, MONTHS, suggestRosterName(), diff(), LATE, nurse, CARD, EARLY (+8 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 129 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 130 - "Review Process"
Cohesion: 0.33
Nodes (6): Review Process, Step 1: Understand the Context, Step 2: Review the Tests First, Step 3: Review the Implementation, Step 4: Categorize Findings, Step 5: Verify the Verification

### Community 131 - "my-requests.cjs"
Cohesion: 0.20
Nodes (7): args, { chromium }, args, { chromium }, args, { chromium }, t()

### Community 133 - "ui/index.ts"
Cohesion: 0.09
Nodes (40): RosterPicker(), Badge(), ProblemBadge(), ProblemKind, Tone, TONE_CLASSES, ButtonProps, ButtonSize (+32 more)

### Community 134 - "The Five-Axis Review"
Cohesion: 0.40
Nodes (5): 1. Correctness, 3. Architecture, 4. Security, 5. Performance, The Five-Axis Review

### Community 155 - "doctorWeekChange.test.ts"
Cohesion: 0.07
Nodes (20): ScheduleValidator, check(), nurse, nurse2, schedule, LEE, MONDAY_SESSIONS, MONDAYS (+12 more)

### Community 157 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

## Knowledge Gaps
- **1011 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1006 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1235 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `SchedulesView.tsx` to `ExportModal.tsx`, `rowsInSteps.ts`, `nurseRosterService.ts`, `GridTable.tsx`, `getRepository`, `ui/index.ts`, `package.json`, `WorkbookGrid.tsx`, `usePhoneLayout.ts`, `DashboardView.tsx`, `NurseSample.tsx`, `ReportsView.tsx`, `App.tsx`, `PlannerSample.tsx`, `ui.tsx`, `access.ts`, `fixtures.ts`, `Assignment`, `Button`, `AppShell.tsx`, `dialogs.tsx`, `WhoCanCover.tsx`, `useDialogA11y`, `RosterToolbar.tsx`, `PublishedRosterView.tsx`, `PublishView.tsx`, `harness/main.tsx`, `RosterSteps.tsx`, `HistoryView.tsx`, `usePresence.ts`, `authService.ts`, `AvailabilityView.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `SchedulesView.tsx` to `ExportModal.tsx`, `nurseRosterService.ts`, `GridTable.tsx`, `getRepository`, `ui/index.ts`, `package.json`, `WorkbookGrid.tsx`, `DashboardView.tsx`, `NurseSample.tsx`, `ReportsView.tsx`, `App.tsx`, `PlannerSample.tsx`, `ui.tsx`, `access.ts`, `Assignment`, `Button`, `AppShell.tsx`, `dialogs.tsx`, `RosterToolbar.tsx`, `PublishedRosterView.tsx`, `PublishView.tsx`, `harness/main.tsx`, `RosterSteps.tsx`, `HistoryView.tsx`, `authService.ts`, `AvailabilityView.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `rowsInSteps.ts`, `nurseRosterService.ts`, `SchedulingEngine.ts`, `ui/index.ts`, `getRepository`, `GridTable.tsx`, `WorkbookGrid.tsx`, `usePhoneLayout.ts`, `seedRunner.ts`, `IRepository`, `ReportsView.tsx`, `checkScheduler.test.ts`, `access.ts`, `SchedulesView.tsx`, `fixtures.ts`, `Assignment`, `resumePublish.ts`, `Button`, `AppShell.tsx`, `dialogs.tsx`, `useDialogA11y`, `RosterToolbar.tsx`, `apiApp.ts`, `PublishedRosterView.tsx`, `icsExportService.ts`, `leaveImport.ts`, `PublishView.tsx`, `types/index.ts`, `leaveAllowance.test.ts`, `dateDefaults.ts`, `RosterSteps.tsx`, `FirestoreRepository`, `HistoryView.tsx`, `usePresence.ts`, `peopleImport.ts`, `authService.ts`, `AvailabilityView.tsx`, `leaveGuard.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Are the 126 inferred relationships involving `16. History of work (for context)` (e.g. with `getDocumentAs()` and `setTextFieldsAs()`) actually correct?**
  _`16. History of work (for context)` has 126 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1011 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07928118393234672 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06537282941777324 - nodes in this community are weakly interconnected._