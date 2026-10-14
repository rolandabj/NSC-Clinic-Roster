# Graph Report - NSC-Clinic-Roster  (2026-10-14)

## Corpus Check
- 367 files · ~405,517 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 2741 nodes · 8858 edges · 137 communities (124 shown, 13 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 391 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9dab8b9e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Assignment
- emailService.ts
- hoursBalance.ts
- clinicModel.test.ts
- authService
- holidayLeave.ts
- react
- FairnessModal.tsx
- ui-audit.cjs
- package.json
- ProblemsPanel.tsx
- dependencies
- Test-Driven Development
- geminiApi.test.ts
- IRepository
- CollectionSyncer
- gridSelection.ts
- wholeDates
- firebaseIdentityService.ts
- NurseSample.tsx
- compilerOptions
- yearToDate.ts
- lucide-react
- apiApp.ts
- devDependencies
- RosterToolbar.tsx
- quick reference
- decisionEmail.test.ts
- scripts
- SchedulingEngine.ts
- PlannerSample.tsx
- ui.tsx
- Hardening Controls
- useDialogA11y
- MemoryRepo
- Code Review and Quality
- What You Must Do When Invoked
- dayView.ts
- NurseSelfServicePanel.tsx
- hoursAccounting.ts
- Optimization Patterns
- cellView.ts
- checkScheduler.test.ts
- rules.test.mjs
- Frontend UI Engineering
- FirestoreRepository
- engineRules.test.ts
- firestore-rules/package.json
- AvailabilityView.tsx
- explainCell.ts
- UI overhaul: checklist
- Debugging and Error Recovery
- graphify reference: extra exports and benchmark
- AppShell.tsx
- Incremental Implementation
- sharing.test.ts
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
- PublishModal.tsx
- NSC Clinic Roster: UI review and overhaul in phases
- Source-Driven Development
- data.ts
- published-rules.mjs
- NursesView.tsx
- Rules
- Design system: NSC Clinic Roster
- README.md
- MyRosterView.tsx
- teamRoster.test.ts
- weekHours.test.ts
- ExportModal.tsx
- links.cjs
- nurseRoster.test.ts
- types/index.ts
- ref_node_assert
- VersionCompareModal.tsx
- ref_playwright
- UI overhaul: summary and next steps
- createApiApp
- Button
- DashboardView.tsx
- Phases
- harness/main.tsx
- Handover for a new chat
- nurseRosterService.ts
- Finish a change
- Rules
- handMoves.test.ts
- SchedulesView.tsx
- context7
- DoctorsView.tsx
- firestore-rules-reviewer.md
- hoursRules.test.ts
- firebase-mcp.sh
- nurseClinicFloat.test.ts
- start.sh
- stop.sh
- Rules
- grid-flow.cjs
- LiveCollectionCache
- WorkbookGrid.tsx
- authorizedFetch
- seedRunner.ts
- RosterGrid
- lastResort.test.ts
- nurseForm.ts
- quotaTracker
- createLiveReconciler
- preferenceFocus.test.ts
- NSC Clinic Roster: complete project guide
- 16. History of work (for context)
- WhoCanCover.tsx
- RulesTab.tsx
- doctorWeekChange.test.ts
- savingSafety.test.ts
- newRosterDates.ts
- rowsInSteps.ts
- grid-timing.cjs
- GridTable.tsx
- fakeAuth.ts
- icsExportService.ts
- my-requests.cjs
- nurse-editor.cjs
- ui/index.ts
- sheet-tabs.cjs
- PublishModal
- toolbar.cjs

## God Nodes (most connected - your core abstractions)
1. `react` - 117 edges
2. `Assignment` - 113 edges
3. `Nurse` - 98 edges
4. `getRepository()` - 95 edges
5. `16. History of work (for context)` - 94 edges
6. `Schedule` - 92 edges
7. `lucide-react` - 89 edges
8. `DutyWindow` - 89 edges
9. `Doctor` - 78 edges
10. `formatDate()` - 76 edges

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

## Communities (137 total, 13 thin omitted)

### Community 0 - "Assignment"
Cohesion: 0.16
Nodes (59): 5. Data model (Firestore collections), BulkImportModalProps, EditDoctorShiftModalProps, ExportModalProps, FairnessModalProps, PublishModalProps, SwapManagerModalProps, TemplateModalProps (+51 more)

### Community 1 - "emailService.ts"
Cohesion: 0.21
Nodes (11): nodemailer, emailFailureMessage(), EmailReadiness, EmailService, pickRequestOverrides(), REQUEST_OVERRIDE_KEYS, SendEmailPayload, ServerEmailConfig (+3 more)

### Community 2 - "hoursBalance.ts"
Cohesion: 0.07
Nodes (47): askedCarry(), closePeriod(), countedEarlierRosters(), earlierPeriodTotals(), hoursCheckpoints(), hoursHistoryOverlaps(), HoursSchedule, Leftover (+39 more)

### Community 3 - "clinicModel.test.ts"
Cohesion: 0.09
Nodes (20): D, DOCTORS, DR_X, DUTIES, E, freeNurse, generate(), HOURS (+12 more)

### Community 4 - "authService"
Cohesion: 0.10
Nodes (8): authService, computePrivileges(), FirebaseConfig, getAppAuth(), getAppFirestore(), getFirebaseApp(), googleAuthProvider, QuotaListener

### Community 5 - "holidayLeave.ts"
Cohesion: 0.33
Nodes (10): 10. Hours, applyHolidayChangeToLeave(), DatedLeave, datesOf(), HolidayLeaveTidy, isOldHolidayLeave(), leaveAfterHolidayChange(), planHolidayLeaveTidy() (+2 more)

### Community 6 - "react"
Cohesion: 0.09
Nodes (65): react, useAppContext(), confirmDialog(), ConfirmOptions, DialogState, dismissNotice(), listeners, Notice (+57 more)

### Community 7 - "FairnessModal.tsx"
Cohesion: 0.14
Nodes (22): Other engine files, NONE, NurseFairnessMetrics, ProposedSwap, NONE, listProblem(), checkSwap(), isPinnedShift() (+14 more)

### Community 8 - "ui-audit.cjs"
Cohesion: 0.15
Nodes (6): { chromium }, DEFAULT_PAGES, { execSync }, fs, os, path

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): firebase, name, private, type, version, autoprefixer, cors, date-fns (+14 more)

