---
name: finish-change
description: The owner's routine for finishing every change in this repo. Verify (type check, unit tests, build, email server check, plus the emulator, rules tests and a browser check when they apply), clean up, update PROJECT_GUIDE.md and the code graph, commit, push the working branch and report in plain English. Pushes to main only after the owner says "push to main". Use when a change is ready, before committing it.
---

# Finish a change

The owner's standing rules are in `CLAUDE.md` and section 0 of `PROJECT_GUIDE.md`. This is
the same routine as one checklist, with the traps met in earlier sessions. Work through it
in order and report anything skipped.

## 1. Verify

Always:

- `npx tsc --noEmit` (about 13 s)
- `npm test`: note the number of tests for the guide.
- `npm run build`, **then** `node --import tsx tests/integration/emailServer.test.ts`. The email
  check needs the build output, so this order matters. Afterwards `rm -rf build dist`.

When they apply:

- **Database code changed** (`src/services/repository/`): the emulator test, then `rm -f firestore-debug.log`:
  `npm exec --yes --package=firebase-tools@14.12.0 -- firebase emulators:exec --config firebase.emulator.json --only firestore --project demo-roster 'node --import tsx tests/integration/scheduleTransactions.test.ts'`
- **`firestore.rules` changed**: `cd tests/firestore-rules && npm install && npm test`, ask the
  `firestore-rules-reviewer` agent for a review, and remind the owner to publish the rules by
  hand in the Firebase console (Firestore, the named database, Rules). With the Firebase key
  set, `node .claude/scripts/published-rules.mjs` shows whether the published rules match.
- **A screen changed**: the `browser-check` skill.
- **Words people see changed** (screens, checker messages, emails, the guide): ask the
  `plain-english-reviewer` agent.
- **The engine changed**: say which rosters or test clinics were replayed and what changed in
  hours and "Must fix" counts, as earlier batches did.

Then read your own diff as a reviewer would: what would make CI or the owner reject it?

## 2. Clean up

`git status --short` must show only the files meant for the commit. Watch for:

- `_preview/` (stop the test page with the `browser-check` skill's `stop.sh`)
- `build/`, `dist/`, `firestore-debug.log`
- `package-lock.json`: `npm install` makes one, but the repo has none. Delete it.
- scratch scripts: they belong in the session scratchpad, not the repo.

## 3. Update PROJECT_GUIDE.md

- The sections the change touches.
- The unit test count, in two places: the table in section 0 and section 15.
- A new item at the end of section 16 (the next number). Say what changed and why, with
  concrete examples, and the owner's decisions with their dates. Give the tests added and the
  new total, and the checks run. Say whether the Firestore rules changed, and whether the
  change is pushed to main.
- The "Last updated" line: the date, the item, and "on the working branch; not pushed to main
  yet" (or "pushed to main").

Write it all in plain English with no hyphens, using "they" for people.

## 4. Refresh the code graph

`export PATH="$HOME/.local/bin:$PATH"; graphify update .` then include the changed files in `graphify-out/`.

## 5. Commit

`git add -A`, then a message with a short plain English title and a body saying what and why.
End it with the attribution lines the session gives (Co-Authored-By and Claude-Session), and
never name a model. A hook refuses a commit that changes code without `PROJECT_GUIDE.md`.

## 6. Push the working branch

`git push -u origin <working branch>`. Only on network errors, retry up to 4 times, waiting
2, 4, 8 and 16 s.

## 7. Main: only after the owner says "push to main"

1. `git fetch origin main`, then `git merge-base --is-ancestor origin/main HEAD`. Main must fast
   forward: if it has moved, merge it into the branch first (never rewrite history).
2. Record the approval: the "Last updated" line says "pushed to main", and the item says "The
   owner approved pushing it to main on <date>". Refresh the graph, then commit "Guide: item N
   approved for main".
3. `git push -u origin <working branch>`, then `git push origin <working branch>:main`. A hook
   makes the app ask the owner to confirm; that is expected.
4. Check CI. Wait about 75 s in the background (`sleep 75` run in the background, never in
   the foreground). Then read the newest CI run on main with the GitHub tools
   (`actions_list`, method `list_workflow_runs`, branch `main`, event `push`). If it failed,
   fix it before anything else.

## 8. Report

Plain English, no hyphens, with concrete examples:

- what changed for the owner;
- what was checked and how;
- anything not run, and why;
- what is not on main yet;
- the reminder to publish rules by hand, when they changed.
