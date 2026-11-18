# Scheduling engine improvement plan

Approved for implementation on 15-11-2026. Each stage ends with checks and owner review before the next stage. Main changes only after separate approval. The earlier UI plan and checklist remain unchanged.

## Agreed policy

* Minimize total missing doctor minutes before preferences and hours balance. A smaller gap may move elsewhere for a net improvement.
* Search all selected dates for up to two minutes. Keep pins, protected manual duties, approved availability and configured hard limits.
* Keep the existing maximum hours rule and its on/off and Must/Try to settings. Add no hours goal rule.
* Prefer one nurse for an entire session. Allow sequential cover of any two eligible doctors, regardless of acuity. Existing duty options may extend the nurse's paid duty within the limits.
* Concurrent cover of two doctors requires both doctors to be low acuity, eligibility for both and no suitable Float cover during the relevant hours. Use partial Float cover and share only the remaining hours.
* Automatic filling must not create two nurses with one doctor simultaneously. Saving a manual edit may create an intentional overlap, without a required reason. Show a Check and record the manual action.
* One senior duty per date is sufficient. Do not add continuous senior cover.
* Save the final validated candidate automatically, with backup and undo. Never save private intermediate search states. Cancel saves nothing. Remaining doctor gaps still prevent publication.

## Stage 1: coverage correctness

Unify availability and eligibility for generation, validation, repair and reports. Approved days off apply without pins. Missing or inactive nurse profiles cannot provide cover. Critical availability reads must succeed. Recheck publication inputs, including availability and surrounding rosters. Read fixed neighbouring duties on both sides for rest, duty runs and rolling hours; never move them.

Acceptance: confirmed bug cases fail before their fixes, then pass. Coverage counts agree with publication and analysis. Existing clinical permission and legacy exception policies remain consistent. No timed cover fields or stronger search are introduced in this stage.

## Stage 2: timed cover foundation

Add optional doctor coverage intervals to assignments and pins while retaining legacy reads. Paid hours come from the duty once. One shared exact interval calculation must feed all views, coverage checks and exports. Reject invalid and stale interval data rather than widening it silently. All consumers must understand intervals before timed writes are enabled.

## Stage 3: sequential cover and manual editing

Support exact handovers, sequential eligible doctors, partial Float relief and permitted duty extensions. Distinguish sequential cover from concurrent sharing in names, badges, notes and exports. Automatically record exact manual overlap provenance when a planner saves an edit; automatic saves must not create manual provenance. Timing changes affect history, allocation review signatures and change alerts.

## Stage 4: stronger search

Use a common comparison: hard feasibility and required Nurse Clinic cover, missing doctor minutes, concurrent sharing minutes, handovers, hours balance, preferences/fairness and unnecessary changes. Construct a compliant starting roster. Search wider exchanges in a worker with progress and cancellation, retaining 24 candidate states and limiting an exchange to six changed duties initially. Reserve the last ten seconds for validation and return within the two minute search budget. Verify inputs again before the final save. A limited search must never claim the remaining shortage is proved unavoidable.

Completed on 18-11-2026. The same clinic replay improves from Stage 3 at 31 missing doctor hours to 28 hours, with no Nurse Clinic gaps and all 13 nurses at 210 hours. The result has nine publication blockers: five doctor gaps and four unreviewed pairing exceptions. Fewer missing minutes do not imply fewer separate problems. The stronger search, private worker, cancellation, server freshness checks and final save are implemented. Stage 5 remains a separate checkpoint.

## Stage 5: clinic verification and rollout

Compare candidates under the same rules. The original plan baseline had 38 missing doctor hours, Stage 3 reached 31 and the Stage 4 replay reaches 28. Nurse Clinic gaps remain zero and all 13 nurses remain at 210 hours. The older 28 hour replay used different sharing rules and is not an equivalent target. Test small scenarios with independent expected answers, the clinic replay, cancellation, changed inputs, failed saves, backup, undo, save/reload and all communications. Update the guide and graph with each stage. Deploy interval readers and writers together and require planners to reload before editing timed records.

Engineering verification completed on 18-11-2026: 1018 unit tests and 225 browser checks pass, alongside type, lint, build, email and emulator checks. Fresh generation leaves 25 missing doctor hours. Empty only on the checked Stage 4 roster leaves 21 hours while preserving every paid shift and 210 hours per nurse. Both retain zero Nurse Clinic gaps. Neither test result is ready for publication. Planner reload, review and actual roster publication remain the clinic actions in `tasks/scheduler-rollout.md`.