### Community 10 - "ProblemsPanel.tsx"
Cohesion: 0.24
Nodes (8): ROSTER_SHEET_PANEL_ID, RosterSheet, RosterSheetTabs(), ProblemCounts(), Tabs(), ProblemsPanelProps, SEVERITY, render()

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, cors, date-fns, dotenv, express, express-rate-limit, firebase, @google/genai (+14 more)

### Community 12 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 13 - "geminiApi.test.ts"
Cohesion: 0.25
Nodes (9): @google/genai, geminiRouter, GEMINI_MODEL, generateContentWithGemini(), GenerateOptions, generateRosterInsights(), getGeminiClient(), isGeminiKeyConfigured() (+1 more)

### Community 14 - "IRepository"
Cohesion: 0.10
Nodes (17): BACKUPS_KEPT, saveRosterBackup(), restoreVersion(), VersionRestoreResult, removePublicRoster(), fingerprint(), syncScheduleAssignments(), repositoryManager (+9 more)

### Community 15 - "CollectionSyncer"
Cohesion: 0.17
Nodes (3): saveHolidayLeave(), CollectionSyncer, EntityForCollection

### Community 16 - "gridSelection.ts"
Cohesion: 0.11
Nodes (22): CELL_FLASH, CELL_POPUP, CELL_SELECTED, CELL_TAB_STOP, CellRef, createGridSelection(), GridSelectionState, HOURS_COLUMN (+14 more)

### Community 17 - "wholeDates"
Cohesion: 0.33
Nodes (4): react-dom, ConfirmBox(), DialogHost(), wholeDates()

### Community 18 - "firebaseIdentityService.ts"
Cohesion: 0.13
Nodes (22): jose, AuthUser, AccessRecordFields, cacheKey(), fetchAccessRecord(), fetchStaffEmails(), FirebaseProjectConfig, getFirebaseProjectConfig() (+14 more)

