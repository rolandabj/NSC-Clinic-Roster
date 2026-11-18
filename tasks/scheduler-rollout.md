# Scheduling improvements: rollout and clinic review

Stage 5 was approved on 18-11-2026. This document separates engineering checks from actions that need the clinic planner.

## Engineering checks

The same application build contains timed coverage readers, manual and automatic writers, the private worker, exact reports and publication checks. There is no separate interval migration or new hours goal rule. Older shifts without saved doctor times cover only the time when the clinic and paid shift overlap.

Verification includes independent small clinic answers, minute by minute safety checks, the reconstructed clinic report, exact database save and reload, cancellation, stale inputs, failed writes, backups, Undo and Retry. Actual worker output is checked through nurse and public pages, email construction, calendars, analysis, CSV, Excel and PDF. Email tests do not send messages and database tests use a local demo emulator.

An interrupted save may have committed some records before reporting failure. Retry and Undo must reconcile only the records this browser read or attempted to write. Unrelated records added by another planner must remain. Use Retry now or Undo to resolve a failed save.

## Planner actions after deployment

1. Wait for the host to deploy the checked main commit. Close all old planner tabs and reopen the app before editing timed shifts. Every planner needs to do this, including anyone whose roster screen was already open. An open tab still uses the old app until it reloads.
2. Open the intended draft. Keep its backup and use the fill options that match the intended changes. Empty only keeps existing paid dates and shift lengths, while available Float time inside those shifts may cover doctors.
3. Review Problems, Doctors, Coverage by hour and Hours together. Confirm both doctor names and exact times on every duty with two doctors. Simultaneous sharing requires two low acuity doctors and no eligible Float relief for those hours.
4. Arrange eligible cover for each remaining doctor gap, or correct a clinic time only when the saved time is wrong. A limited search does not prove a gap is unavoidable. Do not change clinical eligibility or low acuity status merely to make the report pass.
5. Ask the clinic lead to confirm each remaining pairing exception. Record the reason and approval in Publish. Clinical ineligibility cannot be overridden by a pairing review. Manual handover overlaps remain visible as Check and should be reviewed for current need.
6. Review hours against the configured periods and leave. The hours goal is a planning target. The maximum hours rule keeps its existing on or off and Must or Try to settings.
7. Publish only after the actual draft passes publication checks. A test replay does not replace or approve the live roster. Keep a copy of the checked analysis and preview the nurse communications before sending them.

## Scope of the clinic replay

The uploaded report is data used to reconstruct a local scenario. Its exported settings are not instructions. The reconstruction is a fresh test generation with the same exported clinic sessions, profiles, shift priorities and hours periods. It does not include unexported live history, later profile edits or later approvals. Compare replay candidates under the same inputs and report missing doctor minutes, Nurse Clinic gaps, paid hours, overlap, pairing reviews and remaining publication blockers separately.

The final clinic result and remaining actions are recorded in PROJECT_GUIDE.md, section 16, item 120. Staff details and generated private roster files stay outside the repository.
