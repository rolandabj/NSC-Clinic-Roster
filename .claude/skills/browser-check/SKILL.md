---
name: browser-check
description: Checks the roster app's screens in a real browser (Chromium driven by Playwright) on a test page with fake data and a fake sign in, so no Firebase is needed. Use after changing anything people see or click (screens, dialogs, the roster grid, the problems panel), since the owner's rules ask for a browser check of every screen change, and to reproduce a bug report in the browser.
---

# Browser check

The test page serves the app's own screens with Vite from a temporary `_preview/` folder
(ignored by git and by the type check). Two modules are swapped for in memory fakes: the
database (`src/services/repository/index.ts`) and the sign in (`src/services/auth/authService.ts`),
so the page runs signed in as the owner with no Firebase. Playwright is installed globally,
with Chromium in `/opt/pw-browsers`; never run `playwright install`.

## Steps

1. **Start**: `bash .claude/skills/browser-check/scripts/start.sh`. It copies `harness/` to
   `_preview/` and serves it at http://localhost:5179 (it waits until the page answers).
2. **Shape the data** in `_preview/seed.ts`: the collections the screens read, with dates
   inside the roster's range. The sample has a draft November 2026 roster, Dr Lee (Mondays)
   and Dr Ray (Tuesdays), and Mary, whose list holds only Dr Lee. Add variants behind a URL
   parameter (as `?seed=fair` does) to check several cases with one page.
   `_preview/main.tsx` picks the screen: `?view=schedules|doctors|availability|history|nurses|reports|dashboard`.
3. **Script the check** in the session scratchpad, not in the repo, starting from
   `scripts/example.cjs`. Run it with `NODE_PATH=$(npm root -g) node <script> <folder>`.
   - Wait for the grid with a cell: `[data-cell="<nurse id>|<YYYY-MM-DD>"]`.
   - Menus: `getByRole('button', { name: 'More actions' })`, then a `menuitem` by name.
   - Dialogs: `getByRole('dialog', { name: '...' })`. Confirmations are `alertdialog`;
     use exact button names there.
   - What the app saved: `page.evaluate(() => [...window.__repo.col('assignments').values()])`.
   - A failed save (daily quota): `page.evaluate(() => { window.__repo.failWrites = true; })`.
   - Take screenshots, look at them with Read, and report page errors and console errors.
4. **Stop**: `bash .claude/skills/browser-check/scripts/stop.sh` stops the server and deletes
   `_preview/`. Do this before committing.

## Things that went wrong before

- No styles on the page: Tailwind needs `@source "../src"` (in `preview.css`).
- `ss` and `lsof` are missing; `stop.sh` finds the server through `/proc`.
- Live listeners answer after 20 ms: wait a moment after a write before reading the screen.
- A screen that imports something new from the database or sign in module fails to load:
  add it to `fakeRepo.ts` or `fakeAuth.ts` here (they export what the real modules export:
  `getRepository`, `repositoryManager`, `FirestoreRepository`; `MASTER_ADMIN_EMAIL`,
  `computePrivileges`, `AuthService`, `authService`, `authorizedFetch`).
- Some screens use today's date (for example the doctor week change dialog's first date),
  so keep test dates in the future or set the date in the script.