### Community 19 - "NurseSample.tsx"
Cohesion: 0.16
Nodes (14): dayLabel(), DAYS, ddmmyyyy(), ROSTER, SHIFTS, weekdayOf(), FONTS, renderSample() (+6 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 21 - "yearToDate.ts"
Cohesion: 0.24
Nodes (13): isLateDuty(), clearYearToDateCache(), computeYearToDate(), earlierRostersThisYear(), emptyCounts(), latestPublishedVersion(), loadEarlierRosters(), LoadedRoster (+5 more)

### Community 22 - "lucide-react"
Cohesion: 0.15
Nodes (13): lucide-react, App(), AppShell, cachedClinicName(), MyRosterView, parsePublicLink(), PublishedRosterView, LoginPage() (+5 more)

### Community 23 - "apiApp.ts"
Cohesion: 0.17
Nodes (13): express, express-rate-limit, helmet, authMiddleware(), BackendRole, Express, requireOwner, requirePlanner (+5 more)

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, esbuild, tailwindcss, @types/cors, @types/express, @types/node, @types/nodemailer (+4 more)

### Community 25 - "RosterToolbar.tsx"
Cohesion: 0.12
Nodes (18): MenuButton(), MenuButtonProps, MenuItem, MenuSection, menuSections(), moreMenuItems(), RosterMenuItem, RosterToolbar() (+10 more)

### Community 26 - "quick reference"
Cohesion: 0.12
Nodes (16): 1. accessible names (critical), 2. keyboard access (critical), 3. focus and dialogs (critical), 4. semantics (high), 5. forms and errors (high), 6. announcements (medium-high), 7. contrast and states (medium), 8. media and motion (low-medium) (+8 more)

### Community 27 - "decisionEmail.test.ts"
Cohesion: 0.12
Nodes (19): COLLECTION, createRequestsRouter(), defaultDeps, RequestNotifyDeps, requestsRouter, isGoogleAccountEmail(), SendEmailResult, DecidedRequest (+11 more)

### Community 28 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 29 - "SchedulingEngine.ts"
Cohesion: 0.08
Nodes (58): 6. Clinic model (the business rules in plain English), bloodCollectionRole(), canBeFreeNurse(), ClinicSetup, coveredMinutes(), DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, doctorSessionsOn() (+50 more)

### Community 30 - "PlannerSample.tsx"
Cohesion: 0.17
Nodes (31): countOf(), Brand(), datesOf(), DayView(), Drawer(), HoursTable(), LeaveForm(), NAV (+23 more)

### Community 31 - "ui.tsx"
Cohesion: 0.14
Nodes (14): DateInput(), FieldProps, inputClass, parseDayMonthYear(), PROBLEM, showDate(), Size, SIZES (+6 more)

### Community 32 - "Hardening Controls"
Cohesion: 0.05
Nodes (42): Broken Access Control, Broken Authentication, Cross-Site Scripting (XSS), Data Classification, Dependency Audit Triage, Destructive Operations on Derived Paths, File Upload Safety, Hardening Patterns (+34 more)

### Community 33 - "useDialogA11y"
Cohesion: 0.15
Nodes (19): openStack, useDialogA11y(), DeleteScheduleModal(), DeleteScheduleModalProps, DeleteVersionModal(), DeleteVersionModalProps, ShortcutItem, SHORTCUTS (+11 more)

### Community 34 - "MemoryRepo"
Cohesion: 0.14
Nodes (9): clone(), FirestoreRepository, Listener, MemoryRepo, repo, repositoryManager, november, seed (+1 more)

### Community 35 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "dayView.ts"
Cohesion: 0.15
Nodes (15): DayProblem, DayRow, dayViewOf(), isPhoneSize(), KIND, ORDER, cellSummary(), isDayProblem() (+7 more)

### Community 38 - "NurseSelfServicePanel.tsx"
Cohesion: 0.19
Nodes (19): NurseSelfServicePanel(), STATUS, useFocusFirstError(), checkDayRequest(), checkLeaveRequest(), dayStatus(), Errors, leaveStatus() (+11 more)

### Community 39 - "hoursAccounting.ts"
Cohesion: 0.17
Nodes (22): usePermissions(), fmtHours(), NurseTimesheetModal(), NurseTimesheetModalProps, SOURCE_LABELS, STATUS_LABELS, ReportsView(), SortField (+14 more)

### Community 40 - "Optimization Patterns"
Cohesion: 0.07
Nodes (25): Connection Pool Exhaustion, Large Bundle Size, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Optimization Patterns, Queries That Ignore Their Index, Unbounded Data Fetching (+17 more)

### Community 41 - "cellView.ts"
Cohesion: 0.12
Nodes (23): CellDay, cellLookupsOf(), cellViewOf(), fmtHours(), reuseCellViews(), sameView(), shortDoctorNames(), SOURCE_SPOKEN (+15 more)

### Community 42 - "checkScheduler.test.ts"
Cohesion: 0.18
Nodes (9): Steps, 9. Checking a roster (`src/services/validation/ScheduleValidator.ts`), useRosterChecks(), afterNextFrame(), CheckScheduler, createCheckScheduler(), planner(), history() (+1 more)

### Community 43 - "rules.test.mjs"
Cohesion: 0.17
Nodes (8): anon, editor, manager, owner, results, stranger, unverified, viewer

### Community 44 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (24): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+16 more)

### Community 46 - "engineRules.test.ts"
Cohesion: 0.18
Nodes (5): fill(), JUNIOR, LEVELS, NC, PHL

### Community 47 - "firestore-rules/package.json"
Cohesion: 0.14
Nodes (13): @firebase/rules-unit-testing, firebase-tools, description, devDependencies, firebase, @firebase/rules-unit-testing, firebase-tools, firebase (+5 more)

### Community 48 - "AvailabilityView.tsx"
Cohesion: 0.11
Nodes (37): 13. Screens in detail, NoticeTone, EditDoctorShiftModal(), AllRequestsPanel(), Draft, KindFilter, STATUS_LABEL, STATUS_STYLE (+29 more)

### Community 49 - "explainCell.ts"
Cohesion: 0.15
Nodes (23): 7. Rules, CellEditorDialog(), withDr(), WorkbookGridView(), checkAssignment(), hardRule(), shiftDate(), BlockedShift (+15 more)

### Community 50 - "UI overhaul: checklist"
Cohesion: 0.18
Nodes (10): Phase 0: setup, Phase 1: quick fixes and safety, Phase 2: design system and app shell, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, request decision emails, Phase 6: planner screens, Phase 7: publishing, History and dialogs, Phase 8: Settings, Reports, Audit (+2 more)

### Community 51 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 53 - "AppShell.tsx"
Cohesion: 0.06
Nodes (67): 3. Users, roles and access, 4. Navigation and app shell, LoginPageProps, AppContext, AppContextValue, signOutSafely(), AppShell(), bootstrap() (+59 more)

### Community 54 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 55 - "sharing.test.ts"
Cohesion: 0.20
Nodes (7): DR_PCC, DR_PEDS, FULL, NINE_SEVEN, PCC, PEDS, RULES

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

### Community 65 - "approvedDayOff.test.ts"
Cohesion: 0.22
Nodes (7): DR, FULL, NINE_SEVEN, ORTHO, roland(), RULES, run()

### Community 66 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 67 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 68 - "PublishModal.tsx"
Cohesion: 0.11
Nodes (27): uuid, Request, Step, ShareModalProps, TabType, PublishedRosterViewProps, PublishTab, EMAIL_LOG_HTML_BUDGET (+19 more)

### Community 69 - "NSC Clinic Roster: UI review and overhaul in phases"
Cohesion: 0.15
Nodes (12): Backend summary, Baseline, 07-10-2026 (before any phase), Checkpoint 2, 08-10-2026 (after Phase 2), Checkpoint 3, 13-10-2026 (after Phase 3), Context, How every phase is done, Not in this plan, NSC Clinic Roster: UI review and overhaul in phases (+4 more)

### Community 70 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 71 - "data.ts"
Cohesion: 0.15
Nodes (14): Cell, DOCTORS, LEAVE, Nurse, NURSES, parse(), Problem, PROBLEMS (+6 more)

### Community 72 - "published-rules.mjs"
Cohesion: 0.06
Nodes (26): command, currentBranch(), pushesMain(), { tool_input: toolInput = {}, cwd = process.cwd() }, command, files, others, { tool_input: toolInput = {}, cwd = process.cwd() } (+18 more)

### Community 73 - "NursesView.tsx"
Cohesion: 0.14
Nodes (23): Badge(), PageHeader(), cx(), Checkbox(), DateInput(), Field(), Input(), InputProps (+15 more)

### Community 74 - "Rules"
Cohesion: 0.12
Nodes (15): 1. Answer first, 2. Kill ceremony, 3. Short word, 4. Articles optional, meaning never, 5. One idea per sentence, 6. Payload verbatim, 7. Tool runs: bounded status, 8. User's language (+7 more)

### Community 75 - "Design system: NSC Clinic Roster"
Cohesion: 0.14
Nodes (18): Checklist before a screen is delivered, Colours, Dates and times, Design system: NSC Clinic Roster, Do not, Nurse pages (phones first), Parts (in `src/components/ui/`, shown together on the test page's `?view=gallery`; first drafts in `.claude/skills/browser-check/harness/sample/`), Roster marks (+10 more)

### Community 77 - "MyRosterView.tsx"
Cohesion: 0.18
Nodes (15): LoadState, MyRosterView(), MyRosterViewProps, PublishedRosterView(), loadPublishedRoster(), downloadIcsFile(), MyDay, myShiftDays() (+7 more)

### Community 78 - "teamRoster.test.ts"
Cohesion: 0.20
Nodes (13): 12. Publishing and nurse links, dateLabel(), PublishedRosterSheet(), addDaysIso(), buildTeamRosterSheet(), syncNurseRosters(), weekdayOf(), safeColor() (+5 more)

### Community 79 - "weekHours.test.ts"
Cohesion: 0.17
Nodes (10): addDays(), fitsWeekHours(), heaviestWeekAround(), over(), WEEK_HOURS_RULE, WeekHours, weekHoursSetting, weeksOverLimit() (+2 more)

### Community 80 - "ExportModal.tsx"
Cohesion: 0.10
Nodes (39): xlsx, ExportModal(), ExportTab, fmtHours(), WEEKDAY_NAMES, daysBefore(), loadClinicSetup(), isFloatShift() (+31 more)

### Community 81 - "links.cjs"
Cohesion: 0.22
Nodes (4): assert, base, checks, { chromium }

### Community 82 - "nurseRoster.test.ts"
Cohesion: 0.14
Nodes (15): buildNurseIcs(), buildNurseRosterIcs(), escapeIcsText(), foldLine(), formatIcsDate(), nextDayCompact(), nurseShiftUid(), shortHash() (+7 more)

### Community 83 - "types/index.ts"
Cohesion: 0.10
Nodes (21): CellChoice, BuildNurseRosterInput, ApprovalStatus, AssignmentKind, AuditEvent, DoctorSessionSource, EmailLogKind, EmailLogStatus (+13 more)

### Community 84 - "ref_node_assert"
Cohesion: 0.04
Nodes (64): 15. Tests, ANALYSIS_FORMAT, CARD, input(), KHAN, LATE, SCHEDULE, SESSIONS (+56 more)

### Community 85 - "VersionCompareModal.tsx"
Cohesion: 0.28
Nodes (7): CHANGE_LABELS, AssignmentDiffItem, ChangeType, formatAssignment(), FormattedAssignmentState, ScheduleVersionDiff, WEEKDAY_NAMES

### Community 86 - "ref_playwright"
Cohesion: 0.13
Nodes (9): { chromium }, args, { chromium }, args, { chromium }, args, { chromium }, args (+1 more)

### Community 87 - "UI overhaul: summary and next steps"
Cohesion: 0.10
Nodes (20): 1. Where things stand, 2. Why this work, 3. What the review found, and where each part stands, 4. What has been done, 5. Numbers, 6. How the work is done, 7. Next steps, 8. Where to find things (+12 more)

### Community 88 - "createApiApp"
Cohesion: 0.20
Nodes (9): repoRoot, swaps, @tailwindcss/vite, vite, @vitejs/plugin-react, createApiApp(), startServer(), requireAuth() (+1 more)

### Community 89 - "Button"
Cohesion: 0.26
Nodes (9): PublicMessage(), PublicPageFrame(), Button(), EmptyState(), ErrorState(), LoadingState(), AcknowledgePage(), AcknowledgePageProps (+1 more)

### Community 90 - "DashboardView.tsx"
Cohesion: 0.19
Nodes (20): Card(), DashboardView(), loadPlannerData(), loadViewerData(), PlannerData, readStoredId(), TodayList(), ViewerData (+12 more)

### Community 91 - "Phases"
Cohesion: 0.22
Nodes (9): Phase 0: setup (right after approval), Phase 1: quick fixes and safety, Phase 4: roster screen layout, words and accessibility, Phase 5: nurse screens for phones, and request decision emails, Phase 6: Nurses, Doctors, Availability and Requests (planner screens), Phase 7: publishing, History and all dialogs, Phase 8: Settings, Reports, Audit, Phase 9: tidy up and final audit (+1 more)

### Community 92 - "harness/main.tsx"
Cohesion: 0.09
Nodes (9): Gallery(), Request, REQUESTS, STATUS_TONE, context, publishNovember(), Single(), start() (+1 more)

### Community 93 - "Handover for a new chat"
Cohesion: 0.25
Nodes (7): 1. Where things stand, 2. How the owner likes to work, 3. Every commit, 4. What Phases 4 and 5 did (guide items 59 to 72), 5. What comes next, 6. Points to know, Handover for a new chat

### Community 94 - "nurseRosterService.ts"
Cohesion: 0.22
Nodes (13): dayMonth(), ensureNurseLink(), formatRosterAsText(), newToken(), NURSE_ROSTER_LOOKBACK_DAYS, regenerateNurseLink(), RegenerateNurseLinkResult, removeNurseRoster() (+5 more)

### Community 95 - "Finish a change"
Cohesion: 0.20
Nodes (9): 1. Verify, 2. Clean up, 3. Update PROJECT_GUIDE.md, 4. Refresh the code graph, 5. Commit, 6. Push the working branch, 7. Main: only after the owner says "push to main", 8. Report (+1 more)

### Community 96 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Classical register, 2. Particles carry structure, 3. Each fact once, 4. Payload in original script, 5. Tool runs, 6. Never perform, Floor, megacave (+4 more)

### Community 97 - "handMoves.test.ts"
Cohesion: 0.12
Nodes (13): AGREED_EXCEPTION_NOTE, AMY, BEA, CARA, DAN, DOCTORS, DUTIES, EARLY (+5 more)

### Community 98 - "SchedulesView.tsx"
Cohesion: 0.07
Nodes (48): Report, What to check, What to look at, useLatestCallback(), FairnessModal(), SwapManagerModal(), PHONE_QUERY, FillDialog() (+40 more)

### Community 99 - "context7"
Cohesion: 0.33
Nodes (5): bash, npx, context7, firebase, @upstash/context7-mcp

### Community 100 - "DoctorsView.tsx"
Cohesion: 0.15
Nodes (23): BulkImportModal(), CreateScheduleModal(), CreateScheduleModalProps, DoctorWeekChangeDialog(), DoctorWeekChangeDialogProps, WeekChangePreview, TIME_PRESETS, DoctorsView() (+15 more)

### Community 101 - "firestore-rules-reviewer.md"
Cohesion: 0.40
Nodes (4): Check, Read first, Report, Test

### Community 102 - "hoursRules.test.ts"
Cohesion: 0.08
Nodes (17): SchedulingEngine, D, E, L, NC, PHL, SENIOR, week (+9 more)

### Community 104 - "nurseClinicFloat.test.ts"
Cohesion: 0.20
Nodes (8): FLOAT_ROLE_ID, CARD, EARLY, FULL, LATE, NC, NINE_SEVEN, run()

### Community 107 - "Rules"
Cohesion: 0.15
Nodes (12): 1. Fragments, 2. One word when one word is enough, 3. Each fact once, 4. Cut conjunctions only when order survives, 5. Tool runs, 6. Never perform, Floor, Persistence (+4 more)

### Community 109 - "LiveCollectionCache"
Cohesion: 0.19
Nodes (6): CacheEntry, ListFilter, LiveCollectionCache, entry, matchesFilter(), UNCACHED_COLLECTIONS

### Community 110 - "WorkbookGrid.tsx"
Cohesion: 0.12
Nodes (21): CellContextMenu(), GRID_KEY_ID, GridLegend(), GridToolbar(), GridToolbarProps, GridZoom, findCell(), QuickCellPopup() (+13 more)

### Community 111 - "authorizedFetch"
Cohesion: 0.31
Nodes (8): authorizedFetch(), fetchRosterInsights(), GeminiGenerateResponse, GeminiInsightsResponse, GeminiStatus, generateWithGemini(), getGeminiStatus(), RosterInsightsPayload

### Community 112 - "seedRunner.ts"
Cohesion: 0.11
Nodes (29): FirebaseClientConfig, SubscribeCallback, Unsubscribe, assertScheduleRangeAvailable(), assertValidDates(), findRangeConflict(), findScheduleOverlaps(), holdsDates() (+21 more)

### Community 113 - "RosterGrid"
Cohesion: 0.25
Nodes (9): dayProblems(), problemAt(), tint(), clamp(), describe(), GridCell(), HoursCell(), Legend() (+1 more)

### Community 114 - "lastResort.test.ts"
Cohesion: 0.22
Nodes (6): LAST_RESORT_NOTE, DR_PEDS, ENT, FULL, PEDS, RULES

### Community 115 - "nurseForm.ts"
Cohesion: 0.32
Nodes (5): checkNurseForm(), movePreference(), NurseFormErrors, NurseFormValues, others

### Community 116 - "quotaTracker"
Cohesion: 0.21
Nodes (3): nextQuotaResetMs(), QuotaExceededError, quotaTracker

### Community 117 - "createLiveReconciler"
Cohesion: 0.39
Nodes (3): createLiveReconciler(), LiveReconcileOptions, LiveSaveQueue

### Community 118 - "preferenceFocus.test.ts"
Cohesion: 0.25
Nodes (6): CARD, KHAN, LATE, LEE, ORTHO, SESSIONS

### Community 119 - "NSC Clinic Roster: complete project guide"
Cohesion: 0.09
Nodes (19): 0. Quick start for a new chat, 14. Server, security and config, 17. Known quirks and ideas for later, 1. Features at a glance, 2. Repository layout, 8. The roster engine (`src/services/engine/SchedulingEngine.ts`), Entry points, How a run works (+11 more)

### Community 120 - "16. History of work (for context)"
Cohesion: 0.24
Nodes (15): 16. History of work (for context), firstDayShown(), RosterDayView(), ProblemBadge(), Notice(), dayTotalsOf(), addDays(), DateRange (+7 more)

### Community 121 - "WhoCanCover.tsx"
Cohesion: 0.48
Nodes (6): fmt(), hoursText(), WhoCanCover(), WhoCanCoverProps, explainDay(), NurseDayExplanation

### Community 122 - "RulesTab.tsx"
Cohesion: 0.13
Nodes (22): ALWAYS_ON, effectiveValue(), findRule(), GROUPS, KNOWN_KEYS, NumberField, RuleDef, RuleGroup (+14 more)

### Community 123 - "doctorWeekChange.test.ts"
Cohesion: 0.33
Nodes (6): LEE, MONDAY_SESSIONS, MONDAYS, ROSTERS, session(), TUESDAYS

### Community 124 - "savingSafety.test.ts"
Cohesion: 0.08
Nodes (22): 11. Saving, live updates, versions, useRosterEdits(), forgetCachedRoster(), Desired, fingerprint(), Known, planSync(), SyncPlan (+14 more)

### Community 125 - "newRosterDates.ts"
Cohesion: 0.73
Nodes (4): addDays(), iso(), monthEnd(), suggestNewRosterDates()

### Community 126 - "rowsInSteps.ts"
Cohesion: 0.70
Nodes (3): nextRowLimit(), ROW_STEP, useRowsInSteps()

### Community 127 - "grid-timing.cjs"
Cohesion: 0.50
Nodes (3): { chromium }, median(), once()

### Community 128 - "GridTable.tsx"
Cohesion: 0.11
Nodes (27): CellView, DayTotal, dayTotalWords(), problemWords(), FOCUS_CELL, GridCell, GridCellActions, GridCellProps (+19 more)

### Community 129 - "fakeAuth.ts"
Cohesion: 0.22
Nodes (5): AuthService, MASTER_ADMIN_EMAIL, PEOPLE, Browser check, Things that went wrong before

### Community 130 - "icsExportService.ts"
Cohesion: 0.50
Nodes (3): RFC-5545, NurseRosterIcsInput, utf8

### Community 131 - "my-requests.cjs"
Cohesion: 0.29
Nodes (5): args, { chromium }, args, { chromium }, t()

### Community 133 - "ui/index.ts"
Cohesion: 0.11
Nodes (29): PROBLEM_MARKS, ProblemKind, Tone, TONE_CLASSES, ButtonProps, ButtonSize, ButtonVariant, IconButton() (+21 more)

### Community 135 - "PublishModal"
Cohesion: 0.20
Nodes (13): EmailHtmlPreview(), PublishModal(), PublishView(), checkEmailReadiness(), EmailReadiness, readEmailResponse(), nurseLinkUrl(), cache() (+5 more)

## Knowledge Gaps
- **938 isolated node(s):** `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `files` (+933 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1145 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Assignment`, `GridTable.tsx`, `ui/index.ts`, `FairnessModal.tsx`, `package.json`, `ProblemsPanel.tsx`, `gridSelection.ts`, `wholeDates`, `NurseSample.tsx`, `lucide-react`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `useDialogA11y`, `NurseSelfServicePanel.tsx`, `hoursAccounting.ts`, `AvailabilityView.tsx`, `AppShell.tsx`, `PublishModal.tsx`, `NursesView.tsx`, `MyRosterView.tsx`, `teamRoster.test.ts`, `ExportModal.tsx`, `types/index.ts`, `ref_node_assert`, `VersionCompareModal.tsx`, `Button`, `DashboardView.tsx`, `harness/main.tsx`, `SchedulesView.tsx`, `DoctorsView.tsx`, `WorkbookGrid.tsx`, `NSC Clinic Roster: complete project guide`, `16. History of work (for context)`, `WhoCanCover.tsx`, `RulesTab.tsx`, `rowsInSteps.ts`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `Assignment`, `GridTable.tsx`, `ui/index.ts`, `react`, `FairnessModal.tsx`, `package.json`, `ProblemsPanel.tsx`, `NurseSample.tsx`, `RosterToolbar.tsx`, `PlannerSample.tsx`, `ui.tsx`, `useDialogA11y`, `NurseSelfServicePanel.tsx`, `hoursAccounting.ts`, `AvailabilityView.tsx`, `AppShell.tsx`, `PublishModal.tsx`, `NursesView.tsx`, `MyRosterView.tsx`, `teamRoster.test.ts`, `ExportModal.tsx`, `types/index.ts`, `VersionCompareModal.tsx`, `Button`, `DashboardView.tsx`, `harness/main.tsx`, `SchedulesView.tsx`, `DoctorsView.tsx`, `WorkbookGrid.tsx`, `16. History of work (for context)`, `RulesTab.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `16. History of work (for context)` connect `16. History of work (for context)` to `Assignment`, `GridTable.tsx`, `ui/index.ts`, `react`, `ProblemsPanel.tsx`, `IRepository`, `gridSelection.ts`, `wholeDates`, `firebaseIdentityService.ts`, `RosterToolbar.tsx`, `SchedulingEngine.ts`, `useDialogA11y`, `dayView.ts`, `NurseSelfServicePanel.tsx`, `hoursAccounting.ts`, `cellView.ts`, `checkScheduler.test.ts`, `FirestoreRepository`, `AvailabilityView.tsx`, `explainCell.ts`, `AppShell.tsx`, `NursesView.tsx`, `Design system: NSC Clinic Roster`, `MyRosterView.tsx`, `types/index.ts`, `Button`, `SchedulesView.tsx`, `WorkbookGrid.tsx`, `RosterGrid`, `nurseForm.ts`, `NSC Clinic Roster: complete project guide`, `savingSafety.test.ts`, `rowsInSteps.ts`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Are the 93 inferred relationships involving `16. History of work (for context)` (e.g. with `GridCell()` and `getDocumentAs()`) actually correct?**
  _`16. History of work (for context)` has 93 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ tool_input: toolInput = {}, cwd = process.cwd() }`, `command`, `{ tool_input: toolInput = {}, cwd = process.cwd() }` to the rest of the system?**
  _938 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `hoursBalance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06561085972850679 - nodes in this community are weakly interconnected._
- **Should `clinicModel.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._