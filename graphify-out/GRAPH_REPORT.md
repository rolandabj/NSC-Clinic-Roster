# Graph Report - NSC-Clinic-Roster  (2026-11-16)

## Corpus Check
- 465 files · ~474,446 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 3263 nodes · 11607 edges · 167 communities (137 shown, 30 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 518 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2d6a6196`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExportModal.tsx
- SchedulingEngine.ts
- dialogs.tsx
- clinicModel.test.ts
- authService
- analysisExport.test.ts
- getRepository
- Handover for a new chat
- ui-audit.cjs
- package.json
- WorkbookGrid.tsx
- dependencies
- Test-Driven Development
- ClinicContextState
- DashboardView.tsx
- analysisExportService.ts
- handMoves.test.ts
- FirestoreRepository
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- ReportsView.tsx
- PublishedRosterView.tsx
- emailService.ts
- devDependencies
- staffRequestService.ts
- quick reference
- decisionEmail.test.ts
- emailPublishing.test.ts
- hoursBalance.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- GridTable.tsx
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- auditWords.ts
- SchedulesView.tsx
- makeNurse
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
- leave-dialogs.cjs
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- 16. History of work (for context)
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
- nurseClinicFloat.test.ts
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- guide-with-code.mjs
- 4. What each phase did
- Rules
- RosterToolbar.tsx
- README.md
- types/index.ts
- holidayLeave.ts
- apiApp.ts
- leaveGuard.ts
- links.cjs
- nurseRosterService.ts
- fixtures.ts
- createApiApp
- cx
- coverageRepair.test.ts
- quotaTracker
- IRepository
- PublishView.tsx
- doctorForm.ts
- SwapManagerModal.tsx
- harness/main.tsx
- lowAcuityDoctors.test.ts
- checkScheduler.test.ts
- Finish a change
- Rules
- sharing.test.ts
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
- Design system: NSC Clinic Roster
- scheduleRanges.ts
- yearToDate.ts
- retainedCoverage.test.ts
- HistoryView.tsx
- RosterGrid
- nurseForm.ts
- nextPeriod.ts
- dateDefaults.ts
- approvedDayOff.test.ts
- authService.ts
- futureReservations.test.ts
- colorContrast.ts
- Scheduling engine improvement plan
- seedRunner.ts
- sheet-tabs.cjs
- doctorEligibility.test.ts
- grid-timing.cjs
- doctor-cover.cjs
- AllRequestsPanel.tsx
- UI overhaul: summary and final results
- publication-availability.cjs
- lowAcuityLastResort.test.ts
- react
- request-clinic-dialogs.cjs
- RosterSteps.tsx
- resume.cjs
- allowance.cjs
- grid-keys.cjs
- server.ts
- ask-before-main.mjs
- usePhoneLayout.ts
- Scheduling engine improvement checklist
- doctors.cjs
- form-dialogs.cjs
- history.cjs
- nurse-editor.cjs
- nurse-page.cjs
- ProblemCounts
- leave-grid.cjs
- UI overhaul: checklist
- your-access.cjs
- nurses-list.cjs
- access.cjs
- publish.cjs
- SENIOR
- requests.cjs
- analysis-report.cjs
- toolbar.cjs
- time-periods.cjs
- scripts
- ref_node_assert
- newRosterDates.ts
- plain-english-reviewer.md
- audit.cjs
- sent-rosters.cjs
- settings-save.cjs

## God Nodes (most connected - your core abstractions)
1. `Assignment` - 141 edges
2. `16. History of work (for context)` - 128 edges
3. `Nurse` - 126 edges
4. `react` - 120 edges
5. `DutyWindow` - 107 edges
6. `formatDate()` - 102 edges
7. `getRepository()` - 99 edges
8. `Doctor` - 99 edges
9. `Schedule` - 96 edges
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

## Communities (167 total, 30 thin omitted)

### Community 0 - "ExportModal.tsx"
Cohesion: 0.07
Nodes (50): RFC-5545, jspdf, jspdf-autotable, ExportTab, fmtHours(), WEEKDAY_NAMES, NurseTimesheetModalProps, fmtHours() (+42 more)

### Community 1 - "SchedulingEngine.ts"
Cohesion: 0.09
Nodes (67): 6. Clinic model (the business rules in plain English), assignmentCanCoverDoctor(), nurseIsAvailable(), assignmentCoversDoctor(), assignmentDoctorIds(), bloodCollectionRole(), canBeFreeNurse(), coverageSlots() (+59 more)

### Community 2 - "dialogs.tsx"
Cohesion: 0.11
Nodes (31): ConfirmBox(), ConfirmOptions, DialogHost(), DialogState, dismissNotice(), listeners, Notice, PendingConfirm (+23 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.09
Nodes (10): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Things that went wrong before, authService, FirebaseConfig, getAppAuth(), getAppFirestore() (+2 more)

### Community 5 - "analysisExport.test.ts"
Cohesion: 0.12
Nodes (16): ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, reviewInput(), SCHEDULE, SESSIONS (+8 more)

### Community 6 - "getRepository"
Cohesion: 0.15
Nodes (48): useAppContext(), confirmDialog(), notify(), AllocationReviews(), Checkbox(), Field(), Input(), AccessManagementPanel() (+40 more)

### Community 7 - "Handover for a new chat"
Cohesion: 0.33
Nodes (5): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 5. What comes next, Handover for a new chat

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (24): description, firebase, name, private, type, version, esbuild, eslint (+16 more)

### Community 10 - "WorkbookGrid.tsx"
Cohesion: 0.05
Nodes (65): DayProblem, DayRow, dayViewOf(), firstDayShown(), KIND, ORDER, CellContextMenu(), CellDay (+57 more)

### Community 11 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, express, express-rate-limit, firebase, @google/genai, helmet, jose, jspdf (+11 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "ClinicContextState"
Cohesion: 0.09
Nodes (32): AppContext, AppContextValue, APP_NAME, SCREEN_NAMES, screenName(), screenTitle(), NAV_ITEMS, SidebarProps (+24 more)

### Community 14 - "DashboardView.tsx"
Cohesion: 0.20
Nodes (20): Card(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData, addDays() (+12 more)

### Community 15 - "analysisExportService.ts"
Cohesion: 0.08
Nodes (42): RosterAnalysisPanel(), ProblemsPanelProps, CATEGORY_LABELS, SEVERITY_LABELS, WarningsSheetProps, allocationSignature(), approveAllocation(), hasAllocationReview() (+34 more)

### Community 16 - "handMoves.test.ts"
Cohesion: 0.05
Nodes (30): AGREED_EXCEPTION_NOTE, LAST_RESORT_NOTE, check(), doctor, missing(), noDoctorCover(), nurse, off (+22 more)

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
Cohesion: 0.14
Nodes (30): usePermissions(), fmtHours(), NurseTimesheetModal(), SOURCE_LABELS, BarList(), hours(), Meter(), METER_FILL (+22 more)

### Community 22 - "PublishedRosterView.tsx"
Cohesion: 0.11
Nodes (21): react-dom, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+13 more)

### Community 23 - "emailService.ts"
Cohesion: 0.29
Nodes (7): emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SMTP_CONNECTION_KEYS, withoutConnectionSettings()

### Community 24 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, esbuild, eslint, @eslint/js, eslint-plugin-jsx-a11y, eslint-plugin-react-hooks, tailwindcss, @types/express (+7 more)

### Community 25 - "staffRequestService.ts"
Cohesion: 0.12
Nodes (20): leaveClash(), daysInclusive(), LeaveImportRow, planLeaveImport(), allowanceFor(), Kind, takesAllowance(), dayOffLockId() (+12 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (20): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, isGoogleAccountEmail(), SendEmailPayload, SendEmailResult (+12 more)

### Community 28 - "emailPublishing.test.ts"
Cohesion: 0.10
Nodes (22): nodemailer, authorizedFetch(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse (+14 more)

### Community 29 - "hoursBalance.ts"
Cohesion: 0.07
Nodes (52): 7. Rules, fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, BlockedShift, explainDay(), explainNurseDay() (+44 more)

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
Nodes (46): CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps (+38 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.06
Nodes (30): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+22 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "auditWords.ts"
Cohesion: 0.21
Nodes (13): ACTION_WORDS, actionWord(), AUDIT_ACTIONS, AuditFilters, changedFields(), ENTITY_WORDS, entityWord(), FieldChange (+5 more)

### Community 38 - "SchedulesView.tsx"
Cohesion: 0.13
Nodes (47): CreateScheduleModal(), DeleteScheduleModal(), DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, EditDoctorShiftModal(), TIME_PRESETS, ExportModal(), FairnessModal() (+39 more)

### Community 39 - "makeNurse"
Cohesion: 0.08
Nodes (25): DAY_DUTY, makeNurse(), makeSchedule(), account(), CARD, doctorOfAmy(), KHAN, LATE (+17 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "Assignment"
Cohesion: 0.09
Nodes (99): 5. Data model (Firestore collections), Request, VersionRosterProps, BulkImportModalProps, CreateScheduleModalProps, DeleteScheduleModalProps, DeleteVersionModalProps, EditDoctorShiftModalProps (+91 more)

### Community 42 - "EntityForCollection"
Cohesion: 0.09
Nodes (17): 11. Saving, live updates, versions, useRosterEdits(), saveHolidayLeave(), CollectionSyncer, Desired, fingerprint(), Known, planSync() (+9 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.09
Nodes (15): args, { chromium }, args, { chromium }, args, { chromium }, anon, editor (+7 more)

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 45 - "resumePublish.ts"
Cohesion: 0.10
Nodes (29): 12. Publishing and nurse links, ServerEmailConfig, EmailTabProps, EMAIL_LOG_HTML_BUDGET, encoder, htmlBytes(), recipientsForLog(), findStoppedPublish() (+21 more)

### Community 46 - "IRepository.ts"
Cohesion: 0.21
Nodes (9): FirebaseClientConfig, SubscribeCallback, Unsubscribe, listPage(), Page, pageFromList(), PageRequest, CollectionName (+1 more)

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "LiveCollectionCache"
Cohesion: 0.20
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 49 - "continuousHours.test.ts"
Cohesion: 0.14
Nodes (13): balance(), duties, first, goal8(), history, long, nurse, p8 (+5 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "16. History of work (for context)"
Cohesion: 0.08
Nodes (49): 0. Quick start for a new chat, 14. Server, security and config, 16. History of work (for context), 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 3. Users, roles and access, 4. Navigation and app shell (+41 more)

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
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "guide-with-code.mjs"
Cohesion: 0.20
Nodes (4): command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() }

### Community 73 - "4. What each phase did"
Cohesion: 0.19
Nodes (11): preview(), nextRowLimit(), ROW_STEP, useRowsInSteps(), 4. What each phase did, Phase 0: setup (07-10-2026, guide item 42), Phase 1: quick fixes and safety (07-10-2026, guide item 44), Phase 3: roster grid speed and structure (13-10-2026, guide items 48 to 58) (+3 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "RosterToolbar.tsx"
Cohesion: 0.20
Nodes (13): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), FillDialogProps, moreMenuItems(), RosterMenuItem (+5 more)

### Community 77 - "types/index.ts"
Cohesion: 0.08
Nodes (27): eligibilityNeedsReview(), ids(), reviewedDoctorEligibility(), FIELDS, rebaseRules(), ruleChanges(), same(), AllocationReview (+19 more)

### Community 78 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 79 - "apiApp.ts"
Cohesion: 0.10
Nodes (21): express, @google/genai, authMiddleware(), AuthUser, BackendRole, Express, requireOwner, requirePlanner (+13 more)

### Community 80 - "leaveGuard.ts"
Cohesion: 0.43
Nodes (6): addLeaveGuard(), Guard, guards, isChanged(), leaveReason(), rebaseDraft()

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "nurseRosterService.ts"
Cohesion: 0.07
Nodes (37): dateLabel(), PublishedRosterSheet(), LoadState, MyRosterViewProps, buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine() (+29 more)

### Community 83 - "fixtures.ts"
Cohesion: 0.08
Nodes (24): 15. Tests, isPhoneSize(), amy, LEE, lookups, mary, nina, shift (+16 more)

### Community 84 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 85 - "cx"
Cohesion: 0.12
Nodes (26): cx(), Switch(), AvailabilityView(), WEEKDAY_ABBR, ALWAYS_ON, effectiveValue(), findRule(), GROUPS (+18 more)

### Community 86 - "coverageRepair.test.ts"
Cohesion: 0.18
Nodes (6): dates, DAY, doctors, FULL, specialties, staff

### Community 87 - "quotaTracker"
Cohesion: 0.20
Nodes (4): nextQuotaResetMs(), QuotaExceededError, QuotaListener, quotaTracker

### Community 88 - "IRepository"
Cohesion: 0.09
Nodes (30): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, ensureNurseLink(), regenerateNurseLink(), removeNurseRoster(), revokeNurseLink() (+22 more)

### Community 89 - "PublishView.tsx"
Cohesion: 0.12
Nodes (40): NoticeTone, EmailHtmlPreview(), useLatestCallback(), BulkImportModal(), WeekChangePreview, TemplateModal(), PageHeader(), DataTable() (+32 more)

### Community 90 - "doctorForm.ts"
Cohesion: 0.22
Nodes (10): byDayAndTime(), checkDoctorForm(), DoctorFilters, DoctorFormErrors, DoctorFormValues, filterDoctors(), usualWeekLines(), WEEKDAY_NAMES (+2 more)

### Community 91 - "SwapManagerModal.tsx"
Cohesion: 0.08
Nodes (38): 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works, Other engine files, uuid, NONE, RuleDef, checkAssignment() (+30 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "lowAcuityDoctors.test.ts"
Cohesion: 0.15
Nodes (11): CARD, DERM, DR_LEE, DR_OMAR, DR_PATEL, DR_RAY_NORMAL, DR_SKIN_LOW, EARLY_DUTY (+3 more)

### Community 94 - "checkScheduler.test.ts"
Cohesion: 0.15
Nodes (11): Browser check, Steps, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), sameHoursHistory(), afterNextFrame(), CheckScheduler, createCheckScheduler() (+3 more)

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
Cohesion: 0.33
Nodes (5): args, assert, { chromium }, fixture(), pageFor()

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "ref_playwright"
Cohesion: 0.10
Nodes (13): args, { chromium }, { chromium }, args, { chromium }, args, { chromium }, args (+5 more)

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

### Community 110 - "Design system: NSC Clinic Roster"
Cohesion: 0.17
Nodes (11): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+3 more)

### Community 111 - "scheduleRanges.ts"
Cohesion: 0.32
Nodes (11): assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates(), mergeScheduleRanges(), rangesOverlap(), ScheduleOverlap (+3 more)

### Community 112 - "yearToDate.ts"
Cohesion: 0.11
Nodes (27): YearToDate, YearToDateCounts, daysBefore(), loadClinicSetup(), isLateDuty(), lateDutyThreshold(), clamp(), KEYS (+19 more)

### Community 113 - "retainedCoverage.test.ts"
Cohesion: 0.20
Nodes (9): doctor, generate(), leave, nurses, retained, roles, schedule, session (+1 more)

### Community 114 - "HistoryView.tsx"
Cohesion: 0.20
Nodes (23): shiftTargetName(), VersionRoster(), WEEKDAY_NAMES, DeleteVersionModal(), plural(), CHANGE_LABELS, CHANGE_TONES, VersionViewModal() (+15 more)

### Community 115 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 116 - "nurseForm.ts"
Cohesion: 0.31
Nodes (6): checkNurseForm(), movePreference(), nextEmployeeCode(), NurseFormErrors, NurseFormValues, others

### Community 117 - "nextPeriod.ts"
Cohesion: 0.20
Nodes (13): addDays(), MONTHS, nextPeriodDefaults(), parse(), PeriodDefaults, sameDayNextMonth(), toIso(), cellsOf() (+5 more)

### Community 118 - "dateDefaults.ts"
Cohesion: 0.44
Nodes (7): addDays(), DateRange, defaultPatternRange(), defaultSessionDate(), monthRange(), requestDefaults(), rosterFor()

### Community 119 - "approvedDayOff.test.ts"
Cohesion: 0.25
Nodes (6): DR, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 120 - "authService.ts"
Cohesion: 0.13
Nodes (21): LoginPageProps, signOutSafely(), AppShellProps, AccountMenu(), TopBar(), AuthModal(), AuthModalProps, AccessManagementPanelProps (+13 more)

### Community 121 - "futureReservations.test.ts"
Cohesion: 0.22
Nodes (5): dates, doctors, fill(), rules, specialties

### Community 122 - "colorContrast.ts"
Cohesion: 0.50
Nodes (6): contrastRatio(), INK, INK_MUTED, luminance(), rgbOf(), tint()

### Community 123 - "Scheduling engine improvement plan"
Cohesion: 0.25
Nodes (7): Agreed policy, Scheduling engine improvement plan, Stage 1: coverage correctness, Stage 2: timed cover foundation, Stage 3: sequential cover and manual editing, Stage 4: stronger search, Stage 5: clinic verification and rollout

### Community 124 - "seedRunner.ts"
Cohesion: 0.13
Nodes (16): ClinicTabProps, countOf(), SEED_CLINIC_PROFILE, SEED_WORKING_HOURS_PERIODS, ALL_COLLECTIONS, BackupCheck, ClearResult, DatabaseStats (+8 more)

### Community 126 - "doctorEligibility.test.ts"
Cohesion: 0.25
Nodes (5): doctors, prefs, refs, sessions, specialties

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "doctor-cover.cjs"
Cohesion: 0.29
Nodes (5): args, assert, {chromium}, fs, path

### Community 129 - "AllRequestsPanel.tsx"
Cohesion: 0.18
Nodes (19): 13. Screens in detail, AllRequestsPanel(), Draft, KindFilter, STATUS, StatusFilter, ApprovalsQueuePanel(), Waiting (+11 more)

### Community 130 - "UI overhaul: summary and final results"
Cohesion: 0.29
Nodes (6): 1. Where things stand, 2. Why this work, 5. Numbers: baseline vs final, 6. Next steps and items outside the plan, 7. Where to find things, UI overhaul: summary and final results

### Community 131 - "publication-availability.cjs"
Cohesion: 0.33
Nodes (3): args, assert, { chromium }

### Community 132 - "lowAcuityLastResort.test.ts"
Cohesion: 0.05
Nodes (39): SchedulingEngine, hoursOnlyRules(), LATE, run(), check(), doctors, finalContext(), float (+31 more)

### Community 133 - "react"
Cohesion: 0.09
Nodes (37): lucide-react, react, LocalModeBanner(), LocalModeBannerProps, PROBLEM_MARKS, ProblemBadge(), ProblemKind, Tone (+29 more)

### Community 135 - "RosterSteps.tsx"
Cohesion: 0.36
Nodes (4): RosterStep, RosterStepAction, rosterSteps(), base

### Community 139 - "server.ts"
Cohesion: 0.33
Nodes (3): builtServer, __dirname, __filename

### Community 140 - "ask-before-main.mjs"
Cohesion: 0.50
Nodes (4): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }

### Community 141 - "usePhoneLayout.ts"
Cohesion: 0.60
Nodes (4): PHONE_QUERY, isPhone(), subscribe(), usePhoneLayout()

### Community 142 - "Scheduling engine improvement checklist"
Cohesion: 0.50
Nodes (3): Remaining stages, Scheduling engine improvement checklist, Stage 1

### Community 148 - "ProblemCounts"
Cohesion: 0.21
Nodes (10): GROUPS, Key(), ShortcutsModal(), ShortcutsModalProps, ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts() (+2 more)

### Community 150 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 155 - "SENIOR"
Cohesion: 0.06
Nodes (23): ScheduleValidator, check(), nurse, nurse2, schedule, check(), doctors, nurses (+15 more)

### Community 157 - "analysis-report.cjs"
Cohesion: 0.18
Nodes (7): args, assert, {chromium}, downloads, fs, os, path

### Community 163 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 165 - "ref_node_assert"
Cohesion: 0.06
Nodes (25): computeScheduleDiff(), MONTHS, suggestRosterName(), ctx(), EARLY, LATE, diff(), LATE (+17 more)

### Community 170 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 171 - "plain-english-reviewer.md"
Cohesion: 0.50
Nodes (3): Report, What to check, What to look at

## Knowledge Gaps
- **1109 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+1104 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1360 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ExportModal.tsx`, `AllRequestsPanel.tsx`, `dialogs.tsx`, `getRepository`, `RosterSteps.tsx`, `package.json`, `WorkbookGrid.tsx`, `ClinicContextState`, `usePhoneLayout.ts`, `analysisExportService.ts`, `DashboardView.tsx`, `NurseSample.tsx`, `ProblemCounts`, `ReportsView.tsx`, `PublishedRosterView.tsx`, `hoursBalance.ts`, `PlannerSample.tsx`, `ui.tsx`, `GridTable.tsx`, `SchedulesView.tsx`, `makeNurse`, `Assignment`, `16. History of work (for context)`, `4. What each phase did`, `RosterToolbar.tsx`, `nurseRosterService.ts`, `cx`, `PublishView.tsx`, `SwapManagerModal.tsx`, `harness/main.tsx`, `usePresence.ts`, `HistoryView.tsx`, `authService.ts`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ExportModal.tsx`, `AllRequestsPanel.tsx`, `dialogs.tsx`, `getRepository`, `RosterSteps.tsx`, `package.json`, `WorkbookGrid.tsx`, `ClinicContextState`, `DashboardView.tsx`, `analysisExportService.ts`, `NurseSample.tsx`, `ProblemCounts`, `ReportsView.tsx`, `PublishedRosterView.tsx`, `PlannerSample.tsx`, `ui.tsx`, `GridTable.tsx`, `SchedulesView.tsx`, `Assignment`, `16. History of work (for context)`, `RosterToolbar.tsx`, `nurseRosterService.ts`, `cx`, `PublishView.tsx`, `SwapManagerModal.tsx`, `harness/main.tsx`, `HistoryView.tsx`, `authService.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `AllRequestsPanel.tsx`, `dialogs.tsx`, `SchedulingEngine.ts`, `react`, `getRepository`, `RosterSteps.tsx`, `WorkbookGrid.tsx`, `ClinicContextState`, `usePhoneLayout.ts`, `FirestoreRepository`, `firebaseIdentityService.ts`, `ProblemCounts`, `ReportsView.tsx`, `PublishedRosterView.tsx`, `staffRequestService.ts`, `GridTable.tsx`, `SchedulesView.tsx`, `Assignment`, `EntityForCollection`, `resumePublish.ts`, `IRepository.ts`, `4. What each phase did`, `RosterToolbar.tsx`, `types/index.ts`, `leaveGuard.ts`, `nurseRosterService.ts`, `fixtures.ts`, `createApiApp`, `cx`, `IRepository`, `PublishView.tsx`, `doctorForm.ts`, `checkScheduler.test.ts`, `usePresence.ts`, `HistoryView.tsx`, `nurseForm.ts`, `nextPeriod.ts`, `dateDefaults.ts`, `authService.ts`, `colorContrast.ts`, `seedRunner.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Are the 127 inferred relationships involving `16. History of work (for context)` (e.g. with `preview()` and `getDocumentAs()`) actually correct?**
  _`16. History of work (for context)` has 127 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _1109 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExportModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06954997077732321 - nodes in this community are weakly interconnected._
- **Should `SchedulingEngine.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08698207464002351 - nodes in this community are weakly interconnected._