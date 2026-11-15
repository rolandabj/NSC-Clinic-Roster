# Graph Report - NSC-Clinic-Roster  (2026-11-15)

## Corpus Check
- 454 files · ~462,706 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 3173 nodes · 11195 edges · 165 communities (135 shown, 30 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 519 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `61c307da`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- PublishedRosterView
- clinicModel.test.ts
- authService
- gridSelection.ts
- getRepository
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- PublishModal.tsx
- DashboardView.tsx
- dialogs.tsx
- handMoves.test.ts
- IRepository
- firebaseIdentityService.ts
- index.tsx
- compilerOptions
- ReportsView.tsx
- App.tsx
- emailService.ts
- devDependencies
- AvailabilityView.tsx
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
- SchedulesView.tsx
- fixtures.ts
- Optimization Patterns
- Assignment
- CollectionSyncer
- rules.test.mjs
- Frontend UI Engineering
- resumePublish.ts
- authorizedFetch
- firestore-rules/package.json
- doctorScheduleService.ts
- continuousHours.test.ts
- leave-dialogs.cjs
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- NSC Clinic Roster: complete project guide
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
- nurseClinicFloat.test.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- guide-with-code.mjs
- access.ts
- Rules
- RosterToolbar.tsx
- README.md
- types/index.ts
- holidayLeave.ts
- apiApp.ts
- leaveGuard.ts
- links.cjs
- icsExportService.ts
- cellView.ts
- makeNurse
- checkScheduler.test.ts
- coverageRepair.test.ts
- 4. What each phase did
- IRepository.ts
- nurseList.test.ts
- useDialogA11y
- colorContrast.ts
- harness/main.tsx
- doctor-cover.cjs
- 16. History of work (for context)
- Finish a change
- Rules
- sharing.test.ts
- eligibility-publish.cjs
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
- published-rules.mjs
- WhoCanCover.tsx
- fakeAuth.ts
- yearToDate.ts
- quotaTracker
- HistoryView.tsx
- LiveCollectionCache
- approvedDayOff.test.ts
- peopleImport.ts
- editSaving.test.ts
- doctorWeekChange.test.ts
- authService.ts
- server.ts
- settings-dialogs.cjs
- ask-before-main.mjs
- seedRunner.ts
- sheet-tabs.cjs
- ref_node_assert
- grid-timing.cjs
- ddmmyyyy
- NursesView.tsx
- public-pages.cjs
- my-requests.cjs
- pairedDoctorSafety.test.ts
- react
- request-clinic-dialogs.cjs
- RosterSteps.tsx
- weekHours.test.ts
- allowance.cjs
- grid-keys.cjs
- data-backup.cjs
- nurse-editor.cjs
- nurse-page.cjs
- nurses-list.cjs
- form-dialogs.cjs
- 13. Screens in detail
- useRowsInSteps
- leave-grid.cjs
- UI overhaul: checklist
- your-access.cjs
- roster-editing-dialogs.cjs
- access.cjs
- grid-flow.cjs
- coverageChecks.test.ts
- analysis-report.cjs
- ScheduleValidator.ts
- time-periods.cjs
- address.ts
- scripts
- staffRequestService.ts
- newRosterDates.ts
- plain-english-reviewer.md
- audit.cjs
- doctors.cjs
- sent-rosters.cjs
- settings-save.cjs

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 128 edges
2. `16. History of work (for context)` - 128 edges
3. `react` - 120 edges
4. `Nurse` - 115 edges
5. `DutyWindow` - 101 edges
6. `formatDate()` - 100 edges
7. `getRepository()` - 99 edges
8. `Button()` - 95 edges
9. `Schedule` - 93 edges
10. `Doctor` - 92 edges

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

## Communities (165 total, 30 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.09
Nodes (45): jspdf, jspdf-autotable, xlsx, shiftTargetName(), WEEKDAY_NAMES, ExportModal(), ExportTab, fmtHours() (+37 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.06
Nodes (76): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, RosterAnalysisPanel(), assignmentCoversDoctor(), ClinicSetup, coverageSlots(), coveredMinutes() (+68 more)

### Community 2 - "PublishedRosterView"
Cohesion: 0.21
Nodes (9): 1. Features at a glance, PublicMessage(), PublishedRosterView(), loadPublishedRoster(), downloadIcsFile(), MyDay, myShiftDays(), loadPublicRoster() (+1 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.12
Nodes (7): 3. Users, roles and access, authService, FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider

### Community 5 - "gridSelection.ts"
Cohesion: 0.11
Nodes (21): CELL_FLASH, CELL_POPUP, CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN, isRosterCell(), keyOf() (+13 more)

### Community 6 - "getRepository"
Cohesion: 0.16
Nodes (43): useAppContext(), confirmDialog(), notify(), Field(), Input(), ClinicTab(), DatabaseTab(), DatabaseTabProps (+35 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.33
Nodes (5): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 5. What comes next, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (21): description, firebase, name, private, type, version, esbuild, eslint (+13 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.09
Nodes (34): useRosterEdits(), CellContextMenu(), GRID_KEY_ID, GridLegend(), GridStatusBar(), GridTable(), TotalsCell(), GridToolbar() (+26 more)

### Community 11 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, express, express-rate-limit, firebase, @google/genai, helmet, jose, jspdf (+11 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "PublishModal.tsx"
Cohesion: 0.13
Nodes (24): EmailHtmlPreview(), PublishModal(), Step, AllocationReviews(), Checkbox(), PublishViewProps, SENDS_PER_PAGE, SentTab (+16 more)

### Community 14 - "DashboardView.tsx"
Cohesion: 0.09
Nodes (42): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData (+34 more)

### Community 15 - "dialogs.tsx"
Cohesion: 0.20
Nodes (15): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+7 more)

### Community 16 - "handMoves.test.ts"
Cohesion: 0.08
Nodes (23): AGREED_EXCEPTION_NOTE, moveShift(), swapShifts(), AMY, BEA, CARA, DAN, DOCTORS (+15 more)

### Community 17 - "IRepository"
Cohesion: 0.09
Nodes (28): saveRosterBackup(), restoreVersion(), VersionRestoreResult, saveHolidayLeave(), ensureNurseLink(), newToken(), regenerateNurseLink(), removeNurseRoster() (+20 more)

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.10
Nodes (25): jose, AuthUser, Express, Request, requireOwner, requirePlanner, ROLE_HIERARCHY, verifyToken() (+17 more)

### Community 19 - "index.tsx"
Cohesion: 0.33
Nodes (5): FONTS, renderSample(), NurseSample(), where(), react-dom

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "ReportsView.tsx"
Cohesion: 0.13
Nodes (32): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, AUDIT_PAGE_SIZE, AuditTrailViewProps, BarList(), hours() (+24 more)

### Community 22 - "App.tsx"
Cohesion: 0.16
Nodes (11): App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoadErrorBoundary, Props (+3 more)

### Community 23 - "emailService.ts"
Cohesion: 0.17
Nodes (13): emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, ServerEmailConfig, SMTP_CONNECTION_KEYS, withoutConnectionSettings() (+5 more)

### Community 24 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, esbuild, eslint, @eslint/js, eslint-plugin-jsx-a11y, eslint-plugin-react-hooks, tailwindcss, @types/express (+7 more)

### Community 25 - "AvailabilityView.tsx"
Cohesion: 0.18
Nodes (24): uuid, NoticeTone, useLatestCallback(), ShareModal(), TemplateModal(), IconButton(), Switch(), Textarea() (+16 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (20): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, isGoogleAccountEmail(), SendEmailPayload, SendEmailResult (+12 more)

### Community 28 - "emailPublishing.test.ts"
Cohesion: 0.11
Nodes (13): nodemailer, EmailReadiness, readEmailResponse(), RosterPublishService, configured, live, all, backup (+5 more)

### Community 29 - "hoursAccounting.ts"
Cohesion: 0.05
Nodes (59): 7. Rules, NurseTimesheetModalProps, fmtHours(), HoursAccountingSheet(), leaveCountingOnHoliday(), askedCarry(), closePeriod(), earlierPeriodTotals() (+51 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.16
Nodes (34): countOf(), dayProblems(), problemAt(), tint(), Brand(), clamp(), DayView(), describe() (+26 more)

### Community 31 - "ui.tsx"
Cohesion: 0.13
Nodes (17): LeaveForm(), Card(), DateInput(), Field(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM (+9 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "GridTable.tsx"
Cohesion: 0.11
Nodes (26): CellView, DayTotal, dayTotalsOf(), dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions (+18 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.06
Nodes (33): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+25 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "auditWords.ts"
Cohesion: 0.21
Nodes (13): ACTION_WORDS, actionWord(), AUDIT_ACTIONS, AuditFilters, changedFields(), ENTITY_WORDS, entityWord(), FieldChange (+5 more)

### Community 38 - "SchedulesView.tsx"
Cohesion: 0.11
Nodes (45): CreateScheduleModal(), DeleteScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, EditDoctorShiftModal(), TIME_PRESETS, FairnessModal(), SwapManagerModal() (+37 more)

### Community 39 - "fixtures.ts"
Cohesion: 0.07
Nodes (31): 15. Tests, ctx(), EARLY, LATE, EARLY, input(), LATE, softHoursLimit (+23 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.10
Nodes (87): 5. Data model (Firestore collections), VersionRosterProps, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps, ExportModalProps (+79 more)

### Community 42 - "CollectionSyncer"
Cohesion: 0.11
Nodes (10): 11. Saving, live updates, versions, CollectionSyncer, Desired, fingerprint(), Known, planSync(), SyncPlan, rebaseEdit() (+2 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.15
Nodes (20): EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), findStoppedPublish(), isDone(), isResumable(), lastNews() (+12 more)

### Community 46 - "authorizedFetch"
Cohesion: 0.27
Nodes (9): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload (+1 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "doctorScheduleService.ts"
Cohesion: 0.26
Nodes (11): doctorFromDate(), generateDoctorSessionsForDateRange(), getWeekdayFromIsoDate(), nextDay(), PatternSessionPlan, planPatternSessions(), PopulateRecurringDoctorSessionsParams, PopulateRecurringDoctorSessionsResult (+3 more)

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.15
Nodes (12): duties, first, goal8(), history, long, nurse, p8, periods (+4 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.12
Nodes (29): AppContext, AppContextValue, AppShell(), bootstrap(), AuditTrailView, AvailabilityView, DoctorsView, HistoryView (+21 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.13
Nodes (13): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 2. Repository layout, NSC Clinic Roster: complete project guide, Development, Getting Started, Key Features (+5 more)

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
Nodes (13): clearYearToDateCache(), forgetCachedRoster(), createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue, afterShiftsSaved(), queuesByRepo, RETRY_EVERY_MS (+5 more)

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "nurseClinicFloat.test.ts"
Cohesion: 0.22
Nodes (7): CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.09
Nodes (21): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, Final audit, 14-11-2026 (Phase 9), How every phase is done, Not in this plan (+13 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.11
Nodes (22): Cell, dayLabel(), DAYS, DOCTORS, LEAVE, Nurse, NURSES, parse() (+14 more)

### Community 72 - "guide-with-code.mjs"
Cohesion: 0.20
Nodes (4): command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() }

### Community 73 - "access.ts"
Cohesion: 0.14
Nodes (20): 4. Navigation and app shell, LoginPageProps, AppShellProps, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS (+12 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "RosterToolbar.tsx"
Cohesion: 0.10
Nodes (22): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), FillDialogProps, moreMenuItems(), RosterMenuItem (+14 more)

### Community 77 - "types/index.ts"
Cohesion: 0.07
Nodes (32): RuleDef, isPairing(), PREFERENCE_FOCUS_LABELS, eligibilityNeedsReview(), ids(), reviewedDoctorEligibility(), FIELDS, rebaseRules() (+24 more)

### Community 78 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 79 - "apiApp.ts"
Cohesion: 0.13
Nodes (15): repoRoot, swaps, express, express-rate-limit, helmet, @tailwindcss/vite, vite, @vitejs/plugin-react (+7 more)

### Community 80 - "leaveGuard.ts"
Cohesion: 0.43
Nodes (6): addLeaveGuard(), Guard, guards, isChanged(), leaveReason(), rebaseDraft()

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "icsExportService.ts"
Cohesion: 0.11
Nodes (27): RFC-5545, calendarRouter, documentUrl(), fromFirestoreFields(), fromFirestoreValue(), getDocumentAs(), getPublicDocument(), readDocument() (+19 more)

### Community 83 - "cellView.ts"
Cohesion: 0.07
Nodes (39): DayProblem, DayRow, dayViewOf(), firstDayShown(), isPhoneSize(), KIND, ORDER, CellDay (+31 more)

### Community 84 - "makeNurse"
Cohesion: 0.07
Nodes (33): SchedulingEngine, CARD, input(), KHAN, LATE, reviewInput(), SCHEDULE, SESSIONS (+25 more)

### Community 85 - "checkScheduler.test.ts"
Cohesion: 0.26
Nodes (6): 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler()

### Community 86 - "coverageRepair.test.ts"
Cohesion: 0.18
Nodes (6): dates, DAY, doctors, FULL, specialties, staff

### Community 87 - "4. What each phase did"
Cohesion: 0.12
Nodes (15): GROUPS, Key(), ShortcutsModal(), ShortcutsModalProps, 1. Where things stand, 2. Why this work, 4. What each phase did, 5. Numbers: baseline vs final (+7 more)

### Community 88 - "IRepository.ts"
Cohesion: 0.16
Nodes (12): FirebaseClientConfig, FirestoreRepository, sanitizePayload(), SubscribeCallback, Unsubscribe, listPage(), Page, pageFromList() (+4 more)

### Community 89 - "nurseList.test.ts"
Cohesion: 0.32
Nodes (4): filterNurses(), nurseCounts(), NurseFilters, nurses

### Community 90 - "useDialogA11y"
Cohesion: 0.12
Nodes (15): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+7 more)

### Community 91 - "colorContrast.ts"
Cohesion: 0.50
Nodes (6): contrastRatio(), INK, INK_MUTED, luminance(), rgbOf(), tint()

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "doctor-cover.cjs"
Cohesion: 0.29
Nodes (5): args, assert, {chromium}, fs, path

### Community 94 - "16. History of work (for context)"
Cohesion: 0.20
Nodes (14): 16. History of work (for context), CellChoice, DayColumn, ProblemMark, GridCell, moveInGrid(), pickStep(), addDays() (+6 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

### Community 98 - "eligibility-publish.cjs"
Cohesion: 0.25
Nodes (7): args, assert, { chromium }, fixture(), pageFor(), preview(), Phase 9: tidy up, ESLint in CI, final audit and guide section 13 (03-11-2026 to 14-11-2026, guide items 105 to 112)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ref_playwright"
Cohesion: 0.10
Nodes (13): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+5 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursTopUp.test.ts"
Cohesion: 0.15
Nodes (9): DR_G, DR_O, EARLY, FULL, NINE_FIVE, NINE_SEVEN, NO_EXTRAS, OBGYN (+1 more)

### Community 104 - "geminiApi.test.ts"
Cohesion: 0.23
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 108 - "engineRules.test.ts"
Cohesion: 0.20
Nodes (4): JUNIOR, LEVELS, NC, PHL

### Community 109 - "published-rules.mjs"
Cohesion: 0.12
Nodes (15): { access_token: token }, claims, curl(), dir, fail(), get(), local, now (+7 more)

### Community 110 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 111 - "fakeAuth.ts"
Cohesion: 0.15
Nodes (9): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Steps, Things that went wrong before, planner(), history() (+1 more)

### Community 112 - "yearToDate.ts"
Cohesion: 0.14
Nodes (21): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), clamp(), KEYS, YEAR_SEED_CAP, YearSeed (+13 more)

### Community 113 - "quotaTracker"
Cohesion: 0.14
Nodes (7): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker, CacheEntry, ListFilter, UNCACHED_COLLECTIONS

### Community 114 - "HistoryView.tsx"
Cohesion: 0.14
Nodes (29): VersionRoster(), DeleteVersionModal(), plural(), CHANGE_LABELS, CHANGE_TONES, VersionViewModal(), CHANGE_WORDS, HistoryView() (+21 more)

### Community 115 - "LiveCollectionCache"
Cohesion: 0.27
Nodes (3): LiveCollectionCache, entry, matchesFilter()

### Community 116 - "approvedDayOff.test.ts"
Cohesion: 0.25
Nodes (6): DR, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 117 - "peopleImport.ts"
Cohesion: 0.07
Nodes (34): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+26 more)

### Community 118 - "editSaving.test.ts"
Cohesion: 0.48
Nodes (4): changedLists(), sameItems(), countedShift(), shift()

### Community 119 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 120 - "authService.ts"
Cohesion: 0.11
Nodes (29): signOutSafely(), AccountMenu(), TopBar(), TopBarProps, AuthModal(), AccessManagementPanel(), AvailabilityViewProps, DoctorsViewProps (+21 more)

### Community 121 - "server.ts"
Cohesion: 0.33
Nodes (3): builtServer, __dirname, __filename

### Community 123 - "ask-before-main.mjs"
Cohesion: 0.50
Nodes (4): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }

### Community 124 - "seedRunner.ts"
Cohesion: 0.11
Nodes (23): countOf(), assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap() (+15 more)

### Community 126 - "ref_node_assert"
Cohesion: 0.07
Nodes (21): CapacityJob, Edge, futureCapacity(), BACKUPS_KEPT, MONTHS, suggestRosterName(), diff(), LATE (+13 more)

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "ddmmyyyy"
Cohesion: 0.50
Nodes (5): ddmmyyyy(), datesOf(), day(), RequestsCard(), StatusBadge()

### Community 129 - "NursesView.tsx"
Cohesion: 0.14
Nodes (39): BulkImportModal(), WeekChangePreview, Badge(), PageHeader(), Column, DataTable(), Select(), EmptyState() (+31 more)

### Community 131 - "my-requests.cjs"
Cohesion: 0.20
Nodes (7): args, { chromium }, args, { chromium }, args, { chromium }, t()

### Community 132 - "pairedDoctorSafety.test.ts"
Cohesion: 0.11
Nodes (24): allocationSignature(), approveAllocation(), hasAllocationReview(), AllocationDraft, applyAllocationDrafts(), pendingAllocationReviews(), publicationReport(), AllocationReview (+16 more)

### Community 133 - "react"
Cohesion: 0.07
Nodes (49): lucide-react, react, LoginPage(), PublicPageFrame(), LocalModeBannerProps, PROBLEM_MARKS, ProblemBadge(), ProblemKind (+41 more)

### Community 135 - "RosterSteps.tsx"
Cohesion: 0.31
Nodes (5): RosterStep, RosterStepAction, rosterSteps(), RosterSteps(), base

### Community 136 - "weekHours.test.ts"
Cohesion: 0.07
Nodes (16): ScheduleValidator, dates, doctors, rules, specialties, DR_PEDS, ENT, FULL (+8 more)

### Community 147 - "13. Screens in detail"
Cohesion: 0.17
Nodes (15): 13. Screens in detail, PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout(), checkDayRequest(), checkLeaveRequest(), dayStatus() (+7 more)

### Community 148 - "useRowsInSteps"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 150 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 155 - "coverageChecks.test.ts"
Cohesion: 0.25
Nodes (4): check(), nurse, nurse2, schedule

### Community 157 - "analysis-report.cjs"
Cohesion: 0.18
Nodes (7): args, assert, {chromium}, downloads, fs, os, path

### Community 159 - "ScheduleValidator.ts"
Cohesion: 0.09
Nodes (43): 6. Clinic model (the business rules in plain English), Other engine files, checkAssignment(), hardRule(), listProblem(), minutes(), restHoursBetween(), shiftDate() (+35 more)

### Community 162 - "address.ts"
Cohesion: 0.33
Nodes (7): Address, addressHash(), ORDER, readAddress(), ROSTER_SHEETS, rosterSheetFromAddress(), rosterSheetToAddress()

### Community 163 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 165 - "staffRequestService.ts"
Cohesion: 0.16
Nodes (19): canApproveRequests(), allowanceFor(), Kind, takesAllowance(), dayOffLockId(), daysInclusive(), deleteAvailabilityRequest(), isPendingLeave() (+11 more)

### Community 170 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 171 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **1067 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1062 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1309 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `NursesView.tsx`, `SchedulingEngine.ts`, `gridSelection.ts`, `getRepository`, `RosterSteps.tsx`, `package.json`, `WorkbookGrid.tsx`, `PublishModal.tsx`, `DashboardView.tsx`, `dialogs.tsx`, `13. Screens in detail`, `useRowsInSteps`, `ReportsView.tsx`, `App.tsx`, `AvailabilityView.tsx`, `hoursAccounting.ts`, `PlannerSample.tsx`, `ui.tsx`, `GridTable.tsx`, `SchedulesView.tsx`, `fixtures.ts`, `Assignment`, `AppShell.tsx`, `data.ts`, `access.ts`, `RosterToolbar.tsx`, `4. What each phase did`, `useDialogA11y`, `harness/main.tsx`, `WhoCanCover.tsx`, `HistoryView.tsx`, `authService.ts`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `NursesView.tsx`, `SchedulingEngine.ts`, `getRepository`, `RosterSteps.tsx`, `package.json`, `WorkbookGrid.tsx`, `PublishModal.tsx`, `DashboardView.tsx`, `dialogs.tsx`, `ReportsView.tsx`, `App.tsx`, `AvailabilityView.tsx`, `hoursAccounting.ts`, `PlannerSample.tsx`, `ui.tsx`, `GridTable.tsx`, `SchedulesView.tsx`, `Assignment`, `AppShell.tsx`, `data.ts`, `access.ts`, `RosterToolbar.tsx`, `harness/main.tsx`, `HistoryView.tsx`, `authService.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `ExportModal.tsx`, `NursesView.tsx`, `PublishedRosterView`, `SchedulingEngine.ts`, `react`, `getRepository`, `RosterSteps.tsx`, `gridSelection.ts`, `WorkbookGrid.tsx`, `PublishModal.tsx`, `dialogs.tsx`, `IRepository`, `13. Screens in detail`, `useRowsInSteps`, `ReportsView.tsx`, `AvailabilityView.tsx`, `GridTable.tsx`, `address.ts`, `staffRequestService.ts`, `SchedulesView.tsx`, `Assignment`, `CollectionSyncer`, `resumePublish.ts`, `AppShell.tsx`, `NSC Clinic Roster: complete project guide`, `access.ts`, `RosterToolbar.tsx`, `types/index.ts`, `apiApp.ts`, `leaveGuard.ts`, `icsExportService.ts`, `cellView.ts`, `checkScheduler.test.ts`, `IRepository.ts`, `useDialogA11y`, `colorContrast.ts`, `eligibility-publish.cjs`, `HistoryView.tsx`, `peopleImport.ts`, `editSaving.test.ts`, `authService.ts`, `seedRunner.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Are the 127 inferred relationships involving `16. History of work (for context)` (e.g. with `preview()` and `getDocumentAs()`) actually correct?**
  _`16. History of work (for context)` has 127 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1067 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08821548821548822 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.062172284644194754 - nodes in this community are weakly interconnected._