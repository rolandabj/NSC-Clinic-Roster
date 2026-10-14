# Handover for a new chat

Written 14-10-2026, at the end of UI overhaul Phase 5 (all four slices done and on main).
Start a new chat by reading this file, then `CLAUDE.md` and `PROJECT_GUIDE.md`.

## 1. Where things stand

| | |
|---|---|
| Working branch | `claude/ui-overhaul` (main fast forwards to it) |
| On main | Everything up to Phase 6 slice 5 (guide items 42 to 79) |
| Done | Phases 0 to 5 with Checkpoints 1 to 5 (Checkpoint 5 is guide item 73, on main) |
| Next | Phase 7 (dialogs, publishing and History), when the owner says go |
| Unit tests | 460 passing, and 98 Firestore rules checks in the emulator |
| Firestore rules | Not changed by the overhaul, so there is nothing to publish by hand |
| HawkScan | Never run: the session has no `HAWK_API_KEY`. The owner knows |

The plan is `tasks/plan.md`, the checklist `tasks/todo.md`, the longer summary `tasks/summary.md`
(its numbers stop at Phase 3) and the full record of each step `PROJECT_GUIDE.md`, section 16.

## 2. How the owner likes to work

* Chat replies in the caveman voice (`.claude/skills/caveman/SKILL.md`), until the owner says
  "stop caveman" or "normal mode". Questions to the owner, their options, security warnings and
  steps before something that cannot be undone stay in full sentences.
* Everything kept outside the chat (the guide, `tasks/`, commits, code comments, words on screen,
  GitHub posts) is plain English with no hyphens or dashes in prose, "they" for people, and dates
  as DD-MM-YYYY.
* Use the `ui-ux-pro-max` skill for screen work.
* Work in small slices. Inspect before fixing. Write a test that fails without the change for any
  logic change. Ask before pushing to main: main moves only when the owner says "push to main" or
  "push".

## 3. Every commit

1. Run the checks: `npx tsc --noEmit`, `npm test`, `npm run build`, and
   `node --import tsx tests/integration/emailServer.test.ts` (4 PASS lines).
2. For screen changes, check in the browser: `bash .claude/skills/browser-check/scripts/start.sh prod`
   serves the test page at http://localhost:5180 (`?view=app&as=nurse#...`, `?view=me`,
   `?view=published`, `?view=ack`, `?seed=big`; `window.__repo.col(name)` is a Map of what was
   saved). Run the scripts in `.claude/skills/browser-check/scripts/` with
   `NODE_PATH=$(npm root -g) node <script> --base http://localhost:5180`, and `stop.sh` before
   committing.
3. When repository or server code changes, run the `firestore-rules-reviewer` agent (it runs the
   emulator tests). Have new words checked by the `plain-english-reviewer` agent.
4. Update `PROJECT_GUIDE.md`: the sections touched, the test count (section 0 table and
   section 15), a new item at the end of section 16, and the "Last updated" line (say whether
   the work is on main).
5. `graphify update .`, then `git checkout -- .claude/skills/ui-ux-pro-max/scripts/__pycache__/`.
   Never commit a `package-lock.json` (the rules tests leave one in `tests/firestore-rules/`).
6. Stage, then commit as a separate command chained with `&&`, so a failed edit stops the commit.
   End with the attribution lines given by the session, and no model name in the message.
7. Push the branch: `git push -u origin claude/ui-overhaul`.

**Pushing to main** (only on the owner's word): check `git merge-base --is-ancestor origin/main HEAD`;
in the guide, change each new item's "On the working branch, not yet on main." to "The owner
approved pushing it to main on DD-MM-YYYY." and update the Last updated line; commit
"Guide: items X approved for main"; push the branch, then `git push origin HEAD:main`; after about
100 seconds check the CI run on main with the GitHub tools (`actions_list`, `list_workflow_runs`,
branch main).

## 4. What Phases 4 and 5 did (guide items 59 to 72)

**Phase 4, the roster screen** (items 59 to 67):

* One problem count everywhere.
* The sheet tabs sit above the roster as real tabs, with one Key and Full screen once.
* The toolbar fits on one line from 1024 px, and More has four groups.
* Each cell shows the doctor's first name, the start and end time, and the marks, in three lines.
* The headings, keys and spoken words were fixed, and the full size roster is faster.
* On a phone (under 700 px wide or 500 px high) the roster is read one day at a time and cannot
  be edited.
* Checkpoint 4 added review fixes, 24 px targets and 12 px text.

**Phase 5, the nurse screens and the decision email** (items 68 to 72):

* The nurse's private page shows the next shift and the days coming up as cards.
* My requests has cards with Waiting, Approved and Declined, and checks before sending.
* The read receipt page, the published roster page and a nurse's dashboard are made for phones.
* Slice 4 added the request decision email:
  * A switch in Settings, Email turns it on: "Email nurses when their request is approved or
    declined". It is off at first.
  * After each decision, `decideRequest` calls `POST /api/requests/:id/notify`
    (`server/routes/requests.ts`). The server reads the request and the nurse with the caller's
    token, writes the email (`src/services/requests/decisionEmail.ts`) and sends it to that nurse
    only.
  * Tests are in `tests/unit/decisionEmail.test.ts`.

## 5. What comes next

1. **Checkpoint 5**: done (guide item 73). Six faults fixed; the audit at 390 and 1366 px is clean.
2. **Phase 6, the planner screens** (see `tasks/plan.md`):
   * Nurses and Doctors as lists with search and filters, and editors that check each field.
   * Availability split into "Leave and days off" and "Requests".
   * A leave grid that works without dragging.
   * The planner screens still say "Pending" where nurses see "Waiting"; change them to Waiting (done, item 78).
   * Nurses has 4 serious axe problems and the planner's Availability screen has 9; fix them in
     this phase.
3. Phases 7 to 9 as in the plan: dialogs, publishing and History; Settings, Reports and Audit;
   tidy up and the final audit.

## 6. Points to know

* The request decision emails are not in the email log: only editors may write it, and managers
  decide requests too. The server remembers which decisions it has emailed only until it
  restarts; the 15 minute limit stops an old decision being sent again.
* `staffRequestService.decideRequest` starts the email without waiting for it to finish. A failure only
  writes a warning to the browser's console.
* Known test page artefact: axe flags grid cells cut off at the edge of the scroll area.
* "ClinicRoster" still appears in the roster email and the
  test email (Phase 7).
